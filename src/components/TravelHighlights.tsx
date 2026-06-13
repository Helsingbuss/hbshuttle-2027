"use client";

import Link from "next/link";

type HighlightCard = {
  title: string;
  text: string;
  image: string;
  href: string;
  badge?: string;
};

const highlights: HighlightCard[] = [
  {
    title: "Köp nu – res när det passar dig",
    text: "Din biljett är flexibel och giltig på valfri avgång den dagen du valt. Ändra enkelt online.",
    image: "/images/highlights/highlight-booking.jpg",
    href: "/start/biljetter",
    badge: "%",
  },
  {
    title: "Res ihop – smidigt för familj och vänner",
    text: "Barn åker till rabatterat pris och ni kan lägga till bagage. Smidig resa för hela sällskapet.",
    image: "/images/highlights/highlight-family.jpg",
    href: "/start/gruppresor",
  },
  {
    title: "Bekvämt ombord med Wi-Fi & plats",
    text: "Rymliga säten, gott om bagageutrymme, USB-uttag och gratis Wi-Fi ombord.",
    image: "/images/highlights/highlight-onboard.jpg",
    href: "/start/ombord",
  },
];

export default function TravelHighlights() {
  return (
    <section className="travelHighlights">
      <div className="travelHighlightGrid">
        {highlights.map((item) => (
          <article className="travelHighlightCard" key={item.title}>
            <div className="travelHighlightImageWrap">
              <img src={item.image} alt="" className="travelHighlightImage" />

              {item.badge && (
                <div className="travelHighlightBadge">{item.badge}</div>
              )}
            </div>

            <div className="travelHighlightContent">
              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <Link href={item.href} className="travelHighlightLink">
                Läs mer
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
