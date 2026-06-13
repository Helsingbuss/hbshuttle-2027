"use client";

import { useState } from "react";
import Link from "next/link";

type SeasonKey =
  | "default"
  | "pask"
  | "midsommar"
  | "sommar"
  | "halloween"
  | "jul"
  | "nyar"
  | "pride";

type SeasonHeroContent = {
  imageBase: string;
  label: string;
  title: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const seasons: Record<SeasonKey, SeasonHeroContent> = {
  default: {
    imageBase: "/images/season/hbshuttle-hero-default",
    label: "Flygbuss",
    title: "Smidig flygbuss till och från flygplatsen",
    text: "Trygg, bekväm och pålitlig transfer till och från flygplatsen – varje dag, året om.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  pask: {
    imageBase: "/images/season/hbshuttle-hero-pask",
    label: "Påskresor",
    title: "Res smidigt till flyget i påsk",
    text: "Planera påskresan i god tid och ta dig tryggt till flygplatsen med HB Shuttle.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  midsommar: {
    imageBase: "/images/season/hbshuttle-hero-midsommar",
    label: "Midsommarresor",
    title: "Smidig resa till flyget i midsommar",
    text: "Res tryggt och bekvämt när midsommarhelgen närmar sig – från stad till flygplats.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  sommar: {
    imageBase: "/images/season/hbshuttle-hero-sommar",
    label: "Sommarresor",
    title: "Smidig flygbuss till och från flygplatsen",
    text: "Starta semestern lugnt med bekväm flygbuss, digital biljett och tydliga hållplatser.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  halloween: {
    imageBase: "/images/season/hbshuttle-hero-halloween",
    label: "Halloween",
    title: "Res tryggt till flyget i höstmörkret",
    text: "När kvällarna blir mörkare gör vi resan till och från flygplatsen trygg och enkel.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Trafikinfo",
    secondaryHref: "/start/trafikinfo",
  },
  jul: {
    imageBase: "/images/season/hbshuttle-hero-jul",
    label: "Julresor",
    title: "Hem till jul eller vidare ut i världen",
    text: "Res bekvämt till flygplatsen under julperioden med tydliga avgångar och enkel bokning.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  nyar: {
    imageBase: "/images/season/hbshuttle-hero-nyar",
    label: "Nyårsresor",
    title: "Börja året med en smidig resa",
    text: "Ta dig till flygplatsen enkelt, tryggt och bekvämt under årets första resor.",
    primaryLabel: "Boka nu",
    primaryHref: "/start",
    secondaryLabel: "Se tidtabell",
    secondaryHref: "/start/tidtabell",
  },
  pride: {
    imageBase: "/images/season/hbshuttle-hero-pride",
    label: "PrideXpress",
    title: "Your ride to love and celebration",
    text: "Trygga och bekväma resor till Pride och andra evenemang med Helsingbuss.",
    primaryLabel: "Läs mer",
    primaryHref: "/start/pride",
    secondaryLabel: "Kontakta oss",
    secondaryHref: "/start/kontakt",
  },
};

function getSeasonByDate(): SeasonKey {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month === 12 && day >= 28) return "nyar";
  if (month === 1 && day <= 6) return "nyar";
  if (month === 12) return "jul";
  if (month === 10) return "halloween";
  if (month === 6 && day >= 15 && day <= 30) return "midsommar";
  if (month === 6 || month === 7 || month === 8) return "sommar";
  if ((month === 3 && day >= 20) || (month === 4 && day <= 25)) return "pask";

  return "default";
}

const MANUAL_SEASON: SeasonKey | null = null;

function SeasonHeroImage({ imageBase, title }: { imageBase: string; title: string }) {
  const extensions = [".jpg", ".png", ".webp", ".jpeg"];
  const [index, setIndex] = useState(0);

  return (
    <img
      className="seasonHeroCleanImg"
      src={`${imageBase}${extensions[index]}`}
      alt={title}
      onError={() => {
        if (index < extensions.length - 1) {
          setIndex(index + 1);
        }
      }}
    />
  );
}

export default function SeasonHero() {
  const activeSeason = MANUAL_SEASON ?? getSeasonByDate();
  const content = seasons[activeSeason];

  return (
    <section className="seasonHeroClean">
      <SeasonHeroImage imageBase={content.imageBase} title={content.title} />

      <div className="seasonHeroCleanOverlay" />

      <div className="seasonHeroCleanContent">
        <p className="seasonHeroCleanLabel">{content.label}</p>

        <h1>{content.title}</h1>

        <p>{content.text}</p>

        <div className="seasonHeroCleanActions">
          <Link href={content.primaryHref} className="seasonHeroCleanPrimary">
            {content.primaryLabel}
            <span>→</span>
          </Link>

          <Link href={content.secondaryHref} className="seasonHeroCleanSecondary">
            {content.secondaryLabel}
            <span>▣</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

