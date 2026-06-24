"use client";

import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

const infoCards = [
  {
    title: "Bagage",
    tag: "Inför resan",
    text: "Du kan ta med normalt resebagage på flygbussen. Mer detaljerade bagageregler visas i samband med bokning och biljettinformation.",
    points: [
      "Normalt resebagage ingår",
      "Placera bagage enligt personalens anvisningar",
      "Specialbagage kan kräva förhandskontakt",
    ],
  },
  {
    title: "Kundservice",
    tag: "Hjälp och kontakt",
    text: "Behöver du hjälp med resa, biljett, bokning eller något som gäller flygbussen? Kundservice hjälper dig vidare.",
    points: [
      "Frågor om bokning och biljett",
      "Hjälp vid ändringar eller problem",
      "Kontaktvägar publiceras inför trafikstart",
    ],
  },
  {
    title: "App & e-biljett",
    tag: "Digital resa",
    text: "Din biljett skickas digitalt och kommer kunna visas via Mina biljetter, appen eller HB Shuttle Club.",
    points: [
      "Digital biljett med QR-kod",
      "Visa biljetten i mobilen",
      "Appfunktioner lanseras stegvis",
    ],
  },
  {
    title: "Resa med barn",
    tag: "Trygg resa",
    text: "Vi vill att resan ska kännas enkel även för familjer. Mer information om barnbiljetter och praktiska råd visas vid bokning.",
    points: [
      "Barn- och ungdomspriser planeras",
      "Kom i god tid till hållplatsen",
      "Ha biljett redo vid ombordstigning",
    ],
  },
  {
    title: "Tillgänglighet",
    tag: "Res med trygghet",
    text: "Vi arbetar för att göra resan tydlig och enkel. Information om hållplatser, fordon och hjälpmedel uppdateras löpande.",
    points: [
      "Tydliga hållplatser och avgångstider",
      "Information före resan",
      "Kontakta oss vid särskilda behov",
    ],
  },
  {
    title: "Vanliga frågor",
    tag: "Snabb hjälp",
    text: "Här samlar vi svar på de vanligaste frågorna om flygbussen, biljetter, tider, förseningar och resan till flygplatsen.",
    points: [
      "Bokning och betalning",
      "Trafikinfo och förseningar",
      "Hållplatser och tider",
    ],
  },
];

export default function CustomerInfoPage() {
  return (
    <>
      <BetaHeader sticky />

      <main className="customerInfoPage">
        <section className="customerInfoHero">
          <p>Helsingbuss Airport Shuttle</p>
          <h1>Kundinfo</h1>
          <span>
            Här hittar du viktig information inför din resa med HB Shuttle.
            Vi samlar bagage, kundservice, e-biljett och praktiska råd på ett ställe.
          </span>
        </section>

        <section className="customerInfoLayout">
          <aside className="customerInfoIntro">
            <div className="customerInfoIntroCard">
              <small>Snabb överblick</small>
              <strong>Allt du behöver veta inför resan</strong>
              <p>
                Sidan är förberedd så att vi senare kan koppla innehållet till portalen
                och uppdatera informationen utan att ändra koden.
              </p>
            </div>

            <nav className="customerInfoLinks" aria-label="Kundinformation">
              {infoCards.map((card) => (
                <a key={card.title} href={"#" + card.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "och")}>
                  {card.title}
                </a>
              ))}
            </nav>
          </aside>

          <section className="customerInfoCards">
            {infoCards.map((card) => (
              <article
                id={card.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "och")}
                className="customerInfoCard"
                key={card.title}
              >
                <div>
                  <small>{card.tag}</small>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </div>

                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
