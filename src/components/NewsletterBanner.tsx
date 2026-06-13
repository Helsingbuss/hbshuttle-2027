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

      <div className="newsletterPlane" aria-hidden="true">
        <svg viewBox="0 0 180 90" fill="none">
          <path d="M12 58C45 34 78 30 116 40" />
          <path d="M118 40 164 18 146 46 166 64 126 53 106 78 118 40Z" />
        </svg>
      </div>
    </section>
  );
}
