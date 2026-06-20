"use client";

import Link from "next/link";
import BetaHeader from "../../../components/BetaHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type Comfort = "economy" | "plus";

const comfortTexts = {
  plus: {
    title: "Plus",
    benefits: [
      "Extra benutrymme",
      "Prioriterad ombordstigning",
      "1 handbagage + 1 resväska",
    ],
  },
  economy: {
    title: "Ekonomi",
    benefits: [
      "Bekväm sittplats",
      "1 handbagage + 1 resväska",
    ],
  },
};

type PassengerCounts = {
  adults: number;
  children: number;
  youth: number;
  seniors: number;
};

function formatPassengerSummary(passengers: PassengerCounts) {
  const total =
    passengers.adults + passengers.children + passengers.youth + passengers.seniors;

  if (total <= 0) return "1 vuxen";

  const parts: string[] = [];

  if (passengers.adults === 1) parts.push("1 vuxen");
  if (passengers.adults > 1) parts.push(`${passengers.adults} vuxna`);

  if (passengers.children === 1) parts.push("1 barn");
  if (passengers.children > 1) parts.push(`${passengers.children} barn`);

  if (passengers.youth === 1) parts.push("1 ungdom");
  if (passengers.youth > 1) parts.push(`${passengers.youth} ungdomar`);

  if (passengers.seniors === 1) parts.push("1 senior");
  if (passengers.seniors > 1) parts.push(`${passengers.seniors} seniorer`);

  if (parts.length <= 2) return parts.join(", ");

  return `${total} resenärer`;
}

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
  stops?: any[];
};


function isDepartureDeparted(selectedDate: string, departureTime: string, status?: string) {
  if (status === "departed") return true;

  if (!selectedDate || !departureTime) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const selected = new Date(selectedDate + "T00:00:00");

  if (selected < today) return true;
  if (selected > today) return false;

  const [hours, minutes] = departureTime.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const departureDateTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  return departureDateTime < now;
}


function formatDepartureDateLabel(value: string, fallback = "Välj datum") {
  if (!value) return fallback;

  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return value;

  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  const days = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
  const months = [
    "jan", "feb", "mars", "apr", "maj", "juni",
    "juli", "aug", "sep", "okt", "nov", "dec"
  ];

  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function displayTime(value?: any) {
  const text = String(value || "").trim();

  if (!text) return "";

  if (/^\d{1,2}:\d{2}/.test(text)) {
    const [hours, minutes] = text.split(":");
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  if (/^\d{4}$/.test(text)) {
    return `${text.slice(0, 2)}:${text.slice(2, 4)}`;
  }

  if (/^\d{3}$/.test(text)) {
    return `0${text.slice(0, 1)}:${text.slice(1, 3)}`;
  }

  return text;
}

function normalizeStopName(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getStopsFromItem(item: any) {
  if (Array.isArray(item?.visibleStops) && item.visibleStops.length > 0) {
    return item.visibleStops;
  }

  if (Array.isArray(item?.stops) && item.stops.length > 0) {
    return item.stops;
  }

  return [];
}

function getSelectedStopTime(item: any, stopName: string, fallback: "first" | "last") {
  const stops = getStopsFromItem(item);

  if (stops.length === 0) {
    return fallback === "first"
      ? displayTime(item?.departureTime || item?.departure_time || "")
      : displayTime(item?.arrivalTime || item?.arrival_time || "");
  }

  const wanted = normalizeStopName(stopName);

  const selectedStop = wanted
    ? stops.find((stop: any) => normalizeStopName(stop?.name) === wanted)
    : null;

  const fallbackStop = fallback === "first" ? stops[0] : stops[stops.length - 1];
  const stop = selectedStop || fallbackStop;

  return getStopTime(stop);
}

function getStopTime(stop?: any) {
  return displayTime(stop?.time || stop?.departure_time || stop?.arrival_time || "");
}

function getFirstStopTime(item: any) {
  const stops = Array.isArray(item?.visibleStops) && item.visibleStops.length > 0
    ? item.visibleStops
    : Array.isArray(item?.stops)
      ? item.stops
      : [];

  return getStopTime(stops[0]) || displayTime(item?.departureTime || item?.departure_time || "");
}

function getLastStopTime(item: any) {
  const stops = Array.isArray(item?.visibleStops) && item.visibleStops.length > 0
    ? item.visibleStops
    : Array.isArray(item?.stops)
      ? item.stops
      : [];

  return getStopTime(stops[stops.length - 1]) || displayTime(item?.arrivalTime || item?.arrival_time || "");
}

function shiftDateValue(value: string, days: number) {
  if (!value) return "";

  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return "";

  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function ChooseDepartureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "Helsingborg C";
  const to = searchParams.get("to") || "Ängelholm Helsingborg Airport";
  const date = searchParams.get("date") || "";
  const adults = Number(searchParams.get("adults") || "1");
  const children = Number(searchParams.get("children") || "0");
  const youth = Number(searchParams.get("youth") || "0");
  const seniors = Number(searchParams.get("seniors") || "0");

  const travelers = formatPassengerSummary({
    adults,
    children,
    youth,
    seniors,
  });

  const [openDepartureId, setOpenDepartureId] = useState<string | null>(null);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [comfort, setComfort] = useState<Comfort>("economy");
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [hasLoadedDepartures, setHasLoadedDepartures] = useState(false);

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
        setLoadingDepartures(true);
        setHasLoadedDepartures(false);
        setDepartures([]);
const params = new URLSearchParams();

        // Load departures by selected date.
        if (date) params.set("date", date);

        const response = await fetch(
          `/api/shuttle/departures?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          setDepartures([]);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data.departures) && data.departures.length > 0) {
          const apiDepartures = Array.isArray(data.departures) ? data.departures : [];

          const connectedDepartures: Departure[] = apiDepartures.map((item: any, index: number) => ({
            id: String(item.id || `departure-${index}`),
            departureTime: getSelectedStopTime(item, from, "first"),
            arrivalTime: getSelectedStopTime(item, to, "last"),
            duration: item.durationMinutes ? `${item.durationMinutes} min` : String(item.duration || "50 min"),
            line: String(item.line || item.lineName || item.lineCode || "Linje hämtas från Portal"),
            vehicle: String(item.vehicle || item.operatorName || item.operator_name || "Helsingbuss"),
            from: String(item.from || item.fromName || item.departureLocation || from || "Helsingborg C"),
            to: String(item.to || item.toName || item.destinationLocation || to || "Ängelholm Airport"),
            priceEconomy: Number(item.priceEconomy || item.price_economy || item.ticketPrice || item.price || 0),
            pricePlus: Number(item.pricePlus || item.price_plus || item.ticketPrice || item.price || 0),
            status: item.status === "departed" ? "departed" : "available",
            stops: getStopsFromItem(item),
          }));

          setDepartures(connectedDepartures);
          setOpenDepartureId(null);
          setSelectedDepartureId(null);
          return;
        }

        setDepartures([]);
      } catch (error) {
        console.error("Could not load shuttle departures:", error);
        setDepartures([]);
      } finally {
        setHasLoadedDepartures(true);
        setLoadingDepartures(false);
      }
    }

    loadDepartures();
  }, [from, to, date]);

  function goToDate(nextDate: string) {
    if (!nextDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("date", nextDate);

    router.push(`/start/valj-avgang?${params.toString()}`);
  }
  function goToAddons(departure: Departure, selectedComfort: Comfort) {
    if (isDepartureDeparted(date, displayTime(departure.departureTime), departure.status)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("from", from || departure.from);
    params.set("to", to || departure.to);
    params.set("date", date);
    params.set("departureId", departure.id);
    params.set("departureTime", displayTime(departure.departureTime));
    params.set("arrivalTime", displayTime(departure.arrivalTime));
    params.set("line", departure.line);
    params.set("vehicle", departure.vehicle);
    params.set("comfort", selectedComfort);
    params.set("ticketType", "Enkel");

    const price =
      selectedComfort === "plus"
        ? departure.pricePlus
        : departure.priceEconomy;

    params.set("ticketPrice", String(price));

    router.push(`/start/tillagg?${params.toString()}`);
  }

  function chooseDeparture(departure: Departure, selectedComfort: Comfort) {
    if (isDepartureDeparted(date, displayTime(departure.departureTime), departure.status)) {
      return;
    }

    setSelectedDepartureId(departure.id);
    setOpenDepartureId(departure.id);
    setComfort(selectedComfort);
  }
return (
    <>
      <BetaHeader sticky />
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
              <strong>{departures[0]?.line || "Linje hämtas från avgång"}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="departureContent">
        <div className="departureDateTabs">
          <button
            type="button"
            className="departureDateTab"
            disabled={!date}
            onClick={() => goToDate(shiftDateValue(date, -1))}
          >
            ← {formatDepartureDateLabel(shiftDateValue(date, -1), "Föregående")}
          </button>

          <button type="button" className="departureDateTab active">
            {formatDepartureDateLabel(date)}
          </button>

          <button
            type="button"
            className="departureDateTab"
            disabled={!date}
            onClick={() => goToDate(shiftDateValue(date, 1))}
          >
            {formatDepartureDateLabel(shiftDateValue(date, 1), "Nästa")} →
          </button>
        </div>

        {loadingDepartures ? (
          <div className="departureApiNotice">Hämtar avgångar...</div>
        ) : null}

        {hasLoadedDepartures && !loadingDepartures && departures.length === 0 ? (
          <div className="departureEmptyState">
            <div className="departureEmptyIcon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 3v3" />
                <path d="M17 3v3" />
                <path d="M4.5 8.5h15" />
                <path d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" />
                <path d="M9 13h6" />
                <path d="M12 10v6" />
              </svg>
            </div>

            <div>
              <h2>Inga avgångar den här dagen</h2>
              <p>
                Tyvärr finns det inga planerade avgångar för valt datum.
                Prova ett annat datum eller håll utkik – fler avgångar kan läggas till.
              </p>
            </div>
          </div>
        ) : null}
        <div className="departureList">
          {departures.map((departure) => {
            const isOpen = openDepartureId === departure.id;
            const isSelected = selectedDepartureId === departure.id;
            const isDeparted = isDepartureDeparted(
              date,
              displayTime(departure.departureTime),
              departure.status
            );

            const displayFrom = from || departure.from;
            const displayTo = to || departure.to;

            return (
              <article
                key={departure.id}
                className={
                  isDeparted
                    ? "departureItem departureItemDeparted"
                    : isOpen
                      ? "departureItem departureItemOpen"
                      : "departureItem"
                }
              >
                <button
                  type="button"
                  className="departureSummary"
                  onClick={() =>
                    setOpenDepartureId(isOpen ? null : departure.id)
                  }
                >
                  <div className="departureTimes">
                    <strong>{displayTime(departure.departureTime)}</strong>
                    <span className="departureTimeArrow">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                    <strong>{displayTime(departure.arrivalTime)}</strong>
                  </div>

                  <div className="departureInfo">
                    <span className="departureBadge">{departure.line}</span>
                    <span>{departure.vehicle}</span>
                    <small>{departure.duration}</small>
                  </div>

                  <div className="departurePrice">
                    {isDeparted ? (
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
                          <strong>{displayTime(departure.departureTime)}</strong>
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
                          <strong>{displayTime(departure.arrivalTime)}</strong>
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
                        onClick={() => goToAddons(departure, "plus")}
                        disabled={isDeparted}
                      >
                        <div className="comfortTop">
                          <span className="comfortRadio" />
                          <strong>{comfortTexts.plus.title}</strong>
                          <b>{departure.pricePlus} SEK</b>
                        </div>

                        <ul>
                          {comfortTexts.plus.benefits.map((benefit) => (
                            <li key={benefit}>{benefit}</li>
                          ))}
                        </ul>
                      </button>

                      <button
                        type="button"
                        className={
                          isSelected && comfort === "economy"
                            ? "comfortOption active"
                            : "comfortOption"
                        }
                        onClick={() => goToAddons(departure, "economy")}
                        disabled={isDeparted}
                      >
                        <div className="comfortTop">
                          <span className="comfortRadio" />
                          <strong>{comfortTexts.economy.title}</strong>
                          <b>{departure.priceEconomy} SEK</b>
                        </div>

                        <ul>
                          {comfortTexts.economy.benefits.map((benefit) => (
                            <li key={benefit}>{benefit}</li>
                          ))}
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
























