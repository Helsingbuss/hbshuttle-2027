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
  const iconMap: Record<Card["icon"], string> = {
    company: "/icons/business/business-travel.svg",
    hotel: "/icons/business/hotel-partners.svg",
    group: "/icons/business/group-booking.svg",
    contact: "/icons/business/contact-support.svg",
  };

  return (
    <img
      src={iconMap[icon]}
      alt=""
      aria-hidden="true"
      className="businessGroupIconImage"
    />
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

