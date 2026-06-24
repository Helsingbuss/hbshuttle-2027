"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

type ShuttleStop = {
  id?: string | number;
  name?: string;
  title?: string;
  stop_name?: string;
  city?: string;
  type?: string;
  is_airport?: boolean;
};

type NormalizedStop = {
  id: string;
  name: string;
  city: string;
  isAirport: boolean;
};

type TimetableDeparture = {
  id: string;
  line?: string;
  direction?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  from?: string;
  to?: string;
  stops?: Array<{
    name?: string;
    time?: string;
    order?: number;
  }>;
};

type TimetableRow = {
  id: string;
  line: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: Array<{
    name: string;
    time: string;
  }>;
};

function normalizeName(value: any) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function minutesFromTime(value: string) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 0;

  return Number(match[1]) * 60 + Number(match[2]);
}

function durationText(fromTime: string, toTime: string, fallbackMinutes?: number) {
  const fromMinutes = minutesFromTime(fromTime);
  const toMinutes = minutesFromTime(toTime);

  if (fromMinutes > 0 && toMinutes > 0) {
    const diff = Math.max(toMinutes - fromMinutes, 0);
    return diff + " min";
  }

  if (typeof fallbackMinutes === "number" && Number.isFinite(fallbackMinutes)) {
    return fallbackMinutes + " min";
  }

  return "-";
}

function getTimeAtStop(item: TimetableDeparture, stopName: string) {
  const stops = Array.isArray(item.stops) ? item.stops : [];
  const found = stops.find((stop) => normalizeName(stop.name) === normalizeName(stopName));
  return String(found?.time || "").trim();
}

function hasRoute(item: TimetableDeparture, fromName: string, toName: string) {
  const stops = Array.isArray(item.stops) ? item.stops : [];

  const fromIndex = stops.findIndex(
    (stop) => normalizeName(stop.name) === normalizeName(fromName)
  );

  const toIndex = stops.findIndex(
    (stop) => normalizeName(stop.name) === normalizeName(toName)
  );

  return fromIndex >= 0 && toIndex >= 0 && fromIndex < toIndex;
}

function normalizeStop(stop: ShuttleStop): NormalizedStop {
  const name = String(stop.name || stop.title || stop.stop_name || "").trim();

  return {
    id: String(stop.id || name),
    name,
    city: String(stop.city || "").trim(),
    isAirport:
      Boolean(stop.is_airport) ||
      String(stop.type || "").toLowerCase().includes("airport") ||
      name.toLowerCase().includes("airport") ||
      name.toLowerCase().includes("flygplats"),
  };
}

function StopDropdown({
  label,
  value,
  stops,
  placeholder,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  stops: NormalizedStop[];
  placeholder: string;
  icon: "dot" | "pin";
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedStop = stops.find((stop) => stop.name === value);

  return (
    <div className="routeDropdown">
      <button
        type="button"
        className="routeField"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={icon === "dot" ? "routeDot" : "routePin"} />
        <div>
          <small>{label}</small>
          <strong>{selectedStop?.name || value || placeholder}</strong>
        </div>
      </button>

      {open ? (
        <div className="routeDropdownMenu">
          {stops.length === 0 ? (
            <button type="button" disabled>
              Inga hållplatser hittades
            </button>
          ) : (
            stops.map((stop: NormalizedStop) => (
              <button
                key={stop.id}
                type="button"
                className={stop.name === value ? "active" : ""}
                onClick={() => {
                  onChange(stop.name);
                  setOpen(false);
                }}
              >
                <span>{stop.name}</span>
                {stop.city ? <small>{stop.city}</small> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function TimetablePage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [travelMode, setTravelMode] = useState("earliest");
  const [travelModeOpen, setTravelModeOpen] = useState(false);

  const [stops, setStops] = useState<NormalizedStop[]>([]);
  const [loadingStops, setLoadingStops] = useState(true);

  const [departures, setDepartures] = useState<TimetableRow[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState(false);
  const [departuresError, setDeparturesError] = useState("");

  const [fromStop, setFromStop] = useState("Helsingborg C");
  const [toStop, setToStop] = useState("Ängelholm Helsingborg Airport");
  const [date, setDate] = useState("2027-01-02");
  const [time, setTime] = useState("08:00");

  useEffect(() => {
    const hasAccess = localStorage.getItem("hbshuttle_beta_access") === "true";

    if (!hasAccess) {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  useEffect(() => {
    async function loadStops() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

        const response = await fetch(
          `${baseUrl.replace(/\/$/, "")}/api/public/shuttle/stops`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          setStops([]);
          return;
        }

        const data = await response.json();

        const normalized: NormalizedStop[] = Array.isArray(data.stops)
          ? data.stops
              .map(normalizeStop)
              .filter((stop: NormalizedStop) => stop.name)
          : [];

        setStops(normalized);

        const firstDeparture = normalized.find((stop: NormalizedStop) => !stop.isAirport);
        const firstAirport =
          normalized.find((stop: NormalizedStop) => stop.isAirport) ||
          normalized.find((stop: NormalizedStop) =>
            stop.name.toLowerCase().includes("ängelholm")
          );

        if (firstDeparture && !fromStop) {
          setFromStop(firstDeparture.name);
        }

        if (firstAirport) {
          setToStop(firstAirport.name);
        }
      } catch (error) {
        console.error("Could not load timetable stops:", error);
        setStops([]);
      } finally {
        setLoadingStops(false);
      }
    }

    loadStops();
  }, []);

  const departureStops = useMemo(() => {
    return stops.filter((stop: NormalizedStop) => !stop.isAirport);
  }, [stops]);

  const airportStops = useMemo(() => {
    const airports = stops.filter((stop: NormalizedStop) => stop.isAirport);

    if (airports.length > 0) {
      return airports;
    }

    return [
      {
        id: "angelholm-airport",
        name: "Ängelholm Helsingborg Airport",
        city: "Ängelholm",
        isAirport: true,
      },
    ];
  }, [stops]);

  const routeStops = useMemo(() => {
    if (stops.length === 0) {
      return [
        fromStop || "Helsingborg C",
        "Helsingborg Lasarettet",
        "Berga",
        "Ängelholm station",
        toStop || "Ängelholm Helsingborg Airport",
      ];
    }

    const names = stops.map((stop: NormalizedStop) => stop.name);
    const fromIndex = names.indexOf(fromStop);
    const toIndex = names.indexOf(toStop);

    if (fromIndex >= 0 && toIndex >= 0) {
      if (fromIndex <= toIndex) {
        return names.slice(fromIndex, toIndex + 1);
      }

      return names.slice(toIndex, fromIndex + 1).reverse();
    }

    return [fromStop, toStop].filter(Boolean);
  }, [stops, fromStop, toStop]);

  async function loadDepartures() {
    try {
      setLoadingDepartures(true);
      setDeparturesError("");
      setHasSearched(true);

      const response = await fetch(
        `/api/shuttle/departures?date=${encodeURIComponent(date)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Could not load departures");
      }

      const data = await response.json();
      const items: TimetableDeparture[] = Array.isArray(data.departures)
        ? data.departures
        : [];

      const rows = items
        .filter((item) => hasRoute(item, fromStop, toStop))
        .map((item) => {
          const departure = getTimeAtStop(item, fromStop) || item.departureTime || "";
          const arrival = getTimeAtStop(item, toStop) || item.arrivalTime || "";

          const stopRows = (Array.isArray(item.stops) ? item.stops : [])
            .filter((stop) => stop.name && stop.time)
            .map((stop) => ({
              name: String(stop.name || ""),
              time: String(stop.time || ""),
            }));

          return {
            id: item.id,
            line: String(item.line || "Flygbuss"),
            departure,
            arrival,
            duration: durationText(departure, arrival, item.durationMinutes),
            stops: stopRows,
          };
        })
        .filter((item) => item.departure && item.arrival)
        .filter((item) => {
          if (!time) return true;

          if (travelMode === "earliest") {
            return minutesFromTime(item.departure) >= minutesFromTime(time);
          }

          return minutesFromTime(item.arrival) <= minutesFromTime(time);
        })
        .sort((a, b) => minutesFromTime(a.departure) - minutesFromTime(b.departure));

      setDepartures(rows);
    } catch (error) {
      console.error(error);
      setDepartures([]);
      setDeparturesError("Could not load departures.");
    } finally {
      setLoadingDepartures(false);
    }
  }

  function swapRoute() {
    const currentFrom = fromStop;
    setFromStop(toStop);
    setToStop(currentFrom);
    setHasSearched(false);
  }

  if (!allowed) return null;

  return (
    <>
      <BetaHeader sticky />

      <main className="timetablePage">
        <section className="timetableHero">
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
              <StopDropdown
                label="Från"
                value={fromStop}
                stops={departureStops}
                placeholder={loadingStops ? "Laddar hållplatser..." : "Välj hållplats"}
                icon="dot"
                onChange={(value) => {
                  setFromStop(value);
                  setHasSearched(false);
                }}
              />

              <StopDropdown
                label="Till"
                value={toStop}
                stops={airportStops}
                placeholder={loadingStops ? "Laddar flygplatser..." : "Välj flygplats"}
                icon="pin"
                onChange={(value) => {
                  setToStop(value);
                  setHasSearched(false);
                }}
              />

              <button
                type="button"
                className="routeSwap"
                aria-label="Byt riktning"
                onClick={swapRoute}
              >
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
                  {routeStops.map((stop, index) => (
                    <li
                      key={stop}
                      className={index === routeStops.length - 1 ? "last" : ""}
                    >
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
              <label className="dateTimeField">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 3v4" />
                  <path d="M17 3v4" />
                  <path d="M4.5 9h15" />
                  <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                </svg>
                <div>
                  <small>Datum</small>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setHasSearched(false);
                    }}
                  />
                </div>
              </label>

              <label className="dateTimeField">
                <div>
                  <small>Tid</small>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setHasSearched(false);
                    }}
                  />
                </div>
              </label>
            </div>

            <button
              type="button"
              className="showTimetableButton"
              onClick={loadDepartures}
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
                    {fromStop}
                    <span>→</span>
                    {toStop}
                  </h2>
                  <p>{date || "Valt datum"}</p>
                </div>

                <div className="departureTable">
                  <div className="departureHead">
                    <span>Avgångstid</span>
                    <span>Ankomsttid</span>
                    <span>Restid</span>
                  </div>

                  {loadingDepartures ? (
                    <div className="departureRow">
                      <strong>Loading</strong>
                      <span>-</span>
                      <span>-</span>
                    </div>
                  ) : departuresError ? (
                    <div className="departureRow">
                      <strong>No data</strong>
                      <span>{departuresError}</span>
                      <span>-</span>
                    </div>
                  ) : departures.length === 0 ? (
                    <div className="departureRow">
                      <strong>No departures</strong>
                      <span>Try another date or time</span>
                      <span>-</span>
                    </div>
                  ) : (
                    departures.map((item) => (
                      <div className="departureRow" key={item.id}>
                        <strong>{item.departure}</strong>
                        <span>{item.arrival}</span>
                        <span>{item.duration}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="ticketInfoBox">
                  <div>
                    <h3>Biljetten är flexibel</h3>
                    <p>
                      Gäller på vald resdag och kan visas digitalt med QR-kod.
                    </p>

                    <ul>
                      <li>{fromStop}</li>
                      <li>{toStop}</li>
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
