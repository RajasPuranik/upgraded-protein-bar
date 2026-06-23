import { Leaf, ShieldCheck, WheatOff } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Zero added refined sugar",
    text: "Sweetness comes from jaggery, dates, and honey."
  },
  {
    icon: Leaf,
    title: "Complete whey protein",
    text: "25% complete whey in every size, without soya fillers."
  },
  {
    icon: WheatOff,
    title: "Cleaner snack choice",
    text: "Portion-aware bars for workouts, college, work, and travel."
  }
];

export function SugarFreeBanner() {
  return (
    <section className="sugar-band">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div className="sugar-band__item" key={item.title}>
            <Icon size={28} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        );
      })}
    </section>
  );
}
