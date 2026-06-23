import Image from "next/image";
import { ArrowDown, ShieldCheck, Sparkles, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero section-band" id="top">
      <div className="hero__content">
        <span className="eyebrow">25% complete whey protein</span>
        <h1>
          FuelBar for clean cravings and real protein.
        </h1>
        <p>
          Handcrafted protein bars made with complete whey, natural sweeteners,
          zero added refined sugar, and no soya fillers.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#products">
            Shop bars
            <ArrowDown size={18} />
          </a>
          <a className="button button--ghost" href="#nutrition">
            Nutrition facts
          </a>
        </div>
        <div className="hero__badges" aria-label="FuelBar highlights">
          <span>
            <ShieldCheck size={17} />
            Zero added refined sugar
          </span>
          <span>
            <Sparkles size={17} />
            Jaggery, dates, honey
          </span>
          <span>
            <Truck size={17} />
            Pan-India delivery
          </span>
        </div>
      </div>
      <div className="hero__media" aria-label="FuelBar protein bar product visual">
        <Image
          alt="FuelBar protein bars with chocolate, hazelnut, dates, and whey ingredients"
          className="hero__image"
          height={900}
          priority
          src="/fuelbar-product-hero.png"
          width={1200}
        />
      </div>
      <div className="stats-strip" aria-label="FuelBar quick stats">
        <div>
          <strong>10g-22.5g</strong>
          <span>Whey protein</span>
        </div>
        <div>
          <strong>0g</strong>
          <span>Added sugar</span>
        </div>
        <div>
          <strong>3 sizes</strong>
          <span>40g / 60g / 90g</span>
        </div>
        <div>
          <strong>Rs. 500+</strong>
          <span>Free delivery</span>
        </div>
      </div>
    </section>
  );
}
