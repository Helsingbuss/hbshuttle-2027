"use client";

import { useEffect, useMemo, useState } from "react";

type ShuttleStop = {
  id?: string | number;
  name?: string;
  title?: string;
  stop_name?: string;
  city?: string;
  type?: string;
  is_airport?: boolean;
  active?: boolean;
};

type NormalizedStop = {
  id: string;
  name: string;
  city: string;
  isAirport: boolean;
};

type DropdownItem = {
  id: string;
  label: string;
  subLabel?: string;
};

type PassengerCounts = {
  adults: number;
  children: number;
  youth: number;
  seniors: number;
};

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

function CustomDropdown({
  value,
  placeholder,
  items,
  onChange,
  loading,
}: {
  value: string;
  placeholder: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.label === value);

  return (
    <div className="bookingDropdown">
      <button
        type="button"
        className="bookingDropdownButton"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "bookingDropdownValue" : "bookingDropdownPlaceholder"}>
          {loading ? "Laddar hållplatser..." : selected?.label || placeholder}
        </span>

        <span className={open ? "bookingDropdownArrow bookingDropdownArrowOpen" : "bookingDropdownArrow"}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m7 10 5 5 5-5" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="bookingDropdownMenu">
          {items.length === 0 ? (
            <button type="button" className="bookingDropdownOption" disabled>
              <span>Inga alternativ ännu</span>
            </button>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  item.label === value
                    ? "bookingDropdownOption bookingDropdownOptionActive"
                    : "bookingDropdownOption"
                }
                onClick={() => {
                  onChange(item.label);
                  setOpen(false);
                }}
              >
                <span>{item.label}</span>
                {item.subLabel ? <small>{item.subLabel}</small> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function PassengerSelector({
  passengers,
  onChange,
}: {
  passengers: PassengerCounts;
  onChange: (passengers: PassengerCounts) => void;
}) {
  const [open, setOpen] = useState(false);
  const summary = formatPassengerSummary(passengers);

  const rows = [
    { key: "adults", title: "Vuxen", subtitle: "26–64 år" },
    { key: "children", title: "Barn", subtitle: "" },
    { key: "youth", title: "Ungdom", subtitle: "16–25 år" },
    { key: "seniors", title: "Senior", subtitle: "65+ år" },
  ] as const;

  function updatePassenger(key: keyof PassengerCounts, direction: "minus" | "plus") {
    const total =
      passengers.adults + passengers.children + passengers.youth + passengers.seniors;

    const current = passengers[key];

    if (direction === "minus") {
      if (current <= 0) return;
      if (total <= 1) return;

      onChange({
        ...passengers,
        [key]: current - 1,
      });

      return;
    }

    onChange({
      ...passengers,
      [key]: current + 1,
    });
  }

  return (
    <div className="passengerSelector">
      <button
        type="button"
        className="passengerSelectorButton"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{summary}</span>

        <span className={open ? "bookingDropdownArrow bookingDropdownArrowOpen" : "bookingDropdownArrow"}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m7 10 5 5 5-5" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="passengerSelectorPanel">
          {rows.map((row) => {
            const count = passengers[row.key];

            return (
              <div className="passengerSelectorRow" key={row.key}>
                <div>
                  <strong>{row.title}</strong>
                  {row.subtitle ? <small>{row.subtitle}</small> : null}
                </div>

                <div className="passengerCounter">
                  <button
                    type="button"
                    onClick={() => updatePassenger(row.key, "minus")}
                    disabled={count <= 0 || (count === 1 && passengers.adults + passengers.children + passengers.youth + passengers.seniors <= 1)}
                  >
                    −
                  </button>

                  <span>{count}</span>

                  <button type="button" onClick={() => updatePassenger(row.key, "plus")}>
                    +
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            className="passengerSelectorDone"
            onClick={() => setOpen(false)}
          >
            Klart
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function BookingSearch() {
  const [stops, setStops] = useState<NormalizedStop[]>([]);
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("Ängelholm Helsingborg Airport");
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    youth: 0,
    seniors: 0,
  });
  const [loading, setLoading] = useState(true);

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

        const firstAirport =
          normalized.find((stop: NormalizedStop) => stop.isAirport) ||
          normalized.find((stop: NormalizedStop) =>
            stop.name.toLowerCase().includes("ängelholm")
          );

        if (firstAirport) {
          setToStop(firstAirport.name);
        }
      } catch (error) {
        console.error("Could not load shuttle stops:", error);
        setStops([]);
      } finally {
        setLoading(false);
      }
    }

    loadStops();
  }, []);

  const selectedFrom = useMemo(() => {
    return stops.find((stop: NormalizedStop) => stop.name === fromStop) || null;
  }, [stops, fromStop]);

  const fromItems = useMemo(() => {
    return stops.map((stop: NormalizedStop) => ({
      id: stop.id,
      label: stop.name,
      subLabel: stop.isAirport ? "Flygplats" : stop.city,
    }));
  }, [stops]);

  const toItems = useMemo(() => {
    const filtered = stops.filter((stop: NormalizedStop) => stop.name !== fromStop);

    if (selectedFrom?.isAirport) {
      return filtered
        .filter((stop: NormalizedStop) => !stop.isAirport)
        .map((stop: NormalizedStop) => ({
          id: stop.id,
          label: stop.name,
          subLabel: stop.city,
        }));
    }

    return filtered.map((stop: NormalizedStop) => ({
      id: stop.id,
      label: stop.name,
      subLabel: stop.isAirport ? "Flygplats" : stop.city,
    }));
  }, [stops, fromStop, selectedFrom]);

  const toLabel = selectedFrom?.isAirport ? "Till hållplats" : "Till flygplats";

  function searchTrip() {
    const params = new URLSearchParams();

    if (fromStop) params.set("from", fromStop);
    if (toStop) params.set("to", toStop);

    params.set("tripType", tripType);

    if (date) params.set("date", date);

    if (tripType === "roundTrip" && returnDate) {
      params.set("returnDate", returnDate);
    }

    params.set("adults", String(passengers.adults));
    params.set("children", String(passengers.children));
    params.set("youth", String(passengers.youth));
    params.set("seniors", String(passengers.seniors));

    window.location.href = `/start/valj-avgang?${params.toString()}`;
  }

  return (
    <section className="bookingSearchWrap" aria-label="Sök resa">
      <div className={tripType === "roundTrip" ? "bookingSearchBox bookingSearchBoxRoundTrip" : "bookingSearchBox bookingSearchBoxOneWay"}>
        <div className="bookingTripTypeSwitch" aria-label="Välj resetyp">
          <button
            type="button"
            className={tripType === "oneWay" ? "bookingTripTypeButton active" : "bookingTripTypeButton"}
            onClick={() => setTripType("oneWay")}
          >
            Enkel
          </button>

          <button
            type="button"
            className={tripType === "roundTrip" ? "bookingTripTypeButton active" : "bookingTripTypeButton"}
            onClick={() => setTripType("roundTrip")}
          >
            Tur & Retur
          </button>
        </div>

        <div className="bookingSearchField">
          <label>Från</label>

          <div className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
            </span>

            <CustomDropdown
              value={fromStop}
              placeholder="Välj avgångsort"
              items={fromItems}
              loading={loading}
              onChange={(value) => {
                setFromStop(value);

                if (value === toStop) {
                  setToStop("");
                }
              }}
            />
          </div>
        </div>

        <div className="bookingSearchField">
          <label>{toLabel}</label>

          <div className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 13.5 21 6l-7.5 18-3-8.5L3 13.5Z" />
                <path d="m10.5 15.5 4-4" />
              </svg>
            </span>

            <CustomDropdown
              value={toStop}
              placeholder={selectedFrom?.isAirport ? "Välj hållplats" : "Välj flygplats"}
              items={toItems}
              onChange={setToStop}
            />
          </div>
        </div>

        <div className="bookingSearchField">
          <label>{tripType === "roundTrip" ? "Utresa" : "Datum"}</label>

          <div className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 3v4" />
                <path d="M17 3v4" />
                <path d="M4.5 9h15" />
                <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
              </svg>
            </span>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bookingDateInput"
            />

            <span className="bookingSearchArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </div>
        </div>
        {tripType === "roundTrip" ? (
          <div className="bookingSearchField bookingReturnDateField">
            <label>Hemresa</label>

            <div className="bookingSearchInput">
              <span className="bookingSearchIcon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 3v4" />
                  <path d="M17 3v4" />
                  <path d="M4.5 9h15" />
                  <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                </svg>
              </span>

              <input
                type="date"
                value={returnDate}
                min={date || undefined}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bookingDateInput"
              />

              <span className="bookingSearchArrow">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </span>
            </div>
          </div>
        ) : null}

        <div className="bookingSearchField">
          <label>Antal resenärer</label>

          <div className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </span>

            <PassengerSelector passengers={passengers} onChange={setPassengers} />
          </div>
        </div>

        <button type="button" className="bookingSearchButton" onClick={searchTrip}>
          <span>Sök resa</span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z" />
            <path d="m16.2 16.2 4.3 4.3" />
          </svg>
        </button>
      </div>
    </section>
  );
}


