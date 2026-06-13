"use client";

type AirportCard = {
  title: string;
  subtitle: string;
  status?: string;
  isNew?: boolean;
  type: "angelholm" | "malmo" | "copenhagen" | "goteborg";
};

const airports: AirportCard[] = [
  {
    title: "Ängelholm",
    subtitle: "Helsingborg Airport",
    type: "angelholm",
  },
  {
    title: "Malmö Airport",
    subtitle: "Kommer snart",
    status: "Kommer snart",
    type: "malmo",
  },
  {
    title: "Copenhagen Airport",
    subtitle: "Kommer snart",
    status: "Kommer snart",
    type: "copenhagen",
  },
  {
    title: "Göteborg Landvetter",
    subtitle: "Kommer snart",
    status: "Kommer snart",
    isNew: false,
    type: "goteborg",
  },
];

function AirportIllustration({ type }: { type: AirportCard["type"] }) {
  if (type === "angelholm") {
    return (
      <svg viewBox="0 0 220 90" fill="none">
        <path d="M28 68h160" />
        <path d="M52 66V38h42v28" />
        <path d="M70 38V20h28v46" />
        <path d="M75 20h18" />
        <path d="M110 66V46h38v20" />
        <path d="M42 66c10-15 31-15 42 0" />
        <path d="M150 66c9-13 26-13 35 0" />
        <path d="M120 34h34" />
        <path d="M158 34l20 10" />
        <circle cx="194" cy="67" r="5" />
        <circle cx="39" cy="67" r="5" />
      </svg>
    );
  }

  if (type === "malmo") {
    return (
      <svg viewBox="0 0 220 90" fill="none">
        <path d="M26 68h168" />
        <path d="M45 66c28-38 82-38 110 0" />
        <path d="M63 66c23-28 60-28 83 0" />
        <path d="M82 66c15-18 36-18 51 0" />
        <path d="M154 66V22h22v44" />
        <path d="M150 22h30" />
        <path d="M158 16h14" />
        <circle cx="38" cy="68" r="5" />
        <circle cx="188" cy="68" r="5" />
      </svg>
    );
  }

  if (type === "copenhagen") {
    return (
      <svg viewBox="0 0 220 90" fill="none">
        <path d="M25 68h170" />
        <path d="M45 66V48h92v18" />
        <path d="M58 48V36h65v12" />
        <path d="M140 66V24h24v42" />
        <path d="M136 24h32" />
        <path d="M144 18h16" />
        <path d="M70 39h36" />
        <path d="M38 66c11-15 30-15 41 0" />
        <circle cx="186" cy="68" r="5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 90" fill="none">
      <path d="M26 68h168" />
      <path d="M45 66V42h26v24" />
      <path d="M82 66V24l13-12 13 12v42" />
      <path d="M118 66c18-30 55-30 73 0" />
      <path d="M126 66c15-20 43-20 57 0" />
      <path d="M138 48h32" />
      <path d="M92 30h6" />
      <path d="M92 42h6" />
      <path d="M92 54h6" />
      <circle cx="37" cy="68" r="5" />
      <circle cx="195" cy="68" r="5" />
    </svg>
  );
}

export default function PopularAirports() {
  return (
    <section className="popularAirports">
      <div className="popularAirportsHead">
        <h2>Populära flygplatser</h2>
        <span />
      </div>

      <div className="airportCards">
        {airports.map((airport) => (
          <article
            key={airport.title}
            className={`airportCard ${airport.status ? "airportCardSoon" : ""}`}
          >
            {airport.isNew && <div className="airportBadge">NY</div>}

            <div className="airportArt">
              <AirportIllustration type={airport.type} />
            </div>

            <div className="airportCardBottom">
              <div>
                <h3>{airport.title}</h3>
                <p>{airport.subtitle}</p>
              </div>

              <button
                type="button"
                className="airportArrow"
                aria-label={`Välj ${airport.title}`}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

