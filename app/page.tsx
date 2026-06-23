import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GenZSection } from "@/components/sections/genz-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IngredientsSection } from "@/components/sections/ingredients-section";
import { NutritionSection } from "@/components/sections/nutrition-section";
import { ProductsSection } from "@/components/sections/products-section";
import { SugarFreeBanner } from "@/components/sections/sugar-free-banner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FuelBar | The Zero Sugar 25% Whey Protein Bar",
  description: "Ditch the sugar. Upgrade to FuelBar. Premium whey protein bars with natural sweeteners and incredible flavors.",
  alternates: {
    canonical: "https://fuelbar.in",
  }
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <SugarFreeBanner />
      <NutritionSection />
      <IngredientsSection />
      <GenZSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
