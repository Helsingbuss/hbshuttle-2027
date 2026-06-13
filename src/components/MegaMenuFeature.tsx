import Link from "next/link";

type MegaMenuFeatureProps = {
  title?: string;
  text?: string;
  image?: string;
  label?: string;
  href?: string;
};

export default function MegaMenuFeature({
  title = "Din smidiga resa till flygplatsen",
  text = "Med Helsingbuss Airport Shuttle reser du tryggt, enkelt och bekvämt till och från flygplatsen. Här hittar du biljetter, tidtabeller och hållplatser samlade på ett och samma ställe.",
  image = "/images/hbshuttle-menu.jpg",
  label = "Läs mer",
  href = "/start",
}: MegaMenuFeatureProps) {
  return (
    <section className="megaFeature">
      <div
        className="megaImage"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.34)), url("${image}")`,
        }}
      >
        <div className="megaBusGlow" />
        <span>Helsingbuss Airport Shuttle</span>
      </div>

      <h2>{title}</h2>

      <p>{text}</p>

      <Link href={href} className="megaReadMore">
        {label} <span>→</span>
      </Link>
    </section>
  );
}

