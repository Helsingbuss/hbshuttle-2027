"use client";

import { useEffect, useMemo, useState } from "react";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

type TrafficStatus = "normal" | "info" | "delay" | "cancelled";

type TrafficMessage = {
  id: string;
  line: string;
  airport: string;
  title: string;
  message: string;
  status: TrafficStatus;
  validFrom: string;
  validTo?: string;
  updatedAt: string;
};

const filters = [
  "Alla linjer",
  "811 Flygbuss",
  "812 Flygbuss",
  "831 Flygbuss",
];

function statusLabel(status: TrafficStatus) {
  if (status === "normal") return "Normal trafik";
  if (status === "delay") return "Försening";
  if (status === "cancelled") return "Inställd";
  return "Information";
}

function statusClass(status: TrafficStatus) {
  return "trafficBadge " + status;
}

export default function TrafficInfoPage() {
  const [selectedLine, setSelectedLine] = useState("Alla linjer");
  const [messages, setMessages] = useState<TrafficMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadTrafficMessages() {
      try {
        setLoading(true);
        setErrorText("");

        const url =
          "/api/shuttle/traffic-messages" +
          (selectedLine !== "Alla linjer"
            ? "?line=" + encodeURIComponent(selectedLine)
            : "");

        const response = await fetch(url, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Kunde inte hämta trafikmeddelanden.");
        }

        setMessages(Array.isArray(data.messages) ? data.messages : []);
      } catch (error: any) {
        console.error(error);
        setMessages([]);
        setErrorText(error?.message || "Kunde inte hämta trafikmeddelanden.");
      } finally {
        setLoading(false);
      }
    }

    loadTrafficMessages();
  }, [selectedLine]);

  const visibleMessages = useMemo(() => {
    return messages;
  }, [messages]);

  const hasProblems = visibleMessages.some(
    (message) => message.status === "delay" || message.status === "cancelled"
  );

  return (
    <>
      <BetaHeader sticky />

      <main className="trafficPage">
        <section className="trafficHero">
          <p>Helsingbuss Airport Shuttle</p>
          <h1>Trafikinformation</h1>
          <span>
            Här hittar du aktuella trafikmeddelanden, planerade ändringar och viktig information inför din resa.
          </span>
        </section>

        <section className="trafficShell">
          <aside className="trafficPanel">
            <div className="trafficStatusCard">
              <small>Just nu</small>
              <strong>{hasProblems ? "Pågående trafikpåverkan" : "Ingen större trafikpåverkan"}</strong>
              <p>
                Kontrollera alltid din avgång nära inpå resan. Trafikmeddelanden kan uppdateras snabbt.
              </p>
            </div>

            <label className="trafficFilter">
              Visa trafikinfo för
              <select
                value={selectedLine}
                onChange={(event) => setSelectedLine(event.target.value)}
              >
                {filters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </label>

            <div className="trafficQuickLinks">
              <a href="/start/tidtabell">Se tidtabell</a>
              <a href="/start/hallplatser">Se hållplatser</a>
            </div>
          </aside>

          <section className="trafficMessagesCard">
            <div className="trafficMessagesHead">
              <div>
                <small>Aktuella meddelanden</small>
                <h2>{selectedLine}</h2>
              </div>
              <span>{visibleMessages.length} meddelanden</span>
            </div>

            <div className="trafficMessageList">
              {loading ? (
                <article className="trafficEmpty">
                  <strong>Hämtar trafikinfo</strong>
                  <p>Vi hämtar aktuella trafikmeddelanden från systemet.</p>
                </article>
              ) : errorText ? (
                <article className="trafficEmpty">
                  <strong>Kunde inte hämta trafikinfo</strong>
                  <p>{errorText}</p>
                </article>
              ) : visibleMessages.length === 0 ? (
                <article className="trafficEmpty">
                  <strong>Inga trafikmeddelanden</strong>
                  <p>Det finns inga aktuella trafikmeddelanden för vald linje just nu.</p>
                </article>
              ) : (
                visibleMessages.map((message) => (
                  <article className="trafficMessage" key={message.id}>
                    <div className="trafficMessageTop">
                      <span className={statusClass(message.status)}>
                        {statusLabel(message.status)}
                      </span>
                      <small>Uppdaterad {message.updatedAt || "-"}</small>
                    </div>

                    <h3>{message.title}</h3>
                    <p>{message.message}</p>

                    <div className="trafficMeta">
                      <span>{message.line}</span>
                      {message.airport ? <span>{message.airport}</span> : null}
                      <span>
                        Gäller från {message.validFrom || "-"}
                        {message.validTo ? " till " + message.validTo : ""}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

