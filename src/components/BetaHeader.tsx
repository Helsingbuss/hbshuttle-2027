"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MegaMenuFeature from "@/components/MegaMenuFeature";
import GoogleTranslateLoader from "@/components/GoogleTranslateLoader";
import ClubModal from "@/components/ClubModal";

type IconName =
  | "ticket"
  | "route"
  | "clock"
  | "pin"
  | "plane"
  | "alert"
  | "support"
  | "info"
  | "club"
  | "menu";

type MenuLink = {
  icon: IconName;
  label: string;
  href: string;
};

const mainLinks = [
  { label: "Köp", href: "/start" },
  { label: "Tidtabell", href: "/start/tidtabell" },
  { label: "Hållplatser", href: "/start/hallplatser" },
  { label: "Trafikinfo", href: "/start/trafikinfo" },
];

const languageLinks = [
  { label: "Svenska", flagClass: "fi fi-se", code: "sv" },
  { label: "English", flagClass: "fi fi-gb", code: "en" },
  { label: "Dansk", flagClass: "fi fi-dk", code: "da" },
  { label: "Norsk", flagClass: "fi fi-no", code: "no" },
  { label: "Suomi", flagClass: "fi fi-fi", code: "fi" },
];

const megaLinks: MenuLink[] = [
  { icon: "ticket", label: "Biljetter & priser", href: "/start/biljetter" },
  { icon: "route", label: "Planera resa", href: "/start/planera" },
  { icon: "clock", label: "Tidtabell", href: "/start/tidtabell" },
  { icon: "pin", label: "Hållplatser", href: "/start/hallplatser" },
  { icon: "plane", label: "Flygplatser", href: "/start/flygplatser" },
  { icon: "alert", label: "Trafikinfo", href: "/start/trafikinfo" },
  { icon: "support", label: "Kundservice", href: "/start/kundservice" },
  { icon: "info", label: "Om Helsingbuss Airport Shuttle", href: "/start/om-oss" },
];

function MenuIcon({ name }: { name: IconName }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  if (name === "ticket") {
    return (
      <svg {...common}>
        <path d="M4 8.5V6.8C4 5.8 4.8 5 5.8 5h12.4c1 0 1.8.8 1.8 1.8v1.7a2.5 2.5 0 0 0 0 5v3.7c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8v-3.7a2.5 2.5 0 0 0 0-5Z" />
        <path d="M9 7.2v9.6" />
        <path d="M12 9h4.2" />
        <path d="M12 13h3.2" />
      </svg>
    );
  }

  if (name === "route") {
    return (
      <svg {...common}>
        <path d="M6.5 18.5c2.4-3.2 8.6-.4 11-3.6 1.4-1.9.3-4.4-2-4.7-2.2-.3-4.2 1.3-6.2 1.3-2.8 0-4.3-2.4-2.8-5" />
        <path d="M6.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M16.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 8v4.4l3 1.8" />
      </svg>
    );
  }

  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
        <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      </svg>
    );
  }

  if (name === "plane") {
    return (
      <svg {...common}>
        <path d="M3.5 12.5 20 5l-6.2 15-3.1-6.5-7.2-1Z" />
        <path d="M20 5 10.7 13.5" />
      </svg>
    );
  }

  if (name === "alert") {
    return (
      <svg {...common}>
        <path d="M12 4 21 19H3L12 4Z" />
        <path d="M12 9v4.5" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg {...common}>
        <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
        <path d="M5 13.5c0-1 .8-1.8 1.8-1.8H8v5H6.8c-1 0-1.8-.8-1.8-1.8v-1.4Z" />
        <path d="M19 13.5c0-1-.8-1.8-1.8-1.8H16v5h1.2c1 0 1.8-.8 1.8-1.8v-1.4Z" />
        <path d="M16 17c-.4 1.4-1.7 2-4 2" />
      </svg>
    );
  }

  if (name === "info") {
    return (
      <svg {...common}>
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </svg>
    );
  }

  if (name === "club") {
    return (
      <svg {...common}>
        <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5 20c.7-3.5 3-5.4 7-5.4s6.3 1.9 7 5.4" />
        <path d="M17.5 6.5 19 8l2-2.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function BetaHeader({ sticky = false }: { sticky?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clubModalOpen, setClubModalOpen] = useState(false);
  function closeMenu() {
    setMenuOpen(false);
  }

  function openClubModal(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    setMenuOpen(false);
    setClubModalOpen(true);
  }

  function changeLanguage(languageCode: string) {
    const target = languageCode === "sv" ? "/sv/sv" : "/sv/" + languageCode;

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    document.cookie =
      "googtrans=" + target + "; expires=" + expires.toUTCString() + "; path=/";

    document.cookie =
      "googtrans=" + target + "; expires=" + expires.toUTCString() + "; path=/; domain=.hbshuttle.se";

    closeMenu();

    window.location.reload();
  }

  return (
    <>
      <GoogleTranslateLoader />
      <ClubModal open={clubModalOpen} onClose={() => setClubModalOpen(false)} />
      <header className={`${sticky ? "bookingStickyHeader " : ""}${menuOpen ? "betaHeader menuIsOpen" : "betaHeader"}`}>
        <Link href="/start" className="betaLogo" aria-label="HB Shuttle startsida">
          <div className="betaLogoMark">H</div>
          <div>
            <div className="betaLogoTitle">HBSHUTTLE</div>
            <div className="betaLogoSub">Helsingbuss Airport Shuttle</div>
          </div>
        </Link>

        <nav className="betaNav" aria-label="Huvudmeny">
          {mainLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}

          <Link href="/start/club" onClick={openClubModal}>
            Min biljett
          </Link>

          <div className="languageDropdown">
            <button type="button" className="languageButton">
              <span className="languageGlobeIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="M3.6 9h16.8" />
                  <path d="M3.6 15h16.8" />
                  <path d="M12 3c2.2 2.4 3.2 5.4 3.2 9s-1 6.6-3.2 9" />
                  <path d="M12 3c-2.2 2.4-3.2 5.4-3.2 9s1 6.6 3.2 9" />
                </svg>
              </span>
              Language
              <span className="languageChevron">⌄</span>
            </button>

            <div className="languageMenu">
              {languageLinks.map((language) => (
                <button
                  key={language.label}
                  type="button"
                  className="languageMenuItem"
                  onClick={() => changeLanguage(language.code)}
                >
                  <span className={"languageFlagImage " + language.flagClass} aria-hidden="true" />
                  <span>{language.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={menuOpen ? "menuButton isOpen" : "menuButton"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? (
              <span className="closeMenuIcon">×</span>
            ) : (
              <span className="menuButtonIcon">
                <i />
                <i />
                <i />
              </span>
            )}
            {menuOpen ? "Stäng" : "Meny"}
          </button>
        </nav>

        <Link href="/start/club" className="clubButton" onClick={openClubModal}>
          <span className="clubButtonIcon">
            <MenuIcon name="club" />
          </span>
          HB Shuttle Club
        </Link>

        <button
          type="button"
          className={menuOpen ? "mobileMenuButton isOpen" : "mobileMenuButton"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <span className="closeMenuIcon">×</span>
          ) : (
            <span className="menuButtonIcon">
              <i />
              <i />
              <i />
            </span>
          )}
          {menuOpen ? "Stäng" : "Meny"}
        </button>
      </header>

      <div
        className={menuOpen ? "megaBackdrop open" : "megaBackdrop"}
        onClick={closeMenu}
      />

      <aside className={menuOpen ? "megaMenu flyStyle open" : "megaMenu flyStyle"} aria-hidden={!menuOpen}>
        <div className="megaMenuInner">
          <div className="megaMenuGrid">
            <nav className="megaMenuLinks" aria-label="Utökad meny">
              {megaLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={index === 0 ? "active" : ""}
                  onClick={closeMenu}
                >
                  <span className="megaIcon">
                    <MenuIcon name={link.icon} />
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="megaLoginLine" />

              <Link href="/start/club" onClick={openClubModal}>
                <span className="megaIcon">
                  <MenuIcon name="club" />
                </span>
                <span>HB Shuttle Club</span>
              </Link>
            </nav>

            <div className="megaDivider" />

            <MegaMenuFeature />
          </div>
        </div>
      </aside>
    </>
  );
}



