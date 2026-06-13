"use client";

import Link from "next/link";

const quickLinks = [
  { label: "Boka resa", href: "/start" },
  { label: "Tidtabell", href: "/start/tidtabell" },
  { label: "Flygplatser", href: "/start/flygplatser" },
  { label: "Trafikinfo", href: "/start/trafikinfo" },
  { label: "Om oss", href: "/start/om-oss" },
  { label: "Kontakt", href: "/start/kontakt" },
];

function FooterIcon({ type }: { type: "phone" | "mail" | "pin" | "facebook" | "instagram" | "linkedin" }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L17 13l5 2v4a2 2 0 0 1-2 2C10.6 21 3 13.4 3 4a2 2 0 0 1 2-2h2Z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16v12H4V6Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z" />
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 10v10" />
      <path d="M6 6v.01" />
      <path d="M11 20v-6a4 4 0 0 1 8 0v6" />
      <path d="M11 10v10" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterMain">
        <div className="footerBrand">
          <Link href="/start" className="footerLogo">
            <span className="footerLogoMark">H</span>
            <span>
              <strong>HBSHUTTLE</strong>
              <small>Helsingbuss Airport Shuttle</small>
            </span>
          </Link>

          <p>Din smidiga länk mellan hemstaden och flygplatsen.</p>
        </div>

        <div className="footerColumn">
          <h3>Kontakt</h3>

          <ul className="footerContactList">
            <li>
              <FooterIcon type="phone" />
              <span>042-12 34 56</span>
            </li>

            <li>
              <FooterIcon type="mail" />
              <span>info@hbshuttle.se</span>
            </li>

            <li>
              <FooterIcon type="pin" />
              <span>Järnvägsgatan 13, 252 24 Helsingborg</span>
            </li>
          </ul>
        </div>

        <div className="footerColumn">
          <h3>Snabblänkar</h3>

          <ul className="footerQuickLinks">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footerColumn">
          <h3>Följ oss</h3>

          <div className="footerSocials">
            <a href="#" aria-label="Facebook">
              <FooterIcon type="facebook" />
            </a>

            <a href="#" aria-label="Instagram">
              <FooterIcon type="instagram" />
            </a>

            <a href="#" aria-label="LinkedIn">
              <FooterIcon type="linkedin" />
            </a>
          </div>
        </div>

        <div className="footerStamp">
          <svg viewBox="0 0 140 140" className="footerStampSvg" aria-label="Ditt resval sedan 2027">
            <defs>
              <path
                id="footerStampTop"
                d="M 26 70 A 44 44 0 0 1 114 70"
              />
              <path
                id="footerStampBottom"
                d="M 114 70 A 44 44 0 0 1 26 70"
              />
            </defs>

            <circle cx="70" cy="70" r="58" />
            <text className="footerStampText">
              <textPath href="#footerStampTop" startOffset="50%" textAnchor="middle">
                DITT RESVAL
              </textPath>
            </text>

            <text x="70" y="84" className="footerStampH" textAnchor="middle">
              H
            </text>

            <text className="footerStampText">
              <textPath href="#footerStampBottom" startOffset="50%" textAnchor="middle">
                SEDAN 2027
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="siteFooterBottom">
        <p>© 2027 HBSHUTTLE AB. Alla rättigheter förbehållna.</p>

        <div>
          <Link href="/start/cookies">Cookies</Link>
          <Link href="/start/integritet">Integritetspolicy</Link>
          <Link href="/start/villkor">Villkor</Link>
        </div>
      </div>
    </footer>
  );
}

