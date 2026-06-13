"use client";

import Link from "next/link";

type Card = {
  title: string;
  text: string;
  icon: "company" | "hotel" | "group" | "contact";
  href?: string;
  button?: string;
};

const cards: Card[] = [
  {
    title: "Företagsresor",
    text: "Samlad fakturering och enkel bokning för företag.",
    icon: "company",
  },
  {
    title: "Hotell & partners",
    text: "Erbjud era gäster en smidig transferlösning.",
    icon: "hotel",
  },
  {
    title: "Gruppbokning",
    text: "Res tillsammans och få rabatt. Kontakta oss!",
    icon: "group",
  },
  {
    title: "Kontakta oss",
    text: "Vi hjälper dig hitta den bästa lösningen för er.",
    icon: "contact",
    href: "/start/kontakt",
    button: "Kontakta oss",
  },
];

function BusinessIcon({ icon }: { icon: Card["icon"] }) {
  if (icon === "company") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 21V6a2 2 0 0 1 2-2h7v17" />
        <path d="M13 9h5a2 2 0 0 1 2 2v10" />
        <path d="M7 8h3" />
        <path d="M7 12h3" />
        <path d="M7 16h3" />
        <path d="M16 13h2" />
        <path d="M16 17h2" />
        <path d="M3 21h18" />
      </svg>
    );
  }

  if (icon === "hotel") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 21V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" />
        <path d="M7 21v-5h10v5" />
        <path d="M8 11h.01" />
        <path d="M12 11h.01" />
        <path d="M16 11h.01" />
        <path d="M9 4h6" />
        <path d="M12 2v5" />
        <path d="M3 21h18" />
      </svg>
    );
  }

  if (icon === "group") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        <path d="M5.5 12a3 3 0 1 1 0-6" />
        <path d="M18.5 12a3 3 0 1 0 0-6" />
        <path d="M2 21a5.2 5.2 0 0 1 4.2-5.1" />
        <path d="M22 21a5.2 5.2 0 0 0-4.2-5.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
      <path d="M4 21a8 8 0 0 1 10.5-7.6" />
      <path d="M18 15v6" />
      <path d="M15 18h6" />
      <path d="M17.2 9.8 21 13.5" />
    </svg>
  );
}

export default function BusinessGroupSection() {
  return (
    <section className="businessGroupSection">
      <div className="businessGroupHead">
        <h2>Reser ni i jobbet eller i grupp?</h2>
        <p>
          Vi har lösningar som gör resan enklare för både företag, hotell och
          större sällskap.
        </p>
      </div>

      <div className="businessGroupGrid">
        {cards.map((card) => (
          <article className="businessGroupCard" key={card.title}>
            <div className="businessGroupIcon">
              <BusinessIcon icon={card.icon} />
            </div>

            <div className="businessGroupText">
              <h3>{card.title}</h3>
              <p>{card.text}</p>

              {card.href && card.button && (
                <Link href={card.href} className="businessGroupButton">
                  {card.button}
                  <span>→</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
