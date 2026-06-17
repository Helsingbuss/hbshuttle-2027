"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

function ThanksContent() {
  const searchParams = useSearchParams();

  const bookingReference = searchParams.get("bookingReference") || "Din bokning";
  const redirectStatus = searchParams.get("redirect_status");

  const isSuccess = redirectStatus === "succeeded" || !redirectStatus;

  return (
    <>
      <BetaHeader sticky />

      <main className="checkoutPage">
        <section className="checkoutShell">
          <div className="thanksCard">
            <div className={isSuccess ? "thanksIcon thanksIconSuccess" : "thanksIcon"}>
              {isSuccess ? "✓" : "!"}
            </div>

            <p>Helsingbuss Airport Shuttle</p>
            <h1>{isSuccess ? "Tack för din bokning" : "Betalningen behöver kontrolleras"}</h1>

            <span>
              {isSuccess
                ? "När betalningen är bekräftad skapas biljett och kvitto. I nästa steg kopplar vi detta till portalen."
                : "Vi kunde inte bekräfta betalningen direkt. Kontrollera bokningen eller försök igen."}
            </span>

            <strong>Bokningsreferens: {bookingReference}</strong>

            <a href="/">Till startsidan</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<main className="checkoutPage"></main>}>
      <ThanksContent />
    </Suspense>
  );
}
