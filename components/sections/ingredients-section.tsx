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
      <div className="ingredients__visual" aria-hidden="true">
        <ProductVisual flavorKey="chocolate-hazelnut" sizeKey="beast" />
        <span style={{ left: "6%", top: "12%" }}>Dark chocolate</span>
        <span style={{ right: "4%", top: "18%" }}>Dates</span>
        <span style={{ left: "2%", bottom: "22%" }}>Hazelnut</span>
        <span style={{ right: "8%", bottom: "16%" }}>Honey</span>
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
