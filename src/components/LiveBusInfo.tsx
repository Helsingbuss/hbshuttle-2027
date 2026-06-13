"use client";

import Link from "next/link";

function MapIllustration() {
  return (
    <div className="liveMap">
      <svg viewBox="0 0 420 250" fill="none" className="liveMapSvg">
        <path d="M0 72C62 54 108 60 165 88C222 116 264 120 326 90C370 68 397 64 420 66V250H0V72Z" className="mapArea mapAreaOne" />
        <path d="M0 0H420V250H0V0Z" className="mapBase" />
        <path d="M40 46h86M20 118h96M260 36h118M238 188h132M86 204h96" className="mapRoadSoft" />
        <path d="M62 210C92 188 113 172 129 146C151 111 185 110 214 126C246 144 271 132 292 106C312 82 328 69 362 58" className="mapRoute" />
        <circle cx="62" cy="210" r="13" className="mapPoint" />
        <circle cx="362" cy="58" r="13" className="mapPoint" />

        <g className="mapBusPin" transform="translate(210 82)">
          <circle cx="0" cy="0" r="34" />
          <path d="M-13-14h26a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6h-26a6 6 0 0 1-6-6V-8a6 6 0 0 1 6-6Z" />
          <path d="M-13-3h26" />
          <path d="M-10 8h3" />
          <path d="M7 8h3" />
          <path d="M-10 16v5" />
          <path d="M10 16v5" />
        </g>
      </svg>
    </div>
  );
}

const features = [
  {
    title: "Live-position",
    icon: "pin",
  },
  {
    title: "Trafikläget just nu",
    icon: "traffic",
  },
  {
    title: "Planerade avvikelser",
    icon: "alert",
  },
];

function FeatureIcon({ icon }: { icon: string }) {
  if (icon === "traffic") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M8 3h8l2 5v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8l2-5Z" />
        <path d="M8 8h8" />
        <path d="M9 13h.01" />
        <path d="M15 13h.01" />
      </svg>
    );
  }

  if (icon === "alert") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3 2.8 19h18.4L12 3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

export default function LiveBusInfo() {
  return (
    <article className="travelInfoCard liveBusInfo">
      <h2>Var är bussen?</h2>

      <div className="liveBusContent">
        <MapIllustration />

        <div className="liveBusText">
          <p>
            Följ din buss i realtid och få uppdateringar om trafik och
            eventuella avvikelser.
          </p>

          <ul>
            {features.map((item) => (
              <li key={item.title}>
                <span>
                  <FeatureIcon icon={item.icon} />
                </span>
                {item.title}
              </li>
            ))}
          </ul>

          <Link href="/start/trafikinfo" className="travelInfoButton">
            Se trafikinfo
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
