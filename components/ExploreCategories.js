import Link from "next/link";
import Carousel from "./Carousel";
import Visual from "./Visual";
import { EXPLORE } from "@/data/site";

export default function ExploreCategories({
  items = EXPLORE,
  title = "Explore other Categories",
  variant = "",
}) {
  return (
    <section className={`explore ${variant ? `explore--${variant}` : ""}`}>
      <div className="container">
        <h2 className="explore__title">{title}</h2>
        <Carousel label="Other categories">
          {items.map((c) => (
            <Link key={c.label} href={c.href} className="xcard">
              <Visual className="xcard__img" src={c.image} alt={c.label} />
              <strong>{c.label}</strong>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
