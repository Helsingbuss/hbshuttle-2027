"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "Hur tidigt bör jag vara vid hållplatsen?",
    answer:
      "Vi rekommenderar att du är på hållplatsen minst 10 minuter före avgång. Då hinner du i lugn och ro hitta rätt plats, ta fram din biljett och kliva ombord utan stress. Bussen avgår enligt tidtabell, så det är viktigt att vara på plats i god tid.",
  },
  {
    question: "Vad händer om jag missar bussen?",
    answer:
      "Om du missar din bokade avgång kan vi inte alltid garantera plats på en senare buss, eftersom varje avgång har ett begränsat antal platser. Kontakta kundservice om något händer, så hjälper vi dig så långt det är möjligt.",
  },
  {
    question: "Kan jag boka resa åt någon annan?",
    answer:
      "Ja, det går bra att boka en resa åt någon annan. Du fyller bara i rätt resenärsuppgifter vid bokningen och skickar biljetten till personen som ska resa. Biljetten kan visas digitalt i mobilen vid ombordstigning.",
  },
  {
    question: "Kan barn resa med Helsingbuss Airport Shuttle?",
    answer:
      "Ja, barn kan resa med Helsingbuss Airport Shuttle. Barn ska resa tillsammans med vuxen om inget annat anges i bokningsvillkoren. Information om barnbiljetter, åldersgränser och eventuella regler visas tydligt vid bokning.",
  },
  {
    question: "Vad gör jag om jag inte får min biljett?",
    answer:
      "Kontrollera först din skräppost eller kampanjmapp, eftersom e-post ibland kan hamna där. Du kommer även att kunna hitta biljetten digitalt via Mina biljetter, appen eller HB Shuttle Club. Om du fortfarande inte hittar biljetten kan du kontakta kundservice.",
  },
  {
    question: "Vad händer om bussen blir försenad?",
    answer:
      "Om bussen påverkas av trafik, väder eller andra händelser kommer vi att informera så tydligt som möjligt via våra digitala kanaler. Vi arbetar för att du som resenär ska få bra information och kunna känna dig trygg även om något oväntat händer.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <article className="faqCard">
      <h2>Vanliga frågor</h2>

      <div className="faqList">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div className="faqItem" key={item.question}>
              <button
                type="button"
                className="faqQuestion"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>

                <svg
                  className={isOpen ? "faqChevron open" : "faqChevron"}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </button>

              {isOpen && <p className="faqAnswer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <div className="faqMoreLink">
        <Link href="/start/kundinfo">Fler frågor och svar</Link>
      </div>
    </article>
  );
}
