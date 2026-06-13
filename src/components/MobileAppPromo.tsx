"use client";

const appFeatures = [
  "E-biljett med QR-kod",
  "Följ bussen i realtid",
  "Ändra eller avboka enkelt",
  "Få viktiga uppdateringar",
];

export default function MobileAppPromo() {
  return (
    <article className="mobileAppPromo">
      <div className="phoneMockup">
        <div className="hbPhone">
          <div className="hbPhoneNotch" />
          <div className="hbPhoneScreen">
            <div className="hbPhoneTopbar">
              <div className="hbPhoneBrand">
                <span className="hbPhoneLogoDot" />
                <div>
                  <strong>Helsingbuss</strong>
                  <small>E-biljett</small>
                </div>
              </div>

              <div className="hbPhoneTopIcons">
                <span />
                <span />
              </div>
            </div>

            <div className="hbTicketCard">
              <div className="hbTicketHeader">
                <span>Enkelresa</span>
                <strong>20 kr</strong>
              </div>

              <div className="hbQrWrap">
                <div className="hbQrCode">
                  {Array.from({ length: 81 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index % 2 === 0 ||
                        index % 5 === 0 ||
                        index % 7 === 0 ||
                        index % 11 === 0
                          ? "dark"
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="hbTicketCode">C0D0</div>

              <button type="button" className="hbTicketButton">
                E-biljett
              </button>

              <p className="hbTicketSubtext">Redo för QR Scan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mobileAppText">
        <h2>Smidig e-biljett, bokning och uppdateringar i mobilen</h2>

        <ul>
          {appFeatures.map((feature) => (
            <li key={feature}>
              <span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="appStoreButtons">
          <button type="button" className="storeButton">
            <small>Ladda ned på</small>
            <strong>App Store</strong>
          </button>

          <button type="button" className="storeButton">
            <small>Hämta den på</small>
            <strong>Google Play</strong>
          </button>
        </div>
      </div>
    </article>
  );
}
