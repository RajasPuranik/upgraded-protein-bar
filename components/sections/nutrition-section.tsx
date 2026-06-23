"use client";

import { useState } from "react";
import { getNutritionRows, type SizeKey } from "@/lib/products";

const sizes: Array<{ key: SizeKey; label: string }> = [
  { key: "spark", label: "Spark 40g" },
  { key: "power", label: "Power 60g" },
  { key: "beast", label: "Beast 90g" }
];

export function NutritionSection() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>("spark");
  const rows = getNutritionRows(selectedSize);

  return (
    <section className="nutrition section-band" id="nutrition">
      <div className="section-heading">
        <span className="eyebrow">Nutrition facts</span>
        <h2>Transparent macros in every size.</h2>
        <p>No hidden sugars. No soya. Just real fuel with complete whey.</p>
      </div>

      <div className="diabetic-note">
        <strong>Portion note for sugar patients</strong>
        <p>
          FuelBar contains no added refined sugar. Natural sugars come from jaggery,
          dates, and honey, so diabetic customers should consume limited portions and
          consult their healthcare provider.
        </p>
      </div>

      <div className="tab-row" role="tablist" aria-label="Nutrition size tabs">
        {sizes.map((size) => (
          <button
            aria-selected={selectedSize === size.key}
            className={selectedSize === size.key ? "is-active" : ""}
            key={size.key}
            onClick={() => setSelectedSize(size.key)}
            role="tab"
            type="button"
          >
            {size.label}
          </button>
        ))}
      </div>

      <div className="nutrition-table-wrap">
        <table className="nutrition-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Per bar</th>
              <th>DV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td className={row.tone ? `tone-${row.tone}` : ""}>{row.value}</td>
                <td>{row.dailyValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-note">Daily value estimates are based on a 2000 kcal diet.</p>
      </div>
    </section>
  );
}
