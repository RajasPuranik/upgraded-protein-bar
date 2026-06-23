export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-zero-added-sugar",
    title: "Why Zero Added Sugar is the Future of Protein Bars",
    date: "2024-05-12",
    excerpt: "The hidden truth about sugar in your 'healthy' protein snacks and why we decided to ditch it completely.",
    author: "FuelBar Team",
    content: `
      <h2>The Hidden Sugar Trap</h2>
      <p>Most commercial protein bars are glorified candy bars. They might boast 20g of protein, but if you flip the wrapper over, you'll often find 15g to 25g of added refined sugars. This causes a massive insulin spike, followed by a crash that leaves you hungrier than before.</p>
      
      <h2>Our Approach</h2>
      <p>At FuelBar, we believe in real nutrition. We use <strong>zero added refined sugar</strong>. Instead, our sweetness comes naturally from ingredients like dates and a carefully balanced touch of natural sweeteners that don't spike your blood glucose.</p>
      
      <h2>The Benefits</h2>
      <ul>
        <li>Sustained energy without the crash</li>
        <li>Better gut health</li>
        <li>True muscle recovery</li>
      </ul>
      <p>Next time you grab a snack, read the label. Your body will thank you.</p>
    `
  },
  {
    slug: "whey-vs-plant-protein",
    title: "Whey vs Plant Protein: Which is Better for Recovery?",
    date: "2024-05-20",
    excerpt: "A deep dive into amino acid profiles and why we chose 25% complete whey for FuelBar.",
    author: "FuelBar Science",
    content: `
      <h2>The Amino Acid Argument</h2>
      <p>Not all proteins are created equal. When it comes to muscle protein synthesis (building and repairing muscle), the amino acid profile is king. Specifically, Leucine is the trigger.</p>
      
      <h2>Why We Chose Whey</h2>
      <p>Whey protein is a "complete" protein, meaning it contains all nine essential amino acids in high concentrations. Plant proteins often lack one or more essential amino acids, requiring complex blending to achieve the same result.</p>
      
      <p>We packed FuelBar with 25% premium whey isolate and concentrate to ensure your muscles get exactly what they need, the moment they need it.</p>
    `
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
