import { CalendarCheck, MessageCircle, PackageCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Pan-India delivery",
    text: "Ship FuelBar to metros, college towns, and tier-2 cities across India."
  },
  {
    icon: PackageCheck,
    title: "Free delivery above Rs. 500",
    text: "Build a mixed box and cross the free delivery threshold easily."
  },
  {
    icon: CalendarCheck,
    title: "30-day shelf life",
    text: "Freshly made bars with enough room to stock up for the month."
  },
  {
    icon: MessageCircle,
    title: "WhatsApp checkout",
    text: "The cart builds a full order message with items, total, and address."
  }
];

export function FeaturesSection() {
  return (
    <section className="features section-band" id="delivery">
      <div className="section-heading">
        <span className="eyebrow">Why FuelBar</span>
        <h2>Designed for repeat snack runs.</h2>
      </div>
      <div className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article className="feature-card" key={feature.title}>
              <Icon size={28} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
