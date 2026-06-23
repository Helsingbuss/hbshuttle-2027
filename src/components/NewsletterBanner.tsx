"use client";

export default function NewsletterBanner() {
  return (
    <section className="newsletterBanner">
      <div className="newsletterIcon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16v12H4V6Z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </div>

      <div className="newsletterText">
        <h2>Få nyheter och erbjudanden</h2>
        <p>Anmäl dig till vårt nyhetsbrev och få exklusiva erbjudanden och uppdateringar.</p>
      </div>

      <form className="newsletterForm">
        <div className="newsletterInputWrap">
          <span>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16v12H4V6Z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </span>

          <input type="email" placeholder="Din e-postadress" />
        </div>

        <button type="button">Anmäl mig</button>
      </form>
        <div className="newsletterBusDecor" aria-hidden="true">
          <svg
            viewBox="0 0 180 80"
            className="newsletterBusSvg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              d="M10 54C28 40 44 34 62 34C79 34 94 39 108 46"
              className="newsletterBusTrail"
            />

            <g className="newsletterBusIcon">
              <rect x="108" y="24" width="46" height="26" rx="8" />
              <path d="M113 31H147" />
              <path d="M113 39H154" />
              <rect x="116" y="30" width="12" height="7" rx="2" />
              <rect x="132" y="30" width="12" height="7" rx="2" />
              <rect x="148" y="30" width="6" height="7" rx="2" />
              <circle cx="120" cy="55" r="5" />
              <circle cx="145" cy="55" r="5" />
              <path d="M108 50H154" />
            </g>
          </svg>
        </div>
    </section>
  );
}

