import { BatteryCharging, Dumbbell, GraduationCap, Laptop } from "lucide-react";

const moments = [
  { icon: GraduationCap, label: "College gap", value: "No crash" },
  { icon: Laptop, label: "Work grind", value: "Desk fuel" },
  { icon: Dumbbell, label: "Workout bag", value: "Whey ready" },
  { icon: BatteryCharging, label: "Travel snack", value: "Pocketable" }
];

export function GenZSection() {
  return (
    <section className="genz section-band" id="genz">
      <div className="genz__copy">
        <span className="eyebrow">Built for Gen Z</span>
        <h2>Snack smart without making it boring.</h2>
        <p>
          FuelBar is for the hours between meals: quick protein, natural sweetness,
          and enough indulgence to feel like a treat.
        </p>
      </div>
      <div className="moment-grid">
        {moments.map((moment) => {
          const Icon = moment.icon;

          return (
            <div className="moment-card" key={moment.label}>
              <Icon size={26} />
              <span>{moment.label}</span>
              <strong>{moment.value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
