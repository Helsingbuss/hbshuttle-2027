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
              d="M8 54C27 39 45 33 64 34C80 35 94 40 108 47"
              className="newsletterBusTrail"
            />
          </svg>

          <img
            src="/icons/ui/bus.svg"
            alt=""
            className="newsletterBusImage"
          />
        </div>
    </section>
  );
}


