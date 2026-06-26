"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClubModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ClubModal({ open, onClose }: ClubModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const router = useRouter();

  function goToClub() {
    onClose();
    router.push('/start/club');
  }

  if (!open) return null;

  return (
    <div className="clubModalOverlay" role="dialog" aria-modal="true">
      <div className="clubModalBackdrop" onClick={onClose} />

      <div className="clubModalCard">
        <div className="clubModalTabs">
          <button
            type="button"
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Logga in
          </button>

          <button
            type="button"
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Registrera
          </button>
        </div>

        {tab === "login" ? (
          <div className="clubModalContent">
            <h2>Mina sidor</h2>

            <label className="clubModalField">
              <span>E-post</span>
              <div>
                <input type="email" />
                <small>•••</small>
              </div>
            </label>

            <label className="clubModalField">
              <span>Lösenord</span>
              <div>
                <input type="password" />
                <small>•••</small>
              </div>
            </label>

            <div className="clubModalRow">
              <label className="clubModalCheck">
                <input type="checkbox" />
                <span />
                Kom ihåg mig
              </label>

              <button type="button" className="clubModalTextButton">
                Glömt lösenord
              </button>
            </div>

            <button type="button" className="clubModalPrimary" onClick={goToClub}>
              Logga in
            </button>

            <button type="button" className="clubModalClose" onClick={onClose}>
              Stäng
            </button>
          </div>
        ) : (
          <div className="clubModalContent">
            <h2>Registrera dig som medlem</h2>

            <p className="clubModalIntro">
              Som medlem i HB Shuttle Club får du bättre översikt över dina biljetter,
              periodkort, kommande resor och erbjudanden. Här kommer du även kunna boka
              plats med periodkort och hantera dina digitala biljetter.
            </p>

            <label className="clubModalField withInfo">
              <span>E-post</span>
              <div>
                <input type="email" />
                <small>•••</small>
              </div>
              <i>i</i>
            </label>

            <label className="clubModalField withInfo">
              <span>Landsnummer</span>
              <select defaultValue="+46">
                <option value="+46">+46 (Sverige)</option>
                <option value="+45">+45 (Danmark)</option>
                <option value="+47">+47 (Norge)</option>
                <option value="+358">+358 (Finland)</option>
                <option value="+44">+44 (Storbritannien)</option>
              </select>
              <i>i</i>
            </label>

            <label className="clubModalField withInfo">
              <span>Telefonnummer</span>
              <input type="tel" />
              <i>i</i>
            </label>

            <label className="clubModalField withInfo">
              <span>Lösenord</span>
              <div>
                <input type="password" />
                <small>•••</small>
              </div>
              <i>i</i>
            </label>

            <label className="clubModalField withInfo">
              <span>Upprepa lösenord</span>
              <div>
                <input type="password" />
                <small>•••</small>
              </div>
              <i>i</i>
            </label>

            <label className="clubModalCheck registerCheck">
              <input type="checkbox" />
              <span />
              Jag vill gärna få information och erbjudanden från HB Shuttle till min e-post.
            </label>

            <button type="button" className="clubModalPrimary" onClick={goToClub}>
              Registrera mig!
            </button>

            <button type="button" className="clubModalClose" onClick={onClose}>
              Stäng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
