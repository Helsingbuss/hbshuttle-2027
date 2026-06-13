"use client";

type TrustItem = {
  title: string;
  text: string;
  icon: "route" | "calendar" | "ticket" | "support";
};

const items: TrustItem[] = [
  {
    title: "3 planerade linjer",
    text: "Förbindelser till viktiga flygplatser.",
    icon: "route",
  },
  {
    title: "2027",
    text: "Planerad trafikstart.",
    icon: "calendar",
  },
  {
    title: "Digital biljett",
    text: "Smidig bokning med QR-kod.",
    icon: "ticket",
  },
  {
    title: "Support & trafikinfo",
    text: "Hjälp inför och under resan.",
    icon: "support",
  },
];

function TrustIcon({ icon }: { icon: TrustItem["icon"] }) {
  if (icon === "route") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M6 13V8a3 3 0 0 1 3-3h6" />
        <path d="M18 11v5a3 3 0 0 1-3 3H9" />
      </svg>
    );
  }

  if (icon === "calendar") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4.5 9h15" />
        <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      </svg>
    );
  }

  if (icon === "ticket") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8Z" />
        <path d="M9 10v8" />
        <path d="M13 12h4" />
        <path d="M13 15h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-1" />
      <path d="M4 12v4a3 3 0 0 0 3 3h1" />
      <path d="M8 13v4" />
      <path d="M16 13v4" />
      <path d="M10 21h4" />
    </svg>
  );
}

export default function TrustStats() {
  return (
    <section className="trustStats">
      {items.map((item) => (
        <article className="trustStatItem" key={item.title}>
          <div className="trustStatIcon">
            <TrustIcon icon={item.icon} />
          </div>

          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
