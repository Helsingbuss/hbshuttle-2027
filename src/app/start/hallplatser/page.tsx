"use client";

import { useMemo, useState } from "react";
import BetaHeader from "@/components/BetaHeader";
import SiteFooter from "@/components/SiteFooter";

type StopItem = {
  name: string;
  city: string;
  time?: string;
  note?: string;
  mapsQuery: string;
};

type RouteItem = {
  id: string;
  label: string;
  from: string;
  to: string;
  status: "active" | "soon";
  stops: StopItem[];
};

const routes: RouteItem[] = [
  {
    id: "811",
    label: "811 Flygbuss",
    from: "Helsingborg C",
    to: "Ängelholms Flygplats",
    status: "active",
    stops: [
      {
        name: "Helsingborg C",
        city: "Helsingborg",
        time: "08:40",
        note: "Central hållplats med anslutning till tåg och buss.",
        mapsQuery: "Helsingborg C",
      },
      {
        name: "Helsingborg Stattena",
        city: "Helsingborg",
        time: "08:46",
        note: "Smidig hållplats för norra Helsingborg.",
        mapsQuery: "Helsingborg Stattena",
      },
      {
        name: "Ängelholm Station",
        city: "Ängelholm",
        time: "09:08",
        note: "Anslutning vid stationen i Ängelholm.",
        mapsQuery: "Ängelholm Station",
      },
      {
        name: "Ängelholms Flygplats",
        city: "Ängelholm",
        time: "09:20",
        note: "Avstigning vid flygplatsen.",
        mapsQuery: "Ängelholms Flygplats",
      },
    ],
  },
  {
    id: "812",
    label: "812 Flygbuss",
    from: "Båstad",
    to: "Ängelholms Flygplats",
    status: "soon",
    stops: [
      {
        name: "Båstad",
        city: "Båstad",
        note: "Hållplatser för linje 812 läggs in inför trafikstart.",
        mapsQuery: "Båstad",
      },
      {
        name: "Ängelholms Flygplats",
        city: "Ängelholm",
        note: "Flygplatsläge för linje 812.",
        mapsQuery: "Ängelholms Flygplats",
      },
    ],
  },
  {
    id: "831",
    label: "831 Flygbuss",
    from: "Helsingborg",
    to: "Malmö Airport",
    status: "soon",
    stops: [
      {
        name: "Helsingborg C",
        city: "Helsingborg",
        note: "Hållplatser för linje 831 läggs in inför trafikstart.",
        mapsQuery: "Helsingborg C",
      },
      {
        name: "Malmö Airport",
        city: "Svedala",
        note: "Flygplatsläge för linje 831.",
        mapsQuery: "Malmö Airport",
      },
    ],
  },
];

function reverseRoute(route: RouteItem): RouteItem {
  return {
    ...route,
    from: route.to,
    to: route.from,
    stops: [...route.stops].reverse(),
  };
}

export default function StopsPage() {
  const [selectedRouteId, setSelectedRouteId] = useState("811");
  const [reversed, setReversed] = useState(false);
  const [selectedStopName, setSelectedStopName] = useState("Helsingborg C");

  const baseRoute = routes.find((route) => route.id === selectedRouteId) || routes[0];

  const route = useMemo(() => {
    return reversed ? reverseRoute(baseRoute) : baseRoute;
  }, [baseRoute, reversed]);

  const selectedStop =
    route.stops.find((stop) => stop.name === selectedStopName) || route.stops[0];

  const mapQuery = encodeURIComponent(selectedStop?.mapsQuery || route.to);
  const mapEmbedUrl = "https://maps.google.com/maps?q=" + mapQuery + "&z=15&output=embed";

  function changeRoute(routeId: string) {
    const nextRoute = routes.find((item) => item.id === routeId) || routes[0];
    setSelectedRouteId(routeId);
    setReversed(false);
    setSelectedStopName(nextRoute.stops[0]?.name || "");
  }

  function toggleDirection() {
    const nextRoute = reversed ? baseRoute : reverseRoute(baseRoute);
    setReversed((current) => !current);
    setSelectedStopName(nextRoute.stops[0]?.name || "");
  }

  return (
    <>
      <BetaHeader sticky />

      <main className="stopsPage">
        <section className="stopsHero">
          <div>
            <p>Helsingbuss Airport Shuttle</p>
            <h1>Våra hållplatser</h1>
            <span>
              Välj linje och riktning för att se hållplatser, restid och kartläge.
            </span>
          </div>
        </section>

        <section className="stopsShell">
          <aside className="stopsPanel">
            <label className="stopsSelectLabel">
              Visa hållplatser för
              <select
                value={selectedRouteId}
                onChange={(event) => changeRoute(event.target.value)}
              >
                {routes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} - {item.from} till {item.to}
                  </option>
                ))}
              </select>
            </label>

            <div className="stopsRouteCard">
              <div>
                <small>Din resväg</small>
                <strong>
                  {route.from} till {route.to}
                </strong>
              </div>

              <button type="button" onClick={toggleDirection}>
                Ändra riktning
              </button>
            </div>

            {baseRoute.status === "soon" ? (
              <div className="stopsNotice">
                Denna linje är under planering. Hållplatser och tider kan ändras.
              </div>
            ) : null}

            <ol className="stopsTimeline">
              {route.stops.map((stop, index) => (
                <li
                  key={stop.name}
                  className={stop.name === selectedStop.name ? "active" : ""}
                >
                  <button type="button" onClick={() => setSelectedStopName(stop.name)}>
                    <span className="stopsDot" />
                    <div>
                      <strong>{stop.name}</strong>
                      <small>
                        {stop.city}
                        {stop.time ? " · " + stop.time : ""}
                      </small>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          <section className="stopsMapCard">
            <div className="stopsMapTop">
              <div>
                <small>Vald hållplats</small>
                <h2>{selectedStop.name}</h2>
                <p>{selectedStop.note || "Mer hållplatsinformation kommer här."}</p>
              </div>

              <a
                href={"https://www.google.com/maps/search/?api=1&query=" + mapQuery}
                target="_blank"
                rel="noreferrer"
              >
                Visa i Google Maps
              </a>
            </div>

            <div className="stopsMapReal">
              <iframe
                title={"Karta for " + selectedStop.name}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
