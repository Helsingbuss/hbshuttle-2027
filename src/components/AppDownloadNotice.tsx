"use client";

import { useEffect, useState } from "react";

const SHOW_APP_NOTICE = true;

export default function AppDownloadNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!SHOW_APP_NOTICE) return;

    const dismissed = localStorage.getItem("hbshuttle_app_notice_closed");
    const isMobile = window.matchMedia("(max-width: 760px)").matches;

    if (isMobile && dismissed !== "true") {
      const timer = window.setTimeout(() => {
        setVisible(true);
      }, 900);

      return () => window.clearTimeout(timer);
    }
  }, []);

  function closeNotice() {
    localStorage.setItem("hbshuttle_app_notice_closed", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="appNotice">
      <div className="appNoticeIcon">HB</div>

      <div className="appNoticeText">
        <strong>Ladda ner HB Shuttle-appen</strong>
        <p>
          Få snabbare bokning, digital biljett och uppdateringar direkt i mobilen.
        </p>
      </div>

      <div className="appNoticeActions">
        <button type="button" className="appNoticePrimary">
          Ladda ner
        </button>

        <button type="button" className="appNoticeClose" onClick={closeNotice}>
          Senare
        </button>
      </div>
    </div>
  );
}
