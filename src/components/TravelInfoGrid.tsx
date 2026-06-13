"use client";

import TimetableOverview from "@/components/TimetableOverview";
import LiveBusInfo from "@/components/LiveBusInfo";

export default function TravelInfoGrid() {
  return (
    <section className="travelInfoGrid">
      <TimetableOverview />
      <LiveBusInfo />
    </section>
  );
}
