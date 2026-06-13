"use client";

import Link from "next/link";

const lines = [
  {
    line: "101",
    route: "Helsingborg – Ängelholm",
    frequency: "Var 20:e min",
    next: "08:40",
  },
  {
    line: "102",
    route: "Helsingborg – Malmö Airport",
    frequency: "Var 30:e min",
    next: "08:45",
  },
  {
    line: "103",
    route: "Båstad – Ängelholm",
    frequency: "Var 60:e min",
    next: "09:00",
  },
  {
    line: "104",
    route: "Helsingborg – Copenhagen Airport",
    frequency: "Flera avgångar",
    next: "09:15",
  },
];

export default function TimetableOverview() {
  return (
    <article className="travelInfoCard timetableOverview">
      <h2>Tidtabell & linjeöversikt</h2>

      <div className="timetableTable">
        <div className="timetableHeader">
          <span>Linje</span>
          <span>Sträcka</span>
          <span>Frekvens</span>
          <span>Nästa avgång</span>
        </div>

        {lines.map((item) => (
          <div className="timetableRow" key={item.line}>
            <strong>{item.line}</strong>
            <span>{item.route}</span>
            <span>{item.frequency}</span>
            <strong>{item.next}</strong>
          </div>
        ))}
      </div>

      <Link href="/start/tidtabell" className="travelInfoButton">
        Se alla tider
        <span>→</span>
      </Link>
    </article>
  );
}
