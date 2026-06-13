"use client";

export default function BookingSearch() {
  return (
    <section className="bookingSearchWrap" aria-label="Sök resa">
      <div className="bookingSearchBox">
        <div className="bookingSearchField">
          <label>Från</label>
          <button type="button" className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
            </span>
            <span>Välj avgångsort</span>
            <span className="bookingSearchArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>
        </div>

        <div className="bookingSearchField">
          <label>Till flygplats</label>
          <button type="button" className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 13.5 21 6l-7.5 18-3-8.5L3 13.5Z" />
                <path d="m10.5 15.5 4-4" />
              </svg>
            </span>
            <span>Välj flygplats</span>
            <span className="bookingSearchArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>
        </div>

        <div className="bookingSearchField">
          <label>Datum</label>
          <button type="button" className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 3v4" />
                <path d="M17 3v4" />
                <path d="M4.5 9h15" />
                <path d="M6 5h12a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
              </svg>
            </span>
            <span>Välj datum</span>
            <span className="bookingSearchArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>
        </div>

        <div className="bookingSearchField">
          <label>Antal resenärer</label>
          <button type="button" className="bookingSearchInput">
            <span className="bookingSearchIcon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </span>
            <span>1 resenär</span>
            <span className="bookingSearchArrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </span>
          </button>
        </div>

        <button type="button" className="bookingSearchButton">
          <span>Sök resa</span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z" />
            <path d="m16.2 16.2 4.3 4.3" />
          </svg>
        </button>
      </div>
    </section>
  );
}

