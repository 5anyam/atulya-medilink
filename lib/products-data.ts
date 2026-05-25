export interface ProductIngredient {
  name: string;
  dose: string;
  benefit: string;
}

export interface StaticProduct {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  regularPrice: number;
  images: string[];
  benefits: string[];
  ingredients: ProductIngredient[];
  howToUse: string;
  category: string;
  type: 'cosmetics' | 'nutraceuticals';
  sizes: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  capsules: number;
}

export const PRODUCTS: StaticProduct[] = [
  // ── COSMETICS ──
  {
    id: 1,
    slug: 'atulya-crack-heel-repair-foot-cream',
    name: 'Crack Heel Repair Foot Cream',
    shortName: 'Heel Repair Cream',
    tagline: 'Deep repair formula for cracked heels — softens, heals & protects in days',
    price: 99,
    regularPrice: 115,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Atulya+Heel+Cream',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Atulya+Heel+Cream',
    ],
    benefits: [
      'Deep moisturising formula repairs cracked heels within days',
      'Urea & shea butter blend softens hardened skin instantly',
      'Anti-bacterial properties prevent infection in cracked skin',
      'Non-greasy texture absorbs quickly without sticky residue',
      'Suitable for all skin types including sensitive skin',
    ],
    ingredients: [
      { name: 'Urea', dose: '10%', benefit: 'Breaks down dead skin cells, deeply hydrates' },
      { name: 'Shea Butter', dose: '5%', benefit: 'Locks in moisture, soothes dry skin' },
      { name: 'Tea Tree Oil', dose: '2%', benefit: 'Anti-bacterial, prevents infection' },
      { name: 'Glycerin', dose: '8%', benefit: 'Humectant, draws moisture to skin' },
    ],
    howToUse:
      'Clean and dry feet thoroughly. Apply a generous amount to heels and cracked areas. Massage in circular motions until absorbed. For best results, use twice daily — morning and before bedtime. Cover with socks at night for intensive repair.',
    sizes: ['50g', '100g'],
    category: 'Foot Care',
    type: 'cosmetics',
    badge: 'Best Seller',
    rating: 4.7,
    reviewCount: 342,
    capsules: 0,
  },
  {
    id: 2,
    slug: 'atulya-winter-cream',
    name: 'Atulya Winter Cream',
    shortName: 'Winter Cream',
    tagline: 'Rich nourishing cream — protects skin from harsh winters & dryness',
    price: 199,
    regularPrice: 199,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Atulya+Winter+Cream',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Winter+Cream',
    ],
    benefits: [
      'Rich emollient formula creates a protective barrier against cold',
      'Almond oil & vitamin E deeply nourish dry winter skin',
      'Instantly relieves tightness and dryness after application',
      'Non-comedogenic — safe for face and body',
      '24-hour moisture lock technology',
    ],
    ingredients: [
      { name: 'Sweet Almond Oil', dose: '8%', benefit: 'Deep nourishment, retains moisture' },
      { name: 'Vitamin E', dose: '2%', benefit: 'Antioxidant protection, skin repair' },
      { name: 'Beeswax', dose: '3%', benefit: 'Creates protective barrier against cold' },
      { name: 'Lanolin', dose: '4%', benefit: 'Intensive moisturiser, skin softener' },
    ],
    howToUse:
      'Apply to clean skin on face and body. Warm a small amount between palms and massage gently in upward circular motions. Use morning and night during winters. Safe for children above 3 years.',
    sizes: ['50g', '100g', '200g'],
    category: 'Moisturizer',
    type: 'cosmetics',
    badge: 'New',
    rating: 4.5,
    reviewCount: 128,
    capsules: 0,
  },
  {
    id: 3,
    slug: 'atulya-vitamin-c-face-serum',
    name: 'Vitamin C Brightening Serum',
    shortName: 'Vitamin C Serum',
    tagline: '15% Vitamin C serum — fades dark spots, brightens & evens skin tone',
    price: 349,
    regularPrice: 449,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Vitamin+C+Serum',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Atulya+Serum',
    ],
    benefits: [
      '15% stable Vitamin C reduces dark spots and pigmentation',
      'Niacinamide evens skin tone and minimises pores',
      'Hyaluronic acid provides deep hydration for plump skin',
      'Lightweight formula absorbs in seconds, no white cast',
      'Dermatologist tested — safe for all skin types',
    ],
    ingredients: [
      { name: 'Vitamin C (Ascorbic Acid)', dose: '15%', benefit: 'Brightens, fades spots, boosts collagen' },
      { name: 'Niacinamide', dose: '5%', benefit: 'Pore minimiser, even skin tone' },
      { name: 'Hyaluronic Acid', dose: '1%', benefit: 'Deep hydration, plumping effect' },
      { name: 'Ferulic Acid', dose: '0.5%', benefit: 'Stabilises Vitamin C, antioxidant' },
    ],
    howToUse:
      'Apply 3-4 drops to clean, dry skin in the morning. Gently pat onto face and neck. Follow with moisturiser and SPF during the day. Avoid contact with eyes. Store in a cool, dark place.',
    sizes: ['15ml', '30ml', '50ml'],
    category: 'Serum',
    type: 'cosmetics',
    badge: 'Trending',
    rating: 4.8,
    reviewCount: 267,
    capsules: 0,
  },
  {
    id: 4,
    slug: 'atulya-gentle-face-wash',
    name: 'Gentle Foaming Face Wash',
    shortName: 'Face Wash',
    tagline: 'pH-balanced face wash — cleanses deeply without stripping natural oils',
    price: 249,
    regularPrice: 249,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Atulya+Face+Wash',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Face+Wash',
    ],
    benefits: [
      'pH 5.5 balanced formula maintains skin\'s natural moisture barrier',
      'Neem & tulsi extracts control acne and blemishes naturally',
      'Sulphate-free — gentle enough for daily twice-daily use',
      'Removes 99% of dirt, oil and pollutants effectively',
      'Suitable for oily, combination and sensitive skin types',
    ],
    ingredients: [
      { name: 'Neem Extract', dose: '3%', benefit: 'Anti-bacterial, controls acne and oil' },
      { name: 'Tulsi Extract', dose: '2%', benefit: 'Purifies skin, anti-inflammatory' },
      { name: 'Aloe Vera', dose: '5%', benefit: 'Soothes and calms irritated skin' },
      { name: 'Glycerin', dose: '6%', benefit: 'Maintains moisture post-cleansing' },
    ],
    howToUse:
      'Wet face with lukewarm water. Take a pea-sized amount and work into a lather. Massage gently on face in circular motions for 60 seconds. Rinse thoroughly. Use twice daily for best results.',
    sizes: ['100ml', '200ml'],
    category: 'Face Wash',
    type: 'cosmetics',
    rating: 4.6,
    reviewCount: 189,
    capsules: 0,
  },
  {
    id: 5,
    slug: 'atulya-nourishing-shampoo',
    name: 'Protein Nourishing Shampoo',
    shortName: 'Nourishing Shampoo',
    tagline: 'Protein-enriched shampoo — strengthens hair, reduces breakage & adds shine',
    price: 299,
    regularPrice: 299,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Atulya+Shampoo',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Nourishing+Shampoo',
    ],
    benefits: [
      'Hydrolysed keratin repairs damaged hair from root to tip',
      'Bhringraj and amla extracts reduce hair fall significantly',
      'Sulphate & paraben-free formula safe for colour-treated hair',
      'Adds natural shine and softness after first wash',
      'Works for all hair types — straight, wavy, curly',
    ],
    ingredients: [
      { name: 'Hydrolysed Keratin', dose: '2%', benefit: 'Repairs and strengthens hair shaft' },
      { name: 'Bhringraj Extract', dose: '4%', benefit: 'Reduces hair fall, promotes growth' },
      { name: 'Amla Extract', dose: '3%', benefit: 'Nourishes scalp, adds lustre' },
      { name: 'Pro-Vitamin B5', dose: '1%', benefit: 'Moisture retention, frizz control' },
    ],
    howToUse:
      'Wet hair thoroughly. Apply shampoo to scalp and massage gently for 2-3 minutes. Work through lengths to ends. Rinse completely with water. Follow with conditioner for best results. Use 3 times a week.',
    sizes: ['200ml', '400ml'],
    category: 'Hair Care',
    type: 'cosmetics',
    rating: 4.5,
    reviewCount: 156,
    capsules: 0,
  },
  {
    id: 6,
    slug: 'atulya-brightening-herbal-soap',
    name: 'Brightening Herbal Soap',
    shortName: 'Herbal Soap',
    tagline: 'Handcrafted herbal soap — cleanses, brightens & nourishes skin naturally',
    price: 149,
    regularPrice: 175,
    images: [
      'https://placehold.co/600x600/fff8f5/ff5f1f?text=Atulya+Soap',
      'https://placehold.co/600x600/fff3ed/e04e10?text=Herbal+Soap',
    ],
    benefits: [
      'Turmeric and saffron extracts naturally brighten dull skin',
      'Cold-process soap retains natural glycerin for extra moisture',
      'No harsh sulphates or synthetic fragrances',
      'Suitable for face and body — gentle daily cleanser',
      'Biodegradable and eco-friendly formulation',
    ],
    ingredients: [
      { name: 'Turmeric Extract', dose: '2%', benefit: 'Anti-inflammatory, natural skin brightener' },
      { name: 'Saffron', dose: '0.5%', benefit: 'Brightens, reduces pigmentation' },
      { name: 'Coconut Oil', dose: '40%', benefit: 'Deep cleansing, anti-bacterial' },
      { name: 'Shea Butter', dose: '5%', benefit: 'Moisturises and softens skin' },
    ],
    howToUse:
      'Wet skin and work soap into a lather. Massage gently on skin. Rinse well. For best results, use daily. Pat skin dry after washing.',
    sizes: ['75g', '150g'],
    category: 'Body Care',
    type: 'cosmetics',
    badge: 'Sale',
    rating: 4.4,
    reviewCount: 98,
    capsules: 0,
  },

  // ── NUTRACEUTICALS ──
  {
    id: 7,
    slug: 'atulya-vitamin-e-400-softgel',
    name: 'Vitamin E 400 Softgel',
    shortName: 'Vitamin E 400',
    tagline: 'High-potency Vitamin E — supports skin health, immunity & antioxidant defence',
    price: 273,
    regularPrice: 390,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Vitamin+E+400',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Atulya+Nutra',
    ],
    benefits: [
      '400 IU natural-source Vitamin E — premium d-alpha tocopherol',
      'Powerful antioxidant protects cells from oxidative damage',
      'Supports healthy skin, hair and nail growth',
      'Boosts immune system function and cardiovascular health',
      'Easy-to-swallow softgel form for better absorption',
    ],
    ingredients: [
      { name: 'Vitamin E (d-alpha tocopherol)', dose: '400 IU', benefit: 'Antioxidant, skin health, immunity' },
      { name: 'Soybean Oil', dose: '500 mg', benefit: 'Carrier oil for optimal absorption' },
    ],
    howToUse:
      'Take 1 softgel daily with a meal or as directed by your physician. Do not exceed recommended dose. Store in a cool, dry place away from direct sunlight.',
    sizes: ['30 Softgels', '60 Softgels', '90 Softgels'],
    category: 'Vitamins',
    type: 'nutraceuticals',
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 412,
    capsules: 30,
  },
  {
    id: 8,
    slug: 'atulya-omega-3-capsules',
    name: 'Omega-3 Fish Oil Capsules',
    shortName: 'Omega-3',
    tagline: 'Pharmaceutical-grade omega-3 — heart, brain & joint health in one capsule',
    price: 860,
    regularPrice: 940,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Omega-3+Capsules',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Atulya+Omega',
    ],
    benefits: [
      '1000mg fish oil per capsule with 300mg EPA + DHA',
      'Reduces triglycerides and supports heart health',
      'Improves brain function, memory and focus',
      'Anti-inflammatory — relieves joint pain and stiffness',
      'Molecularly distilled, mercury-free, odourless capsules',
    ],
    ingredients: [
      { name: 'Fish Oil Concentrate', dose: '1000 mg', benefit: 'Source of EPA and DHA omega-3' },
      { name: 'EPA (Eicosapentaenoic Acid)', dose: '180 mg', benefit: 'Heart health, anti-inflammatory' },
      { name: 'DHA (Docosahexaenoic Acid)', dose: '120 mg', benefit: 'Brain function, cognitive health' },
      { name: 'Vitamin E', dose: '5 IU', benefit: 'Preserves omega-3 freshness' },
    ],
    howToUse:
      'Take 1-2 capsules daily with food. For heart health benefits, take 2 capsules daily. Consult your physician if you are on blood-thinning medications. Store in a cool, dry place.',
    sizes: ['30 Caps', '60 Caps', '90 Caps'],
    category: 'Fatty Acids',
    type: 'nutraceuticals',
    rating: 4.7,
    reviewCount: 284,
    capsules: 60,
  },
  {
    id: 9,
    slug: 'atulya-quick-grow-capsule',
    name: 'Quick Grow Hair Capsule',
    shortName: 'Quick Grow',
    tagline: 'Biotin & keratin formula — accelerates hair growth, reduces hair fall',
    price: 265,
    regularPrice: 340,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Quick+Grow+Capsule',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Hair+Growth',
    ],
    benefits: [
      '10,000 mcg Biotin per capsule — clinically proven for hair growth',
      'Hydrolysed keratin rebuilds hair structure from within',
      'Reduces hair fall by 40% within 90 days of regular use',
      'Improves nail strength and reduces brittleness',
      'Suitable for men and women of all ages',
    ],
    ingredients: [
      { name: 'Biotin (Vitamin B7)', dose: '10,000 mcg', benefit: 'Hair growth, protein metabolism' },
      { name: 'Hydrolysed Keratin', dose: '200 mg', benefit: 'Rebuilds hair fibre, reduces breakage' },
      { name: 'Bamboo Extract (Silica)', dose: '100 mg', benefit: 'Hair strength, nail growth' },
      { name: 'Zinc', dose: '10 mg', benefit: 'Scalp health, sebum regulation' },
    ],
    howToUse:
      'Take 1 capsule daily with breakfast. Consistent daily use for a minimum of 90 days is recommended for visible results. Pair with a protein-rich diet for best outcome.',
    sizes: ['30 Caps', '60 Caps', '90 Caps'],
    category: 'Hair Health',
    type: 'nutraceuticals',
    badge: 'Trending',
    rating: 4.6,
    reviewCount: 198,
    capsules: 60,
  },
  {
    id: 10,
    slug: 'atulya-pen-go-joint-capsule',
    name: 'Pen Go Joint Support Capsule',
    shortName: 'Pen Go',
    tagline: 'Ayurvedic joint formula — relieves knee & back pain, improves mobility',
    price: 400,
    regularPrice: 500,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Pen+Go+Capsule',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Joint+Support',
    ],
    benefits: [
      'Boswellia and Shallaki reduce joint inflammation naturally',
      'Glucosamine and Chondroitin rebuild cartilage over time',
      'Relieves knee, back and joint pain within 2-3 weeks',
      'Improves mobility and flexibility in arthritic conditions',
      'No steroids — 100% ayurvedic and safe for long-term use',
    ],
    ingredients: [
      { name: 'Boswellia Serrata (Shallaki)', dose: '200 mg', benefit: 'Reduces joint inflammation' },
      { name: 'Glucosamine Sulphate', dose: '500 mg', benefit: 'Cartilage repair and protection' },
      { name: 'Chondroitin Sulphate', dose: '200 mg', benefit: 'Improves joint lubrication' },
      { name: 'Ashwagandha Extract', dose: '100 mg', benefit: 'Anti-inflammatory, pain relief' },
    ],
    howToUse:
      'Take 2 capsules daily — 1 with breakfast and 1 with dinner. For severe joint conditions, consult your physician. Minimum 8-week course recommended for best results.',
    sizes: ['30 Caps', '60 Caps', '90 Caps'],
    category: 'Joint Health',
    type: 'nutraceuticals',
    badge: 'Ayurvedic',
    rating: 4.5,
    reviewCount: 321,
    capsules: 60,
  },
  {
    id: 11,
    slug: 'atulya-daily-multivitamin',
    name: 'Daily Multivitamin Tablets',
    shortName: 'Daily Multivitamin',
    tagline: 'Complete daily nutrition — 23 essential vitamins & minerals in one tablet',
    price: 399,
    regularPrice: 499,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Daily+Multivitamin',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Multivitamin',
    ],
    benefits: [
      '23 vitamins and minerals covering full RDA in one tablet',
      'Fills nutritional gaps in modern Indian diet effectively',
      'Supports energy metabolism, brain function and immunity',
      'Iron, B12 and folate support for women\'s health',
      'No artificial colours, preservatives or fillers',
    ],
    ingredients: [
      { name: 'Vitamin C', dose: '80 mg', benefit: 'Immune support, antioxidant' },
      { name: 'Vitamin D3', dose: '1000 IU', benefit: 'Bone health, immunity' },
      { name: 'Vitamin B12', dose: '2.4 mcg', benefit: 'Energy, nervous system health' },
      { name: 'Iron', dose: '14 mg', benefit: 'Prevents anaemia, oxygen transport' },
    ],
    howToUse:
      'Take 1 tablet daily after a meal. Best taken in the morning with breakfast. Do not exceed the recommended dose. Not suitable as a substitute for a balanced diet.',
    sizes: ['30 Tabs', '60 Tabs', '90 Tabs'],
    category: 'Vitamins',
    type: 'nutraceuticals',
    rating: 4.6,
    reviewCount: 156,
    capsules: 30,
  },
  {
    id: 12,
    slug: 'atulya-immunity-booster-capsule',
    name: 'Immunity Booster Capsule',
    shortName: 'Immunity Booster',
    tagline: 'Triple-action immunity — Zinc, Elderberry & Vitamin C for year-round defence',
    price: 549,
    regularPrice: 649,
    images: [
      'https://placehold.co/600x600/f0fdfa/0d9488?text=Immunity+Booster',
      'https://placehold.co/600x600/ccfbf1/0a7a6e?text=Atulya+Immunity',
    ],
    benefits: [
      'Elderberry extract reduces cold & flu severity by 50%',
      'Zinc and Vitamin C triple immune defence mechanism',
      'Adaptogenic herbs reduce stress-related immunity drop',
      'Builds long-term immunity with consistent use',
      'Suitable for adults and children above 12 years',
    ],
    ingredients: [
      { name: 'Elderberry Extract', dose: '300 mg', benefit: 'Anti-viral, immune activation' },
      { name: 'Vitamin C', dose: '500 mg', benefit: 'Immune stimulant, antioxidant' },
      { name: 'Zinc', dose: '15 mg', benefit: 'T-cell function, anti-inflammatory' },
      { name: 'Ashwagandha', dose: '200 mg', benefit: 'Adaptogen, stress immunity support' },
    ],
    howToUse:
      'Take 1 capsule twice daily with meals. During illness or high-stress periods, take 2 capsules twice daily for up to 7 days. Suitable for daily long-term use as a preventive supplement.',
    sizes: ['30 Caps', '60 Caps', '90 Caps'],
    category: 'Immunity',
    type: 'nutraceuticals',
    rating: 4.7,
    reviewCount: 234,
    capsules: 60,
  },
];

export function getProductBySlug(slug: string): StaticProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByType(type: 'cosmetics' | 'nutraceuticals'): StaticProduct[] {
  return PRODUCTS.filter((p) => p.type === type);
}
