"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StartPage() {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("hbshuttle_beta_access");
    setHasAccess(access === "true");
  }, []);

  if (!hasAccess) {
    return (
      <main className="startPage">
        <section className="startCard">
          <p className="startBadge">Beta Access</p>
          <h1>Åtkomst krävs</h1>
          <p>
            Du behöver logga in med betakoden för att komma vidare till startsidan.
          </p>
          <Link href="/" className="startButton">
            Tillbaka till inloggning
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="startPage">
      <section className="startCard">
        <p className="startBadge">Helsingbuss Airport Shuttle</p>
        <h1>Välkommen till beta-startsidan</h1>
        <p>
          Du är nu inloggad med beta-access. Här bygger vi snart startsidan med
          sök resa, planerade linjer, avgångar och bokning.
        </p>

        <div className="startActions">
          <Link href="/" className="startButton secondary">
            Tillbaka
          </Link>

          <button
            className="startButton"
            onClick={() => {
              localStorage.removeItem("hbshuttle_beta_access");
              window.location.href = "/";
            }}
          >
            Logga ut
          </button>
        </div>
      </section>
    </main>
  );
}
