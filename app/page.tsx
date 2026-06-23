import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GenZSection } from "@/components/sections/genz-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IngredientsSection } from "@/components/sections/ingredients-section";
import { NutritionSection } from "@/components/sections/nutrition-section";
import { ProductsSection } from "@/components/sections/products-section";
import { SugarFreeBanner } from "@/components/sections/sugar-free-banner";

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
