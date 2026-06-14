"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

const departures = [
  { departure: "08:40", arrival: "09:15", duration: "35 min" },
  { departure: "10:10", arrival: "10:45", duration: "35 min" },
  { departure: "12:40", arrival: "13:15", duration: "35 min" },
  { departure: "15:10", arrival: "15:45", duration: "35 min" },
  { departure: "17:40", arrival: "18:15", duration: "35 min" },
];

const stops = [
  "Helsingborg C",
  "Helsingborg Lasarettet",
  "Berga",
  "Ängelholm station",
  "Ängelholm Helsingborg Airport",
];

export default function TimetablePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [travelMode, setTravelMode] = useState("earliest");
  const [travelModeOpen, setTravelModeOpen] = useState(false);

  useEffect(() => {
    const hasAccess = localStorage.getItem("hbshuttle_beta_access") === "true";

    if (!hasAccess) {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return (
    <>
      <BetaHeader />

      <main className="timetablePage">
        <section className="timetableHero">
          <p className="timetableEyebrow">Tidtabell</p>
          <h1>Tidtabeller</h1>
          <p>
            Kika gärna i tidtabellen strax innan du reser. Alla tider visas i
            svensk lokal tid.
          </p>
        </section>

        <section className="timetableLayout">
          <aside className="timetableSearchCard">
            <h2>Vart vill du åka?</h2>

            <div className="routePicker">
              <button type="button" className="routeField">
                <span className="routeDot" />
                <div>
                  <small>Från</small>
                  <strong>Helsingborg C</strong>
                </div>
              </button>

              <button type="button" className="routeField">
                <span className="routePin" />
                <div>
                  <small>Till</small>
                  <strong>Ängelholm Airport</strong>
                </div>
              </button>

              <button type="button" className="routeSwap" aria-label="Byt riktning">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h11" />
                  <path d="m15 4 3 3-3 3" />
                  <path d="M17 17H6" />
                  <path d="m9 14-3 3 3 3" />
                </svg>
              </button>
            </div>

            {hasSearched && (
              <div className="routeDetails">
                <div className="routeDetailsHead">
                  <h3>Resedetaljer</h3>
                  <span>⌃</span>
                </div>

                <ol>
                  {stops.map((stop, index) => (
                    <li key={stop} className={index === stops.length - 1 ? "last" : ""}>
                      <span />
                      <p>{stop}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <h2 className="travelWhenTitle">När vill du resa?</h2>

            <div className="timetableDropdown">
              <button
                type="button"
                className="timetableSelect"
                onClick={() => setTravelModeOpen((open) => !open)}
              >
                <span>
                  {travelMode === "earliest"
                    ? "Jag vill åka tidigast"
                    : "Jag vill vara framme senast"}
                </span>

                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </button>

              {travelModeOpen && (
                <div className="timetableDropdownMenu">
                  <button
                    type="button"
                    className={travelMode === "earliest" ? "active" : ""}
                    onClick={() => {
                      setTravelMode("earliest");
                      setTravelModeOpen(false);
                    }}
                  >
                    Jag vill åka tidigast
                  </button>

                  <button
                    type="button"
                    className={travelMode === "latest-arrival" ? "active" : ""}
                    onClick={() => {
                      setTravelMode("latest-arrival");
                      setTravelModeOpen(false);
                    }}
                  >
                    Jag vill vara framme senast
                  </button>
                </div>
              )}
            </div>

            <div className="dateTimeGrid">
              <button type="button" className="dateTimeField">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 3v4" />
                  <path d="M17 3v4" />
                  <path d="M4.5 9h15" />
                  <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                </svg>
                <div>
                  <small>Datum</small>
                  <strong>2027-01-01</strong>
                </div>
              </button>

              <button type="button" className="dateTimeField">
                <span>‹</span>
                <div>
                  <small>Tid</small>
                  <strong>08:00</strong>
                </div>
                <span>›</span>
              </button>
            </div>

            <button
              type="button"
              className="showTimetableButton"
              onClick={() => setHasSearched(true)}
            >
              Visa tidtabell
            </button>

            <a href="/start/hallplatser" className="stationLink">
              Se hållplatser
            </a>
          </aside>

          <section className="timetableResultCard">
            {!hasSearched ? (
              <div className="emptyTimetable emptyTimetableWithImage">
                <div className="timetableEmptyImageWrap">
                  <img
                    src="/images/timetable/timetable-empty.png"
                    alt="Tidtabell illustration"
                    className="timetableEmptyImage"
                  />
                </div>

                <div className="timetableEmptyText">
                  <h2>Välj sträcka för att se tider</h2>
                  <p>
                    När du valt från och till hållplats visar vi kommande avgångar
                    och restid här.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="resultHeader">
                  <h2>
                    Helsingborg C
                    <span>→</span>
                    Ängelholm Airport
                  </h2>
                  <p>Fredag 1 januari 2027</p>
                </div>

                <div className="departureTable">
                  <div className="departureHead">
                    <span>Avgångstid</span>
                    <span>Ankomsttid</span>
                    <span>Restid</span>
                  </div>

                  {departures.map((item) => (
                    <div className="departureRow" key={item.departure}>
                      <strong>{item.departure}</strong>
                      <span>{item.arrival}</span>
                      <span>{item.duration}</span>
                    </div>
                  ))}
                </div>

                <div className="ticketInfoBox">
                  <div>
                    <h3>Biljetten är flexibel</h3>
                    <p>
                      Gäller på vald resdag och kan visas digitalt med QR-kod.
                    </p>

                    <ul>
                      <li>Helsingborg C</li>
                      <li>Ängelholm Airport</li>
                    </ul>
                  </div>

                  <button type="button">Köp biljett</button>
                </div>
              </>
            )}
          </section>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}





