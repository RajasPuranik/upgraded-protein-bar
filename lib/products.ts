export type FlavorKey = "chocolate-hazelnut" | "dates-delight";
export type SizeKey = "spark" | "power" | "beast";

export type Product = {
  id: string;
  active: boolean;
  sortOrder: number;
  flavorKey: FlavorKey;
  flavorName: string;
  sizeKey: SizeKey;
  sizeName: string;
  weightGrams: number;
  price: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  naturalSugarsGrams: number;
  addedSugarGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  badge?: string;
  description: string;
  ingredients: string[];
};

export type NutritionRow = {
  label: string;
  value: string;
  dailyValue: string;
  tone?: "highlight" | "green";
};

export const flavorOptions: Array<{ key: FlavorKey; label: string; note: string }> = [
  {
    key: "chocolate-hazelnut",
    label: "Chocolate Hazelnut",
    note: "Dark chocolate, roasted hazelnut, jaggery, honey"
  },
  {
    key: "dates-delight",
    label: "Dates Delight",
    note: "Premium dates, dry fruits, raw honey"
  }
];

const sizeMeta: Record<
  SizeKey,
  {
    sizeName: string;
    weightGrams: number;
    basePrice: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    naturalSugarsGrams: number;
    fatGrams: number;
    fiberGrams: number;
    sodiumMg: number;
  }
> = {
  spark: {
    sizeName: "Spark Bar",
    weightGrams: 40,
    basePrice: 60,
    calories: 150,
    proteinGrams: 10,
    carbsGrams: 16,
    naturalSugarsGrams: 8,
    fatGrams: 5,
    fiberGrams: 2,
    sodiumMg: 40
  },
  power: {
    sizeName: "Power Bar",
    weightGrams: 60,
    basePrice: 90,
    calories: 220,
    proteinGrams: 15,
    carbsGrams: 24,
    naturalSugarsGrams: 12,
    fatGrams: 7.5,
    fiberGrams: 3,
    sodiumMg: 60
  },
  beast: {
    sizeName: "Beast Bar",
    weightGrams: 90,
    basePrice: 120,
    calories: 280,
    proteinGrams: 22.5,
    carbsGrams: 36,
    naturalSugarsGrams: 18,
    fatGrams: 11,
    fiberGrams: 4.5,
    sodiumMg: 90
  }
};

const flavorMeta: Record<
  FlavorKey,
  {
    flavorName: string;
    priceOffset: number;
    description: string;
    ingredients: string[];
  }
> = {
  "chocolate-hazelnut": {
    flavorName: "Chocolate Hazelnut",
    priceOffset: 0,
    description: "Dark chocolate, roasted hazelnut, complete whey, and natural sweetness.",
    ingredients: ["Dark chocolate", "Roasted hazelnut", "Complete whey", "Jaggery", "Raw honey"]
  },
  "dates-delight": {
    flavorName: "Dates Delight",
    priceOffset: 5,
    description: "Premium dates, dry fruits, complete whey, and smooth natural sweetness.",
    ingredients: ["Premium dates", "Dry fruits", "Complete whey", "Jaggery", "Raw honey"]
  }
};

export const products: Product[] = (Object.keys(flavorMeta) as FlavorKey[]).flatMap(
  (flavorKey, flavorIndex) =>
    (Object.keys(sizeMeta) as SizeKey[]).map((sizeKey, sizeIndex) => {
      const flavor = flavorMeta[flavorKey];
      const size = sizeMeta[sizeKey];

      return {
        id: `${flavorKey}-${sizeKey}`,
        active: true,
        sortOrder: flavorIndex * 10 + sizeIndex,
        flavorKey,
        flavorName: flavor.flavorName,
        sizeKey,
        sizeName: size.sizeName,
        weightGrams: size.weightGrams,
        price: size.basePrice + flavor.priceOffset,
        calories: flavorKey === "dates-delight" ? size.calories - 5 : size.calories,
        proteinGrams: size.proteinGrams,
        carbsGrams: size.carbsGrams,
        naturalSugarsGrams: size.naturalSugarsGrams,
        addedSugarGrams: 0,
        fatGrams: size.fatGrams,
        fiberGrams: size.fiberGrams,
        sodiumMg: size.sodiumMg,
        badge: sizeKey === "power" ? "Best Seller" : flavorKey === "dates-delight" ? "New" : undefined,
        description: flavor.description,
        ingredients: flavor.ingredients
      };
    })
);

export const firestoreProductSeed = products.map((product) => ({
  ...product,
  updatedAt: new Date("2026-06-23T00:00:00.000Z").toISOString()
}));

export function getProductsByFlavor(flavorKey: FlavorKey, source = products) {
  return source
    .filter((product) => product.active && product.flavorKey === flavorKey)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getNutritionRows(sizeKey: SizeKey): NutritionRow[] {
  const size = sizeMeta[sizeKey];

  return [
    { label: "Energy", value: `${size.calories} kcal`, dailyValue: `${Math.round(size.calories / 20)}%`, tone: "highlight" },
    { label: "Protein (whey)", value: `${size.proteinGrams}g (25%)`, dailyValue: `${Math.round(size.proteinGrams * 2)}%`, tone: "green" },
    { label: "Total carbohydrates", value: `${size.carbsGrams}g`, dailyValue: `${Math.round(size.carbsGrams / 2.7)}%` },
    { label: "Natural sugars", value: `${size.naturalSugarsGrams}g`, dailyValue: "-" },
    { label: "Added refined sugar", value: "0g", dailyValue: "0%", tone: "green" },
    { label: "Total fat", value: `${size.fatGrams}g`, dailyValue: `${Math.round(size.fatGrams * 1.25)}%` },
    { label: "Dietary fiber", value: `${size.fiberGrams}g`, dailyValue: `${Math.round(size.fiberGrams * 3.5)}%` },
    { label: "Sodium", value: `${size.sodiumMg}mg`, dailyValue: `${Math.round(size.sodiumMg / 20)}%` },
    { label: "Soya content", value: "0g (soya-free)", dailyValue: "-", tone: "green" }
  ];
}
