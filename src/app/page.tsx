"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const routes = [
  "Helsingborg – Ängelholm",
  "Helsingborg – Malmö Airport",
  "Båstad – Ängelholm",
];

const BETA_CODE = "HBSHUTTLE2027";

export default function Home() {
  const router = useRouter();

  const [betaCode, setBetaCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submitBeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanedCode = betaCode.trim().toUpperCase();

    if (!cleanedCode) {
      setMessage("Fyll i din åtkomstkod först.");
      return;
    }

    if (cleanedCode !== BETA_CODE) {
      setMessage("Koden stämmer inte. Kontrollera att du skrivit rätt kod.");
      return;
    }

    localStorage.setItem("hbshuttle_beta_access", "true");
    router.push("/start");
  }

  async function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      setMessage("Fyll i din e-postadress först.");
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/public/shuttle/interest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanedEmail,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.error || "Kunde inte spara din e-post just nu. Försök igen.");
        return;
      }

      setMessage(data?.message || "Tack! Vi meddelar dig när Helsingbuss Airport Shuttle öppnar.");
      setEmail("");
    } catch (error) {
      console.error("Could not submit email interest:", error);
      setMessage("Kunde inte spara din e-post just nu. Försök igen.");
    }
  }

  return (
    <main className="page">
      <section className="landing">
        <aside className="hero">
          <div className="heroPhoto" />
          <div className="heroOverlay" />
          <div className="heroMotion" />

          <div className="brand">
            <div className="brandMain">Helsingbuss</div>
            <div className="brandSub">Airport Shuttle</div>
            <div className="brandLine" />
          </div>

          <div className="heroTitle">
            <h1>
              Smidigt till flyget.
              <span>Tryggt hela vägen.</span>
            </h1>
          </div>

          <div className="routeBox" id="linjer">
            <div className="routeIcon">✈</div>
            <div>
              <h2>Planerade linjer</h2>
              <ul>
                {routes.map((route) => (
                  <li key={route}>{route}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <section className="content">
          <div className="planeDecor" aria-hidden="true">
            <span>✈</span>
            <i />
          </div>

          <div className="betaBadge">
            <span>▣</span>
            Beta Access
          </div>

          <section className="intro">
            <h2>
              Du är tidigt ute.
              <br />
              Och det är bra.
              <br />
              <span>Snart lyfter vi.</span>
            </h2>

            <div className="pulseLine">
              <span />
            </div>

            <p>
              Helsingbuss Airport Shuttle förbereder en smidig, trygg och modern
              flygbussupplevelse. Vi bygger nu nästa steg för resor till och från flygplatsen.
            </p>

            <p>
              Beta är just nu tillgängligt för utvalda testanvändare. Logga in med din kod
              eller anmäl ditt intresse för att bli meddelad när vi öppnar.
            </p>
          </section>

          <section className="forms">
            <form className="formBlock" onSubmit={submitBeta}>
              <div className="formHead">
                <span>♙</span>
                <h3>Logga in som betatestare</h3>
              </div>

              <label htmlFor="beta-code">Ange din åtkomstkod</label>

              <div className="inputWrap">
                <input
                  id="beta-code"
                  value={betaCode}
                  onChange={(e) => setBetaCode(e.target.value)}
                  placeholder="Skriv eller klistra in din kod här"
                />
                <span>▣</span>
              </div>

              <button type="submit">Logga in</button>

              <p className="helper">
                ⓘ Har du ingen kod? <a href="mailto:info@hbshuttle.se">Kontakta oss</a>
              </p>
            </form>

            <form className="formBlock formBlockRight" onSubmit={submitEmail}>
              <div className="formHead">
                <span>✉</span>
                <h3>Vill du bli meddelad när vi öppnar?</h3>
              </div>

              <p className="formText">
                Fyll i din e-post så meddelar vi dig när vi öppnar.
              </p>

              <div className="inputWrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@exempel.se"
                />
              </div>

              <button type="submit">Meddela mig</button>

              <p className="helper">
                ▣ Vi skickar endast relevant information. Du kan avregistrera dig när som helst.
              </p>
            </form>
          </section>

          {message ? <div className="message">{message}</div> : null}

          <section className="cards">
            <article>
              <div className="cardIcon">⌖</div>
              <h3>Planerade linjer</h3>
              <p>Bekväma och pålitliga förbindelser mellan städerna och flygplatsen.</p>
              <a href="#linjer">Se planerade linjer →</a>
            </article>

            <article>
              <div className="cardIcon">▦</div>
              <h3>Planerad trafikstart</h3>
              <strong>2027</strong>
              <p>Vi planerar att starta trafik under 2027.</p>
            </article>

            <article>
              <div className="cardIcon">⬡</div>
              <h3>Tryggt & pålitligt</h3>
              <p>Moderna bussar, erfarna förare och fokus på säkerhet, punktlighet och service.</p>
            </article>
          </section>

          <footer className="footer">
            <div>✉ info@hbshuttle.se</div>
            <div>◎ hbshuttle.se</div>
            <div className="social">
              <span>Följ oss för uppdateringar</span>
              <b>◎</b>
              <b>in</b>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}
