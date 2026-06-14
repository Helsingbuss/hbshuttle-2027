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

export default function TravelHighlights() {
  const [highlights, setHighlights] = useState<HighlightCard[]>([]);

  useEffect(() => {
    async function loadHighlights() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PORTAL_API_URL;

        if (!baseUrl) {
          setHighlights([]);
          return;
        }

        const cleanBaseUrl = baseUrl.replace(/\/$/, "");

        const response = await fetch(`${cleanBaseUrl}/api/public/shuttle/highlights`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setHighlights([]);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data.cards)) {
          setHighlights([]);
          return;
        }

        const connectedHighlights: HighlightCard[] = data.cards
          .slice(0, 3)
          .map((card: any, index: number) => ({
            title: card.title || "",
            text: card.text || "",
            image: card.image || "",
            href: card.buttonLink || "/start",
            badge: index === 0 ? "%" : undefined,
          }));

        setHighlights(connectedHighlights);
      } catch (error) {
        console.error("Could not load shuttle highlights:", error);
        setHighlights([]);
      }
    }

    loadHighlights();
  }, []);

  if (highlights.length === 0) {
    return null;
  }

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
