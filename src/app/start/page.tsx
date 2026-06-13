"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BetaHeader from "@/components/BetaHeader";
import SeasonHero from "@/components/SeasonHero";
import BookingSearch from "@/components/BookingSearch";

export default function StartPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const hasAccess = localStorage.getItem("hbshuttle_beta_access") === "true";

    if (!hasAccess) {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return (
    <>
      <BetaHeader />
      <main className="startPage">
        <SeasonHero />
        <BookingSearch />
      </main>
    </>
  );
}

