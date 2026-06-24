"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campaignCode: string;
  acceptTerms: boolean;
  marketing: boolean;
};

type CheckoutPaymentFormProps = {
  bookingReference: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function money(value: number) {
  return `${value.toLocaleString("sv-SE")} kr`;
}

function getNumber(params: URLSearchParams, key: string, fallback = 0) {
  const value = Number(params.get(key) || fallback);
  return Number.isFinite(value) ? value : fallback;
}

function getPeriodEndDate(startDate: string, days: number) {
  const start = new Date(startDate + "T00:00:00");

  if (Number.isNaN(start.getTime())) {
    return "";
  }

  const end = new Date(start);
  end.setDate(end.getDate() + days - 1);

  return end.toISOString().slice(0, 10);
}

function passengerSummary(params: URLSearchParams) {
  const adults = getNumber(params, "adults", 1);
  const children = getNumber(params, "children", 0);
  const youth = getNumber(params, "youth", 0);
  const seniors = getNumber(params, "seniors", 0);

  const total = adults + children + youth + seniors;
  const parts: string[] = [];

  if (adults === 1) parts.push("1 vuxen");
  if (adults > 1) parts.push(`${adults} vuxna`);
  if (children === 1) parts.push("1 barn");
  if (children > 1) parts.push(`${children} barn`);
  if (youth === 1) parts.push("1 ungdom");
  if (youth > 1) parts.push(`${youth} ungdomar`);
  if (seniors === 1) parts.push("1 senior");
  if (seniors > 1) parts.push(`${seniors} seniorer`);

  if (parts.length === 0) return "1 vuxen";
  if (parts.length <= 2) return parts.join(", ");

  return `${total} resenärer`;
}

function CheckoutPaymentForm({ bookingReference }: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  
  const [paymentElementReady, setPaymentElementReady] = useState(false);async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError("Betalningen är inte redo ännu. Försök igen om några sekunder.");
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    if (!paymentElementReady) {
      setPaymentError("Betalningsrutan är inte färdigladdad än. Vänta några sekunder och försök igen.");
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/start/tack?bookingReference=${encodeURIComponent(
          bookingReference
        )}`,
      },
    });

    if (result.error) {
      setPaymentError(result.error.message || "Betalningen kunde inte genomföras.");
      setIsPaying(false);
    }
  }

  return (
    <form className="checkoutPaymentForm" onSubmit={handleSubmit}>
      <PaymentElement
                    onReady={() => setPaymentElementReady(true)}
                    onLoadError={(event) => {
                      console.error("Payment Element load error:", event);
                      setPaymentError(
                        event?.error?.message || "Betalningsrutan kunde inte laddas."
                      );
                    }}
                  />

      {paymentError ? (
        <div className="checkoutError">{paymentError}</div>
      ) : null}

      <button
        type="submit"
        className="checkoutPayButton"
        disabled={!stripe || !elements || !paymentElementReady || isPaying}
      >
        {isPaying ? "Behandlar betalning..." : "Slutför betalning"}
      </button>
    </form>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "Ängelholm Airport";
  const to = searchParams.get("to") || "Helsingborg C";
  const date = searchParams.get("date") || "Välj datum";
  const departureId = searchParams.get("departureId") || "";
  const departureTime = searchParams.get("departureTime") || "Vald avgång";
  const arrivalTime = searchParams.get("arrivalTime") || "";
  const line = searchParams.get("line") || "Linje 101";
  const comfort = searchParams.get("comfort") || "economy";
  const ticketType = searchParams.get("ticketType") || "Enkel";
  const passType = searchParams.get("passType") || "";
  const isPeriodPass = passType === "period_30_days";
  const periodStartDate = searchParams.get("periodStartDate") || date;
  const periodValidDays = getNumber(searchParams, "periodValidDays", 30);
  const periodValidTo = getPeriodEndDate(periodStartDate, periodValidDays);

  const adults = getNumber(searchParams, "adults", 1);
  const children = getNumber(searchParams, "children", 0);
  const youth = getNumber(searchParams, "youth", 0);
  const seniors = getNumber(searchParams, "seniors", 0);

  const ticketPrice = getNumber(searchParams, "ticketPrice", 129);
  const addonsTotal = getNumber(searchParams, "addonsTotal", 0);

  const extraBaggage = getNumber(searchParams, "extraBaggage", 0);
  const specialBaggage = getNumber(searchParams, "specialBaggage", 0);
  const cancellationProtection = searchParams.get("cancellationProtection") === "1";
  const smsTicket = searchParams.get("smsTicket") === "1";

  const totalAmount = ticketPrice + addonsTotal;
  const vatAmount = Math.round((totalAmount * 0.06 / 1.06) * 100) / 100;

  const [customer, setCustomer] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    campaignCode: "",
    acceptTerms: false,
    marketing: false,
  });

  const [clientSecret, setClientSecret] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const travelers = useMemo(() => {
    return passengerSummary(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  function updateCustomer(key: keyof CustomerForm, value: string | boolean) {
    setCustomer((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function goBack() {
    router.push(`/start/tillagg?${searchParams.toString()}`);
  }

  async function createStripePayment() {
    if (!customer.email || !customer.email.includes("@")) {
      setCheckoutError("Fyll i en giltig e-postadress.");
      return;
    }

    if (!customer.firstName || !customer.lastName) {
      setCheckoutError("Fyll i förnamn och efternamn.");
      return;
    }

    if (!customer.phone) {
      setCheckoutError("Fyll i telefonnummer.");
      return;
    }

    if (!customer.acceptTerms) {
      setCheckoutError("Du behöver godkänna villkoren för att gå vidare.");
      return;
    }

    setCheckoutError("");
    setIsCreatingPayment(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/public/shuttle/checkout/create-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "sek",
            customer: {
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phone: customer.phone,
            },
            trip: {
              from,
              to,
              date,
              departureId,
              departureTime,
              arrivalTime,
              line,
            },
            passengers: {
              adults,
              children,
              youth,
              seniors,
            },
            ticket: {
              ticketType,
              comfort,
              ticketPrice,
              passType,
              periodStartDate: isPeriodPass ? periodStartDate : null,
              periodValidDays: isPeriodPass ? periodValidDays : null,
              periodValidTo: isPeriodPass ? periodValidTo : null,
            },
            addons: {
              extraBaggage,
              specialBaggage,
              cancellationProtection,
              smsTicket,
              addonsTotal,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error || "Kunde inte skapa betalningen.");
      }

      setClientSecret(data.clientSecret);
      setBookingReference(data.bookingReference || "");
    } catch (error: any) {
      setCheckoutError(error?.message || "Kunde inte skapa betalningen.");
    } finally {
      setIsCreatingPayment(false);
    }
  }

  return (
    <>
      <BetaHeader sticky />

      <main className="checkoutPage">
        <section className="checkoutShell">
          <div className="checkoutTop">
            <button type="button" className="checkoutBack" onClick={goBack}>
              ← Tillbaka
            </button>

            <div>
              <p>Helsingbuss Airport Shuttle</p>
              <h1>Kassa</h1>
            </div>
          </div>

          <div className="checkoutGrid">
            <section className="checkoutMainCard">
              <div className="checkoutBlock">
                <div className="checkoutBlockHeader">
                  <h2>Mina uppgifter</h2>
                  <span>Fyll i kontaktuppgifter för biljett och kvitto.</span>
                </div>

                <div className="checkoutFormGrid">
                  <label className="checkoutField">
                    <span>Förnamn</span>
                    <input
                      value={customer.firstName}
                      onChange={(event) => updateCustomer("firstName", event.target.value)}
                      placeholder="Förnamn"
                      disabled={Boolean(clientSecret)}
                    />
                  </label>

                  <label className="checkoutField">
                    <span>Efternamn</span>
                    <input
                      value={customer.lastName}
                      onChange={(event) => updateCustomer("lastName", event.target.value)}
                      placeholder="Efternamn"
                      disabled={Boolean(clientSecret)}
                    />
                  </label>

                  <label className="checkoutField checkoutFieldWide">
                    <span>E-postadress</span>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(event) => updateCustomer("email", event.target.value)}
                      placeholder="namn@exempel.se"
                      disabled={Boolean(clientSecret)}
                    />
                  </label>

                  <label className="checkoutField checkoutFieldWide">
                    <span>Telefonnummer</span>
                    <input
                      value={customer.phone}
                      onChange={(event) => updateCustomer("phone", event.target.value)}
                      placeholder="070-000 00 00"
                      disabled={Boolean(clientSecret)}
                    />
                  </label>
                </div>
              </div>

              <div className="checkoutBlock">
                <div className="checkoutBlockHeader">
                  <h2>Kampanjkod</h2>
                  <span>Har du en rabattkod eller kampanjkod?</span>
                </div>

                <div className="checkoutCampaignRow">
                  <input
                    value={customer.campaignCode}
                    onChange={(event) => updateCustomer("campaignCode", event.target.value)}
                    placeholder="Ange kod"
                    disabled={Boolean(clientSecret)}
                  />
                  <button type="button" disabled={Boolean(clientSecret)}>
                    Lägg till
                  </button>
                </div>
              </div>

              <div className="checkoutBlock">
                <div className="checkoutBlockHeader">
                  <h2>Betalning</h2>
                  <span></span>
                </div>

                <label className="checkoutCheck">
                  <input
                    type="checkbox"
                    checked={customer.acceptTerms}
                    onChange={(event) => updateCustomer("acceptTerms", event.target.checked)}
                    disabled={Boolean(clientSecret)}
                  />
                  <span>Jag godkänner HB Shuttles resevillkor och integritetspolicy.</span>
                </label>

                <label className="checkoutCheck">
                  <input
                    type="checkbox"
                    checked={customer.marketing}
                    onChange={(event) => updateCustomer("marketing", event.target.checked)}
                    disabled={Boolean(clientSecret)}
                  />
                  <span>Jag vill få information och erbjudanden från HB Shuttle via e-post.</span>
                </label>

                {checkoutError ? (
                  <div className="checkoutError">{checkoutError}</div>
                ) : null}

                {!clientSecret ? (
                  <>
<button
                      type="button"
                      className="checkoutPayButton"
                      onClick={createStripePayment}
                      disabled={isCreatingPayment}
                    >
                      {isCreatingPayment ? "Förbereder betalning..." : "Fortsätt till betalning"}
                    </button>
                  </>
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#007764",
                          colorText: "#102a36",
                          borderRadius: "12px",
                          fontFamily: "Open Sans, system-ui, sans-serif",
                        },
                      },
                    }}
                  >
                    <CheckoutPaymentForm bookingReference={bookingReference} />
                  </Elements>
                )}
              </div>
            </section>

            <aside className="checkoutSummaryCard">
              <div className="checkoutSummaryHeader">
                <h2>Resedetaljer</h2>
                <span>{line}</span>
              </div>

              <div className="checkoutRouteLine">
                <div>
                  <span></span>
                  <strong>{from}</strong>
                </div>

                <div className="checkoutRouteMiddle"></div>

                <div>
                  <span></span>
                  <strong>{to}</strong>
                </div>
              </div>

              <div className="checkoutSummaryMeta">
                <div>
                  <small>Datum</small>
                  <strong>{date}</strong>
                </div>

                <div>
                  <small>Tid</small>
                  <strong>
                    {departureTime}
                    {arrivalTime ? ` – ${arrivalTime}` : ""}
                  </strong>
                </div>

                <div>
                  <small>Resenärer</small>
                  <strong>{travelers}</strong>
                </div>

                <div>
                  <small>Biljett</small>
                  <strong>{isPeriodPass ? ticketType + " · 30 dagar" : ticketType + " · " + (comfort === "plus" ? "Plus" : "Ekonomi")}</strong>
                </div>
              </div>

              {isPeriodPass ? (
                <div className="checkoutPeriodInfo">
                  <span>Giltighet</span>
                  <strong>{periodStartDate} - {periodValidTo || "30 dagar"}</strong>
                  <p>Periodkortet gäller på vald sträcka. Plats bokas separat inför varje resa när funktionen är aktiverad.</p>
                </div>
              ) : null}

              <div className="checkoutPriceList">
                <div>
                  <span>{isPeriodPass ? "Periodkort" : "Biljett"}</span>
                  <strong>{money(ticketPrice)}</strong>
                </div>

                {extraBaggage > 0 ? (
                  <div>
                    <span>Extra bagage × {extraBaggage}</span>
                    <strong>{money(extraBaggage * 49)}</strong>
                  </div>
                ) : null}

                {specialBaggage > 0 ? (
                  <div>
                    <span>Specialbagage × {specialBaggage}</span>
                    <strong>{money(specialBaggage * 99)}</strong>
                  </div>
                ) : null}

                {cancellationProtection ? (
                  <div>
                    <span>Avbokningsskydd</span>
                    <strong>{money(49)}</strong>
                  </div>
                ) : null}

                {smsTicket ? (
                  <div>
                    <span>SMS-biljett</span>
                    <strong>{money(5)}</strong>
                  </div>
                ) : null}

                <div>
                  <span>Moms 6%</span>
                  <strong>{vatAmount.toLocaleString("sv-SE")} kr</strong>
                </div>
              </div>

              <div className="checkoutTotal">
                <span>Ordersumma inkl. moms</span>
                <strong>{money(totalAmount)}</strong>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="checkoutPage">
          <section className="checkoutShell">
            <div className="checkoutTop">
              <div>
                <p>Helsingbuss Airport Shuttle</p>
                <h1>Kassa</h1>
              </div>
            </div>
          </section>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}




