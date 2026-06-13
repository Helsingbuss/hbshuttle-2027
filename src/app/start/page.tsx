"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BetaHeader from "@/components/BetaHeader";

export default function StartPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("hbshuttle_beta_access");
    setHasAccess(access === "true");
    setCheckedAccess(true);
  }, []);

  if (!checkedAccess) {
    return null;
  }

  if (!hasAccess) {
    return (
      <main className="startPage">
        <section className="startCard">
          <p className="startBadge">Beta Access</p>
          <h1>Åtkomst krävs</h1>
          <p>
            Du behöver logga in med betakoden för att komma vidare till
            beta-startsidan.
          </p>
          <Link href="/" className="startButton">
            Tillbaka till inloggning
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="betaApp">
      <BetaHeader />

      <section className="betaHero">
        <div className="betaHeroContent">
          <p className="startBadge">Beta Access</p>
          <h1>Välkommen till HB Shuttle</h1>
          <p>
            Här bygger vi den kommande startsidan för Helsingbuss Airport
            Shuttle. Nästa steg blir köpflöde, tidtabell, hållplatser och
            trafikinfo.
          </p>

          <div className="betaHeroActions">
            <Link href="/start" className="startButton">
              Köp resa
            </Link>

            <Link href="/start/tidtabell" className="startButton secondary">
              Se tidtabell
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
