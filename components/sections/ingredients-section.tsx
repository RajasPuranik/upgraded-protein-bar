import { CheckCircle2 } from "lucide-react";
import { ProductVisual } from "@/components/sections/product-visual";

const ingredients = [
  "Dark chocolate",
  "Roasted hazelnut",
  "Premium dates",
  "Dry fruits",
  "Complete whey",
  "Jaggery",
  "Raw honey",
  "No soya"
];

export function IngredientsSection() {
  return (
    <section className="ingredients section-band" id="ingredients">
      <div className="ingredients__visual" aria-hidden="true" style={{ position: 'relative' }}>
        <img 
          src="/fuelbar-product-hero.png" 
          alt="FuelBar Ingredients" 
          style={{ width: '80%', height: '80%', objectFit: 'contain', zIndex: 1 }} 
        />
        <span style={{ left: "15%", top: "20%", zIndex: 2 }}>Dark chocolate</span>
        <span style={{ right: "15%", top: "25%", zIndex: 2 }}>Dates</span>
        <span style={{ left: "15%", bottom: "20%", zIndex: 2 }}>Hazelnut</span>
        <span style={{ right: "15%", bottom: "25%", zIndex: 2 }}>Honey</span>
      </div>
      <div className="ingredients__copy">
        <span className="eyebrow">Ingredients</span>
        <h2>Real food energy. Zero compromise.</h2>
        <p>
          FuelBar keeps the ingredient list tight: complete whey for protein, nuts
          and dates for texture, and natural sweeteners for taste without refined sugar.
        </p>
        <div className="ingredient-list">
          {ingredients.map((ingredient) => (
            <span key={ingredient}>
              <CheckCircle2 size={16} />
              {ingredient}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
