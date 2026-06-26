"use client";

import { useState } from "react";
import BetaHeader from "../../../components/BetaHeader";
import SiteFooter from "../../../components/SiteFooter";

type ClubTab =
  | "overview"
  | "profile"
  | "tickets"
  | "passes"
  | "reserve"
  | "balance"
  | "settings";

const menuItems: { key: ClubTab; label: string }[] = [
  { key: "overview", label: "Översikt" },
  { key: "profile", label: "Min profil" },
  { key: "tickets", label: "Mina biljetter" },
  { key: "passes", label: "Mina periodkort" },
  { key: "reserve", label: "Boka plats" },
  { key: "balance", label: "Saldo & bonus" },
  { key: "settings", label: "Inställningar" },
];

function EmptyState({
  title,
  text,
  button,
}: {
  title: string;
  text: string;
  button?: string;
}) {
  return (
    <div className="clubEmptyState">
      <div className="clubEmptyIcon">✦</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {button ? <button type="button">{button}</button> : null}
    </div>
  );
}

export default function ClubPage() {
  const [activeTab, setActiveTab] = useState<ClubTab>("overview");

  return (
    <>
      <BetaHeader sticky />

      <main className="clubPage">
        <section className="clubHero">
          <p>HB Shuttle Club</p>
          <h1>Mina sidor</h1>
          <span>
            Hantera dina biljetter, periodkort och resor med Helsingbuss Airport Shuttle.
          </span>
        </section>

        <section className="clubShell">
          <aside className="clubSidebar">
            <div className="clubUserCard">
              <div className="clubAvatar">HB</div>
              <div>
                <strong>Välkommen</strong>
                <span>Logga in eller registrera dig</span>
              </div>
            </div>

            <nav className="clubSideNav" aria-label="HB Shuttle Club meny">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={activeTab === item.key ? "active" : ""}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </button>
              ))}

              <button type="button" className="clubLogout">
                Logga ut
              </button>
            </nav>
          </aside>

          <section className="clubContent">
            {activeTab === "overview" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Översikt</div>

                <div className="clubWelcome">
                  <div>
                    <p>Översikt</p>
                    <h2>Välkommen till HB Shuttle Club</h2>
                    <span>
                      Här kommer du kunna se kommande resor, digitala biljetter,
                      periodkort och saldo.
                    </span>
                  </div>

                  <button type="button">Boka resa</button>
                </div>

                <div className="clubDashboardGrid">
                  <div className="clubStatCard">
                    <small>Kommande resa</small>
                    <strong>Ingen resa bokad</strong>
                    <span>När du bokar en resa visas den här.</span>
                    <button type="button">Sök resa</button>
                  </div>

                  <div className="clubStatCard">
                    <small>Aktivt periodkort</small>
                    <strong>Inget aktivt kort</strong>
                    <span>Köp 30-dagars periodkort för återkommande resor.</span>
                    <button type="button">Köp periodkort</button>
                  </div>

                  <div className="clubStatCard">
                    <small>Saldo & bonus</small>
                    <strong>0 SEK</strong>
                    <span>Du har 0 bonuspoäng just nu.</span>
                    <button type="button">Se saldo</button>
                  </div>
                </div>

                <div className="clubQuickPanel">
                  <h3>Snabbval</h3>
                  <div>
                    <button type="button" onClick={() => setActiveTab("tickets")}>
                      Mina biljetter
                    </button>
                    <button type="button" onClick={() => setActiveTab("passes")}>
                      Mina periodkort
                    </button>
                    <button type="button" onClick={() => setActiveTab("reserve")}>
                      Boka plats
                    </button>
                    <button type="button">Kundservice</button>
                  </div>
                </div>
              </>
            ) : null}

            {activeTab === "profile" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Min profil</div>

                <div className="clubPanel">
                  <h2>Min profil</h2>

                  <div className="clubFormGrid">
                    <label>
                      <span>Förnamn</span>
                      <input type="text" placeholder="Förnamn" />
                    </label>

                    <label>
                      <span>Efternamn</span>
                      <input type="text" placeholder="Efternamn" />
                    </label>

                    <label>
                      <span>E-post</span>
                      <input type="email" placeholder="namn@exempel.se" />
                    </label>

                    <label>
                      <span>Telefonnummer</span>
                      <input type="tel" placeholder="+46" />
                    </label>

                    <label>
                      <span>Nytt lösenord</span>
                      <input type="password" />
                    </label>

                    <label>
                      <span>Upprepa lösenord</span>
                      <input type="password" />
                    </label>
                  </div>

                  <label className="clubCheckLine">
                    <input type="checkbox" />
                    <span />
                    Jag vill få information och erbjudanden från HB Shuttle.
                  </label>

                  <button type="button" className="clubPrimaryAction">
                    Spara ändringar
                  </button>
                </div>
              </>
            ) : null}

            {activeTab === "tickets" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Mina biljetter</div>

                <div className="clubPanel">
                  <h2>Mina biljetter</h2>
                  <EmptyState
                    title="Du har inga biljetter än"
                    text="När du bokar en resa visas dina digitala biljetter här med QR-kod."
                    button="Boka resa"
                  />
                </div>
              </>
            ) : null}

            {activeTab === "passes" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Mina periodkort</div>

                <div className="clubPanel">
                  <h2>Mina periodkort</h2>
                  <EmptyState
                    title="Du har inget aktivt periodkort"
                    text="Ett 30-dagars periodkort passar dig som reser ofta till eller från flygplatsen."
                    button="Köp 30-dagars periodkort"
                  />
                </div>

                <div className="clubInfoPanel">
                  <h3>Så fungerar periodkort</h3>
                  <p>
                    Periodkortet gäller på vald sträcka i 30 dagar. När kortet är aktivt
                    kan du boka plats på en avgång utan att betala igen.
                  </p>
                </div>
              </>
            ) : null}

            {activeTab === "reserve" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Boka plats</div>

                <div className="clubPanel">
                  <h2>Boka plats med periodkort</h2>
                  <EmptyState
                    title="Inget periodkort hittades"
                    text="När du har ett aktivt periodkort kan du välja datum och avgång här."
                    button="Köp periodkort"
                  />
                </div>
              </>
            ) : null}

            {activeTab === "balance" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Saldo & bonus</div>

                <div className="clubBalanceGrid">
                  <div className="clubPanel">
                    <h2>Saldo</h2>
                    <strong className="clubBigValue">0 SEK</strong>
                    <p>Du har inget saldo just nu.</p>
                  </div>

                  <div className="clubPanel">
                    <h2>Bonuspoäng</h2>
                    <strong className="clubBigValue">0 poäng</strong>
                    <p>Bonus och medlemsförmåner lanseras stegvis.</p>
                  </div>
                </div>
              </>
            ) : null}

            {activeTab === "settings" ? (
              <>
                <div className="clubBreadcrumb">Mina sidor / Inställningar</div>

                <div className="clubPanel">
                  <h2>Inställningar</h2>
                  <div className="clubSettingList">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>E-post om bokningar och biljetter</span>
                    </label>
                    <label>
                      <input type="checkbox" />
                      <span>Erbjudanden och nyheter</span>
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Trafikinformation för mina resor</span>
                    </label>
                  </div>

                  <button type="button" className="clubPrimaryAction">
                    Spara inställningar
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
