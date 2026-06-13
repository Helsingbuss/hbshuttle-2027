"use client";

type Step = {
  number: string;
  title: string;
  text: string;
  icon: "search" | "ticket" | "bus" | "arrival";
};

const steps: Step[] = [
  {
    number: "1",
    title: "Sök resa",
    text: "Välj var du reser från, din flygplats och datum.",
    icon: "search",
  },
  {
    number: "2",
    title: "Boka biljett",
    text: "Välj avgång och betala enkelt online.",
    icon: "ticket",
  },
  {
    number: "3",
    title: "Res tryggt",
    text: "Kliv ombord och njut av en bekväm resa till flygplatsen.",
    icon: "bus",
  },
  {
    number: "4",
    title: "Framme i tid",
    text: "Vi ser till att du är i god tid inför ditt flyg.",
    icon: "arrival",
  },
];

function StepIcon({ icon }: { icon: Step["icon"] }) {
  if (icon === "search") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z" />
        <path d="m16.2 16.2 4.3 4.3" />
      </svg>
    );
  }

  if (icon === "ticket") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 8.5 15.5 3l4.5 9.5-11.5 5.5L4 8.5Z" />
        <path d="M8.5 9.5h6" />
        <path d="M10 12.5h5" />
        <path d="M6.5 13.6 9 19l11-5.2" />
      </svg>
    );
  }

  if (icon === "bus") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 4h12a3 3 0 0 1 3 3v8.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5V7a3 3 0 0 1 3-3Z" />
        <path d="M6.5 8h11" />
        <path d="M7 13h2" />
        <path d="M15 13h2" />
        <path d="M7 18v2" />
        <path d="M17 18v2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 4h10l3 3v13H6V4Z" />
      <path d="M16 4v4h4" />
      <path d="M9 14.5 11.2 17 16 11" />
      <path d="M8.5 8.5h4" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="howItWorks">
      <div className="sectionTitle">
        <h2>Så fungerar det</h2>
        <span />
      </div>

      <div className="stepsLine">
        {steps.map((step) => (
          <article key={step.number} className="stepItem">
            <div className="stepTop">
              <div className="stepNumber">{step.number}</div>

              <div className="stepIcon">
                <StepIcon icon={step.icon} />
              </div>
            </div>

            <div className="stepText">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
