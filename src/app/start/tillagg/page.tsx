"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

type AddonCounts = {
  extraBaggage: number;
  specialBaggage: number;
};

function getPassengerSummary(searchParams: URLSearchParams) {
  const adults = Number(searchParams.get("adults") || "1");
  const children = Number(searchParams.get("children") || "0");
  const youth = Number(searchParams.get("youth") || "0");
  const seniors = Number(searchParams.get("seniors") || "0");

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

function AddonCounter({
  title,
  description,
  price,
  value,
  onMinus,
  onPlus,
}: {
  title: string;
  description: string;
  price: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="addonsCounterRow">
      <div className="addonsCounterText">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <div className="addonsCounterActions">
        <button type="button" onClick={onMinus} disabled={value <= 0}>
          −
        </button>

        <span>{value}</span>

        <button type="button" onClick={onPlus}>
          +
        </button>

        <strong className="addonsPrice">{price}</strong>
      </div>
    </div>
  );
}

function AddonCheckbox({
  title,
  description,
  price,
  infoText,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  price: string;
  infoText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="addonsCheckboxCard">
      <div>
        <strong className="addonsCheckboxTitle">
          {title} <span>{price}</span>

          {infoText ? (
            <span
              className="addonsInfoWrap"
              onClick={(event) => event.preventDefault()}
            >
              <span className="addonsInfoIcon">i</span>
              <span className="addonsInfoTooltip">{infoText}</span>
            </span>
          ) : null}
        </strong>

        <p>{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function AddonsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "Ängelholm Airport";
  const to = searchParams.get("to") || "Helsingborg C";
  const date = searchParams.get("date") || "Välj datum";
  const departureTime = searchParams.get("departureTime") || searchParams.get("time") || "";
  const ticketType = searchParams.get("ticketType") || "Enkel";

  const [addons, setAddons] = useState<AddonCounts>({
    extraBaggage: Number(searchParams.get("extraBaggage") || "0"),
    specialBaggage: Number(searchParams.get("specialBaggage") || "0"),
  });

  const [cancellationProtection, setCancellationProtection] = useState(
    searchParams.get("cancellationProtection") === "1"
  );

  const [smsTicket, setSmsTicket] = useState(searchParams.get("smsTicket") === "1");

  const passengerSummary = useMemo(() => {
    return getPassengerSummary(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  const totalAddonsPrice =
    addons.extraBaggage * 49 +
    addons.specialBaggage * 99 +
    (cancellationProtection ? 49 : 0) +
    (smsTicket ? 5 : 0);

  function updateAddon(key: keyof AddonCounts, direction: "minus" | "plus") {
    setAddons((current) => ({
      ...current,
      [key]:
        direction === "minus"
          ? Math.max(0, current[key] - 1)
          : current[key] + 1,
    }));
  }

  function goBack() {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/start/valj-avgang?${params.toString()}`);
  }

  function goNext() {
    const params = new URLSearchParams(searchParams.toString());

    params.set("extraBaggage", String(addons.extraBaggage));
    params.set("specialBaggage", String(addons.specialBaggage));
    params.set("cancellationProtection", cancellationProtection ? "1" : "0");
    params.set("smsTicket", smsTicket ? "1" : "0");
    params.set("addonsTotal", String(totalAddonsPrice));

    router.push(`/start/kunduppgifter?${params.toString()}`);
  }

  return (
    <>
      <BetaHeader />

      <main className="addonsPage">
        <section className="addonsHero">
          <p>Helsingbuss Airport Shuttle</p>
          <h1>Tilläggstjänster</h1>
          <span>Välj till det du behöver inför resan.</span>
        </section>

        <section className="addonsCard">
          <div className="addonsRoute">
            <strong>{from}</strong>

            <span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>

            <strong>{to}</strong>
          </div>

          <div className="addonsTripMeta">
            <div>
              <small>Datum</small>
              <strong>{date}</strong>
            </div>

            <div>
              <small>Avgång</small>
              <strong>{departureTime || "Vald avgång"}</strong>
            </div>

            <div>
              <small>Biljett</small>
              <strong>{ticketType}</strong>
            </div>

            <div>
              <small>Resenärer</small>
              <strong>{passengerSummary}</strong>
            </div>
          </div>

          <div className="addonsSection">
            <h2>Bagage</h2>

            <AddonCounter
              title="Extra bagage"
              description="För dig som vill ta med extra väska utöver ordinarie bagage."
              price="49 kr"
              value={addons.extraBaggage}
              onMinus={() => updateAddon("extraBaggage", "minus")}
              onPlus={() => updateAddon("extraBaggage", "plus")}
            />

            <AddonCounter
              title="Specialbagage"
              description="För större bagage som kräver extra utrymme, till exempel golfbag eller liknande."
              price="99 kr"
              value={addons.specialBaggage}
              onMinus={() => updateAddon("specialBaggage", "minus")}
              onPlus={() => updateAddon("specialBaggage", "plus")}
            />
          </div>

          <div className="addonsSection">
            <h2>Extra trygghet</h2>

            <AddonCheckbox
              title="Avbokningsskydd"
              price="från 49 kr"
              description="Logga in/Registrera | Avboka din resa fram till 1 timme före avgång och få tillbaka hela bokningsvärdet, exklusive kostnaden för avbokningsskyddet. Som medlem i HB Shuttle Club får du 50% rabatt på avbokningsskyddet, med lägsta avgift 49 kr."
              infoText="Avboka din resa upp till 1 timme före avgång och få tillbaka hela biljettpriset, exklusive kostnaden för avbokningsskyddet. Avbokningsskyddet gäller även för valt säte och extra bagage. Pris: 15% av biljettpriset inklusive tillval. Minsta avgift är 49 kr per resenär och resa. Avbokning görs enkelt via ditt bokningsnummer. Som medlem i HB Shuttle Club får du 50% rabatt på avbokningsskyddet. Logga in eller registrera dig på hbshuttle.se/club."
              checked={cancellationProtection}
              onChange={setCancellationProtection}
            />

            <AddonCheckbox
              title="Få biljett via SMS"
              price="5 kr"
              description="Vi skickar din biljettlänk även via SMS."
              checked={smsTicket}
              onChange={setSmsTicket}
            />
          </div>

          <div className="addonsBottom">
            <div>
              <small>Tillägg totalt</small>
              <strong>{totalAddonsPrice} kr</strong>
            </div>

            <div className="addonsBottomActions">
              <button type="button" className="addonsBackButton" onClick={goBack}>
                Tillbaka
              </button>

              <button type="button" className="addonsNextButton" onClick={goNext}>
                Gå vidare
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

export default function AddonsPage() {
  return (
    <Suspense
      fallback={
        <main className="addonsPage">
          <section className="addonsHero">
            <p>Helsingbuss Airport Shuttle</p>
            <h1>Tilläggstjänster</h1>
          </section>
        </main>
      }
    >
      <AddonsContent />
    </Suspense>
  );
}
