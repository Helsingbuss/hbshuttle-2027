"use client";

import Link from "next/link";
import BetaHeader from "../../../components/BetaHeader";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type Comfort = "economy" | "plus";

type Departure = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  line: string;
  vehicle: string;
  from: string;
  to: string;
  priceEconomy: number;
  pricePlus: number;
  status?: "available" | "departed";
};

const fallbackDepartures: Departure[] = [
  {
    id: "dep-1215",
    departureTime: "12:15",
    arrivalTime: "13:05",
    duration: "50 min",
    line: "Linje 101",
    vehicle: "HB Shuttle Direkt",
    from: "Helsingborg C",
    to: "Ängelholm Helsingborg Airport",
    priceEconomy: 129,
    pricePlus: 169,
    status: "departed",
  },
  {
    id: "dep-1500",
    departureTime: "15:00",
    arrivalTime: "15:50",
    duration: "50 min",
    line: "Linje 101",
    vehicle: "HB Shuttle Direkt",
    from: "Helsingborg C",
    to: "Ängelholm Helsingborg Airport",
    priceEconomy: 129,
    pricePlus: 169,
    status: "available",
  },
  {
    id: "dep-1630",
    departureTime: "16:30",
    arrivalTime: "17:20",
    duration: "50 min",
    line: "Linje 101",
    vehicle: "HB Shuttle Direkt",
    from: "Helsingborg C",
    to: "Ängelholm Helsingborg Airport",
    priceEconomy: 129,
    pricePlus: 169,
    status: "available",
  },
  {
    id: "dep-1815",
    departureTime: "18:15",
    arrivalTime: "19:05",
    duration: "50 min",
    line: "Linje 101",
    vehicle: "HB Shuttle Direkt",
    from: "Helsingborg C",
    to: "Ängelholm Helsingborg Airport",
    priceEconomy: 129,
    pricePlus: 169,
    status: "available",
  },
  {
    id: "dep-2030",
    departureTime: "20:30",
    arrivalTime: "21:20",
    duration: "50 min",
    line: "Linje 101",
    vehicle: "HB Shuttle Direkt",
    from: "Helsingborg C",
    to: "Ängelholm Helsingborg Airport",
    priceEconomy: 129,
    pricePlus: 169,
    status: "available",
  },
];

function ChooseDepartureContent() {
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "Helsingborg C";
  const to = searchParams.get("to") || "Ängelholm Helsingborg Airport";
  const date = searchParams.get("date") || "";
  const travelers = searchParams.get("travelers") || "1 resenär";

  const [openDepartureId, setOpenDepartureId] = useState<string | null>(null);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [comfort, setComfort] = useState<Comfort>("economy");
  const [departures, setDepartures] = useState<Departure[]>(fallbackDepartures);
  const [loadingDepartures, setLoadingDepartures] = useState(true);

  const selectedDeparture = useMemo(() => {
    return departures.find((departure) => departure.id === selectedDepartureId) || null;
  }, [selectedDepartureId]);

  const selectedPrice = selectedDeparture
    ? comfort === "plus"
      ? selectedDeparture.pricePlus
      : selectedDeparture.priceEconomy
    : 0;

  useEffect(() => {
    async function loadDepartures() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

        const params = new URLSearchParams();

        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (date) params.set("date", date);

        const response = await fetch(
          `${baseUrl.replace(/\/$/, "")}/api/public/shuttle/departures?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          setDepartures(fallbackDepartures);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data.departures) && data.departures.length > 0) {
          const connectedDepartures: Departure[] = data.departures.map((item: any, index: number) => ({
            id: String(item.id || `departure-${index}`),
            departureTime: String(item.departureTime || item.departure_time || ""),
            arrivalTime: String(item.arrivalTime || item.arrival_time || ""),
            duration: String(item.duration || "50 min"),
            line: String(item.lineName || item.line || "Linje 101"),
            vehicle: String(item.vehicle || "HB Shuttle Direkt"),
            from: String(item.fromName || from || "Helsingborg C"),
            to: String(item.toName || to || "Ängelholm Helsingborg Airport"),
            priceEconomy: Number(item.priceEconomy || item.price_economy || 129),
            pricePlus: Number(item.pricePlus || item.price_plus || 169),
            status: item.status === "departed" ? "departed" : "available",
          }));

          setDepartures(connectedDepartures);
          setOpenDepartureId(null);
          setSelectedDepartureId(null);
          return;
        }

        setDepartures(fallbackDepartures);
      } catch (error) {
        console.error("Could not load shuttle departures:", error);
        setDepartures(fallbackDepartures);
      } finally {
        setLoadingDepartures(false);
      }
    }

    loadDepartures();
  }, [from, to, date]);

  function chooseDeparture(departure: Departure, selectedComfort: Comfort) {
    setSelectedDepartureId(departure.id);
    setOpenDepartureId(departure.id);
    setComfort(selectedComfort);
  }

  return (
    <>
      <BetaHeader />
      <main className="departurePage">
      <section className="departureHero">
        <div className="departureHeroInner">
          <p className="departureEyebrow">Helsingbuss Airport Shuttle</p>
          <h1>Välj avgång</h1>

          <div className="departureRouteCard">
            <div className="departureRoutePoint">
              <span className="departureRouteIcon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                  <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                </svg>
              </span>
              <div>
                <small>{from.toLowerCase().includes("airport") || from.toLowerCase().includes("flygplats") ? "Från flygplats" : "Från"}</small>
                <strong>{from}</strong>
              </div>
            </div>

            <div className="departureRouteArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </div>

            <div className="departureRoutePoint">
              <span className="departureRouteIcon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 13.5 21 6l-7.5 18-3-8.5L3 13.5Z" />
                  <path d="m10.5 15.5 4-4" />
                </svg>
              </span>
              <div>
                <small>{from.toLowerCase().includes("airport") || from.toLowerCase().includes("flygplats") ? "Till hållplats" : "Till flygplats"}</small>
                <strong>{to}</strong>
              </div>
            </div>
          </div>

          <div className="departureMetaRow">
            <div>
              <small>Datum</small>
              <strong>{date || "Välj datum"}</strong>
            </div>

            <div>
              <small>Resenärer</small>
              <strong>{travelers}</strong>
            </div>

            <div>
              <small>Linje</small>
              <strong>101 Helsingborg – Ängelholm Airport</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="departureContent">
        <div className="departureDateTabs">
          <button type="button" className="departureDateTab disabled">← Föregående</button>
          <button type="button" className="departureDateTab active">Mån 15 juni</button>
          <button type="button" className="departureDateTab">Tis 16 juni →</button>
        </div>

        {loadingDepartures ? (
          <div className="departureApiNotice">Hämtar avgångar...</div>
        ) : null}

        <div className="departureList">
          {departures.map((departure) => {
            const isOpen = openDepartureId === departure.id;
            const isSelected = selectedDepartureId === departure.id;

            const displayFrom = from || departure.from;
            const displayTo = to || departure.to;

            return (
              <article
                key={departure.id}
                className={isOpen ? "departureItem departureItemOpen" : "departureItem"}
              >
                <button
                  type="button"
                  className="departureSummary"
                  onClick={() =>
                    setOpenDepartureId(isOpen ? null : departure.id)
                  }
                >
                  <div className="departureTimes">
                    <strong>{departure.departureTime}</strong>
                    <span className="departureTimeArrow">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                    <strong>{departure.arrivalTime}</strong>
                  </div>

                  <div className="departureInfo">
                    <span className="departureBadge">{departure.line}</span>
                    <span>{departure.vehicle}</span>
                    <small>{departure.duration}</small>
                  </div>

                  <div className="departurePrice">
                    {departure.status === "departed" ? (
                      <span className="departureDeparted">Avgått</span>
                    ) : (
                      <>
                        <small>Från</small>
                        <strong>{departure.priceEconomy} SEK</strong>
                      </>
                    )}

                    <span className={isOpen ? "departureChevron departureChevronOpen" : "departureChevron"}>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="m7 10 5 5 5-5" />
                      </svg>
                    </span>
                  </div>
                </button>

                {isOpen ? (
                  <div className="departureDetails">
                    <div className="departureTimeline">
                      <div className="timelineStop">
                        <span />
                        <div>
                          <strong>{departure.departureTime}</strong>
                          <p>{displayFrom}</p>
                        </div>
                      </div>

                      <div className="timelineVehicle">
                        <p>{departure.vehicle}</p>
                        <div className="vehicleIcons">
  <span>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 3v6" />
      <path d="M14 3v6" />
      <path d="M8 9h8v3a4 4 0 0 1-8 0V9Z" />
      <path d="M12 16v5" />
    </svg>
    <small>Eluttag</small>
  </span>

  <span>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 10.5a10 10 0 0 1 14 0" />
      <path d="M8 13.5a6 6 0 0 1 8 0" />
      <path d="M11 16.5a2 2 0 0 1 2 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
    <small>Wi‑Fi</small>
  </span>

  <span>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="7" width="12" height="11" rx="2.5" />
      <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
      <path d="M10 11h4" />
    </svg>
    <small>Bagage</small>
  </span>

  <span>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M7.5 5.5 16.5 18.5" />
      <path d="M16.5 5.5 7.5 18.5" />
    </svg>
    <small>Klimat</small>
  </span>
</div>
                      </div>

                      <div className="timelineStop">
                        <span />
                        <div>
                          <strong>{departure.arrivalTime}</strong>
                          <p>{displayTo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="comfortPanel">
                      <h2>Välj biljettyp</h2>

                      <button
                        type="button"
                        className={
                          isSelected && comfort === "plus"
                            ? "comfortOption active"
                            : "comfortOption"
                        }
                        onClick={() => chooseDeparture(departure, "plus")}
                        disabled={departure.status === "departed"}
                      >
                        <div className="comfortTop">
                          <span className="comfortRadio" />
                          <strong>Plus</strong>
                          <b>{departure.pricePlus} SEK</b>
                        </div>

                        <ul>
                          <li>Extra benutrymme</li>
                          <li>Prioriterad ombordstigning</li>
                          <li>1 handbagage + 1 resväska</li>
                        </ul>
                      </button>

                      <button
                        type="button"
                        className={
                          isSelected && comfort === "economy"
                            ? "comfortOption active"
                            : "comfortOption"
                        }
                        onClick={() => chooseDeparture(departure, "economy")}
                        disabled={departure.status === "departed"}
                      >
                        <div className="comfortTop">
                          <span className="comfortRadio" />
                          <strong>Ekonomi</strong>
                          <b>{departure.priceEconomy} SEK</b>
                        </div>

                        <ul>
                          <li>Bekväm sittplats</li>
                          <li>1 handbagage + 1 resväska</li>
                        </ul>
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="departureFooter">
          <Link href="/start" className="departureBack">
            ← Tillbaka till sök
          </Link>

          <button
            type="button"
            className="departureContinue"
            disabled={!selectedDeparture}
          >
            Fortsätt · {selectedPrice} SEK →
          </button>
        </div>
      </section>
      </main>
    </>
  );
}


export default function ChooseDeparturePage() {
  return (
    <Suspense
      fallback={
        <main className="departurePage">
          <section className="departureHero">
            <div className="departureHeroInner">
              <p className="departureEyebrow">Helsingbuss Airport Shuttle</p>
              <h1>Välj avgång</h1>
            </div>
          </section>
        </main>
      }
    >
      <ChooseDepartureContent />
    </Suspense>
  );
}
