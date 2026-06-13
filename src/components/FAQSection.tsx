"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Hur bokar jag en resa?",
    answer:
      "Du väljer avgångsort, flygplats, datum och antal resenärer. Därefter väljer du avgång och betalar enkelt online.",
  },
  {
    question: "Kan jag ta med mycket bagage?",
    answer:
      "Ja, du kan ta med normalt resebagage. Mer detaljerade bagageregler kommer att visas i samband med bokningen.",
  },
  {
    question: "Vad händer om mitt flyg är försenat?",
    answer:
      "Vi kommer att ge tydlig information om avgångar, trafikläge och eventuella ändringar så att du kan planera din resa tryggt.",
  },
  {
    question: "Var hittar jag min biljett?",
    answer:
      "Din biljett skickas digitalt och kommer även kunna visas via Mina biljetter när bokningssystemet är aktiverat.",
  },
  {
    question: "Kan företag boka konto?",
    answer:
      "Ja, vi planerar företagskonto för enklare bokning, samlad fakturering och bättre översikt för återkommande resor.",
  },
  {
    question: "Är det gratis Wi-Fi ombord?",
    answer:
      "Målet är att erbjuda bekväma resor med moderna funktioner. Exakt utrustning kan variera beroende på fordon och avgång.",
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
    </article>
  );
}
