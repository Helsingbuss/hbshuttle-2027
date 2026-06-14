"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HighlightCard = {
  title: string;
  text: string;
  image: string;
  href: string;
  badge?: string;
};

const fallbackHighlights: HighlightCard[] = [
  {
    title: "Köp nu – res när det passar dig",
    text: "Din biljett är flexibel och giltig på valfri avgång den dagen du valt. Ändra enkelt online.",
    image: "/images/highlights/highlight-booking.png",
    href: "/start/biljetter",
    badge: "%",
  },
  {
    title: "Res ihop – smidigt för familj och vänner",
    text: "Barn åker till rabatterat pris och ni kan lägga till bagage. Smidig resa för hela sällskapet.",
    image: "/images/highlights/highlight-family.png",
    href: "/start/gruppresor",
  },
  {
    title: "Bekvämt ombord med Wi-Fi & plats",
    text: "Rymliga säten, gott om bagageutrymme, USB-uttag och gratis Wi-Fi ombord.",
    image: "/images/highlights/highlight-onboard.png",
    href: "/start/ombord",
  },
];

export default function TravelHighlights() {
  const [highlights, setHighlights] = useState<HighlightCard[]>(fallbackHighlights);

  useEffect(() => {
    async function loadHighlights() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_PORTAL_API_URL || "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/public/shuttle/highlights`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (Array.isArray(data.cards) && data.cards.length > 0) {
          const connectedHighlights: HighlightCard[] = data.cards
            .slice(0, 3)
            .map((card: any, index: number) => ({
              title: card.title || fallbackHighlights[index]?.title || "",
              text: card.text || fallbackHighlights[index]?.text || "",
              image: card.image || fallbackHighlights[index]?.image || "",
              href: card.buttonLink || fallbackHighlights[index]?.href || "/start",
              badge: index === 0 ? "%" : undefined,
            }));

          setHighlights(connectedHighlights);
        }
      } catch (error) {
        console.error("Could not load shuttle highlights:", error);
      }
    }

    loadHighlights();
  }, []);

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
