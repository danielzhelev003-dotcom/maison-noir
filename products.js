// Product catalogue and drawings, shared by every page.
// Colours are passed to the drawings as CSS variables (--frame, --lens, --body, --band, --metal).

const MN_SVG = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="g-amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1d12"/><stop offset="1" stop-color="#8a5a32"/></linearGradient>
    <linearGradient id="g-smoke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111"/><stop offset="1" stop-color="#3a3a3a"/></linearGradient>
    <linearGradient id="g-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2219"/><stop offset="1" stop-color="#53684a"/></linearGradient>
    <linearGradient id="g-rose" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1820"/><stop offset="1" stop-color="#b5606f"/></linearGradient>
    <linearGradient id="g-mirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".45" stop-color="#8d96a3"/><stop offset=".55" stop-color="#cfd5dc"/><stop offset="1" stop-color="#5f6670"/></linearGradient>
    <linearGradient id="g-tortoise" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a170b"/><stop offset=".3" stop-color="#7a4a22"/><stop offset=".55" stop-color="#3b2210"/><stop offset=".8" stop-color="#a0682f"/><stop offset="1" stop-color="#2a170b"/></linearGradient>
  </defs>

  <symbol id="p-round" viewBox="0 0 200 200">
    <path d="M90 96 Q100 88 110 96" fill="none" style="stroke:var(--frame,#111)" stroke-width="4"/>
    <circle cx="64" cy="100" r="28" style="fill:var(--lens,url(#g-amber));stroke:var(--frame,#111)" stroke-width="5"/>
    <circle cx="136" cy="100" r="28" style="fill:var(--lens,url(#g-amber));stroke:var(--frame,#111)" stroke-width="5"/>
    <path d="M36 94 L20 90 M164 94 L180 90" style="stroke:var(--frame,#111)" stroke-width="4" stroke-linecap="round"/>
    <path d="M48 90 Q54 82 64 81 M120 90 Q126 82 136 81" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
  </symbol>

  <symbol id="p-square" viewBox="0 0 200 200">
    <rect x="22" y="78" width="70" height="50" rx="10" style="fill:var(--lens,url(#g-smoke));stroke:var(--frame,#111)" stroke-width="5"/>
    <rect x="108" y="78" width="70" height="50" rx="10" style="fill:var(--lens,url(#g-smoke));stroke:var(--frame,#111)" stroke-width="5"/>
    <path d="M92 90 Q100 84 108 90" fill="none" style="stroke:var(--frame,#111)" stroke-width="6"/>
    <path d="M22 86 L12 84 M178 86 L188 84" style="stroke:var(--frame,#111)" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 88 H54 M118 88 H140" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
  </symbol>

  <symbol id="p-cat" viewBox="0 0 200 200">
    <path d="M14 82 Q40 80 90 88 Q94 120 66 124 Q30 126 24 100 Z" style="fill:var(--lens,url(#g-smoke));stroke:var(--frame,#111)" stroke-width="5" stroke-linejoin="round"/>
    <path d="M186 82 Q160 80 110 88 Q106 120 134 124 Q170 126 176 100 Z" style="fill:var(--lens,url(#g-smoke));stroke:var(--frame,#111)" stroke-width="5" stroke-linejoin="round"/>
    <path d="M90 92 Q100 86 110 92" fill="none" style="stroke:var(--frame,#111)" stroke-width="5"/>
    <path d="M34 92 H60 M140 92 H166" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
  </symbol>

  <symbol id="p-aviator" viewBox="0 0 200 200">
    <path d="M24 84 H90 Q96 84 94 96 Q88 132 58 130 Q28 128 24 100 Z" style="fill:var(--lens,url(#g-amber));stroke:var(--frame,#9a9a9a)" stroke-width="3"/>
    <path d="M176 84 H110 Q104 84 106 96 Q112 132 142 130 Q172 128 176 100 Z" style="fill:var(--lens,url(#g-amber));stroke:var(--frame,#9a9a9a)" stroke-width="3"/>
    <path d="M90 84 H110 M88 94 Q100 90 112 94 M24 88 L10 86 M176 88 L190 86" fill="none" style="stroke:var(--frame,#9a9a9a)" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 94 H60 M122 94 H146" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>
  </symbol>

  <symbol id="p-bucket" viewBox="0 0 200 200">
    <path d="M62 120 L70 64 Q100 56 130 64 L138 120 Z" style="fill:var(--body,#1a1a1a)"/>
    <path d="M38 138 L62 112 H138 L162 138 Q100 150 38 138 Z" style="fill:var(--body,#1a1a1a)"/>
    <path d="M38 138 L62 112 H138 L162 138 Q100 150 38 138 Z" fill="#000" fill-opacity=".14"/>
    <path d="M66 100 H134 M50 130 Q100 138 150 130" fill="none" style="stroke:var(--band,#444)" stroke-width="2" stroke-dasharray="4 4"/>
  </symbol>

  <symbol id="p-fedora" viewBox="0 0 200 200">
    <ellipse cx="100" cy="128" rx="84" ry="15" style="fill:var(--body,#1c1c1c)"/>
    <ellipse cx="100" cy="128" rx="84" ry="15" fill="#000" fill-opacity=".18"/>
    <path d="M56 126 Q52 78 78 70 Q100 80 122 70 Q148 78 144 126 Z" style="fill:var(--body,#1c1c1c)"/>
    <path d="M57 112 Q100 120 143 112 L144 122 Q100 130 56 122 Z" style="fill:var(--band,#c9b79c)"/>
  </symbol>

  <symbol id="p-cap" viewBox="0 0 200 200">
    <path d="M44 122 Q44 66 100 64 Q150 66 152 122 Z" style="fill:var(--body,#111)"/>
    <path d="M44 122 Q100 116 152 122 Q176 124 182 136 Q140 140 44 130 Z" style="fill:var(--body,#111)"/>
    <path d="M44 122 Q100 116 152 122 Q176 124 182 136 Q140 140 44 130 Z" fill="#000" fill-opacity=".2"/>
    <circle cx="98" cy="66" r="5" style="fill:var(--body,#111)"/>
    <text x="98" y="104" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" letter-spacing="2" style="fill:var(--band,#fff)">MN</text>
  </symbol>

  <symbol id="p-chain" viewBox="0 0 200 200">
    <path d="M40 60 Q100 170 160 60" fill="none" style="stroke:var(--metal,#b49a6a)" stroke-width="3" stroke-dasharray="6 3"/>
    <circle cx="40" cy="56" r="7" fill="none" style="stroke:var(--metal,#b49a6a)" stroke-width="3"/>
    <circle cx="160" cy="56" r="7" fill="none" style="stroke:var(--metal,#b49a6a)" stroke-width="3"/>
    <circle cx="100" cy="117" r="5" style="fill:var(--metal,#b49a6a)"/>
  </symbol>
</svg>`;

const CATEGORY_LABEL = { sunglasses: 'Sunglasses', hats: 'Hats', accessories: 'Accessories' };

const HAT_SIZES = [
  { size: 'S',  range: '54–55 cm', max: 55.5 },
  { size: 'M',  range: '56–57 cm', max: 57.5 },
  { size: 'L',  range: '58–59 cm', max: 59.5 },
  { size: 'XL', range: '60–61 cm', max: Infinity }
];

// How each material is made (a real sequence, so the steps are numbered on the page)
const MADE = {
  acetate: {
    care: 'Clean with the microfibre pouch and lukewarm water. Keep out of hot cars, as acetate can soften above 60 °C. Free adjustment at any stockist.',
    steps: [
      ['Cut', 'Fronts and temples are milled from 6 mm blocks of Italian acetate.'],
      ['Tumble', 'Three days in wooden drums with ceramic pebbles to round every edge.'],
      ['Polish', 'Hand-polished on a cotton wheel until the surface is smooth as glass.'],
      ['Fit', 'Lenses are fitted and each pair is aligned and checked by hand.']
    ]
  },
  metal: {
    care: 'Wipe the frame with a dry cloth. Rinse lenses with water before wiping to avoid scratches. The nose pads can be adjusted for a closer fit.',
    steps: [
      ['Form', 'Titanium wire is bent around a steel template for the double bridge.'],
      ['Solder', 'Bridge, rims and hinges are joined in a single heat cycle.'],
      ['Finish', 'The frame is brushed and coated in brushed silver or gold.'],
      ['Fit', 'Lenses are fitted and the nose pads set by hand.']
    ]
  },
  felt: {
    care: 'Brush with a soft brush in the direction of the felt. Hold it by the brim, not the crown. If it gets wet, let it dry on its crown away from heat.',
    steps: [
      ['Block', 'Steamed wool felt is stretched over a wooden hat block.'],
      ['Dry', 'The felt sets on the block for 24 hours.'],
      ['Shape', 'The brim is cut to width and steamed into its curve by hand.'],
      ['Finish', 'The band and grosgrain sweatband are stitched in.']
    ]
  },
  cotton: {
    care: 'Spot clean with cold water and mild soap. Reshape while damp and air dry. Do not tumble dry.',
    steps: [
      ['Cut', 'Panels are cut from heavy washed cotton twill.'],
      ['Sew', 'Panels are joined and topstitched with contrast thread.'],
      ['Wash', 'Each piece is garment-washed for a soft, worn-in hand.'],
      ['Finish', 'The MN mark is embroidered and the label sewn in.']
    ]
  },
  chain: {
    care: 'Store in its pouch, away from perfume and water. Polish with a soft cloth when it loses its shine.',
    steps: [
      ['Link', 'Brass links are cut and joined one at a time.'],
      ['Plate', 'The chain is plated in 18k gold or rhodium.'],
      ['Loop', 'Silicone loops are fitted to hold any temple.'],
      ['Check', 'Every chain is measured and pull-tested before packing.']
    ]
  }
};

const PRODUCTS = [
  {
    id: 'le-rond', name: 'Le Rond', cat: 'sunglasses', price: 210, badge: 'New', symbol: 'p-round', made: 'acetate',
    tagline: 'A small round frame with a keyhole bridge.',
    desc: 'Le Rond is cut from 6 mm acetate and sits slightly lower on the nose thanks to its keyhole bridge, so it suits most faces. Amber lenses warm the light and lift contrast.',
    colors: [
      { name: 'Black / Amber', swatch: '#111', vars: { '--frame': '#111', '--lens': 'url(#g-amber)' } },
      { name: 'Tortoise / Brown', swatch: '#7a4a22', vars: { '--frame': 'url(#g-tortoise)', '--lens': 'url(#g-amber)' } },
      { name: 'Crystal / Green', swatch: '#d9d3c7', vars: { '--frame': '#cfc8bb', '--lens': 'url(#g-green)' } }
    ],
    dims: { lens: 49, bridge: 21, temple: 145, height: 47 },
    specs: [['Frame', 'Mazzucchelli acetate'], ['Lens', 'Polarised nylon, UV400, Cat. 3'], ['Hinge', '5-barrel steel'], ['Weight', '26 g'], ['Fit', 'Narrow to medium']],
    details: ['Keyhole bridge', 'Polarised lenses cut glare off water and roads', 'Comes with a leather case and microfibre pouch']
  },
  {
    id: 'le-carre', name: 'Le Carré', cat: 'sunglasses', price: 190, symbol: 'p-square', made: 'acetate',
    tagline: 'A thick, square frame with soft corners.',
    desc: 'Le Carré is our everyday frame. The rims are thick and flat, the corners are rounded just enough, and the dark grey lenses keep colours true in full sun.',
    colors: [
      { name: 'Black / Smoke', swatch: '#111', vars: { '--frame': '#111', '--lens': 'url(#g-smoke)' } },
      { name: 'Brown / Amber', swatch: '#4a3426', vars: { '--frame': '#4a3426', '--lens': 'url(#g-amber)' } },
      { name: 'Bone / Smoke', swatch: '#d8cfc2', vars: { '--frame': '#d8cfc2', '--lens': 'url(#g-smoke)' } }
    ],
    dims: { lens: 52, bridge: 20, temple: 145, height: 44 },
    specs: [['Frame', 'Mazzucchelli acetate'], ['Lens', 'Polarised nylon, UV400, Cat. 3'], ['Hinge', '5-barrel steel'], ['Weight', '31 g'], ['Fit', 'Medium to wide']],
    details: ['Flat, thick rims', 'True-colour grey lenses', 'Comes with a leather case and microfibre pouch']
  },
  {
    id: 'le-bob', name: 'Le Bob', cat: 'hats', price: 95, symbol: 'p-bucket', made: 'cotton', sizes: true,
    tagline: 'A washed cotton bucket hat with a short brim.',
    desc: 'Le Bob is made from heavy cotton twill and washed until it feels like you have owned it for years. The brim is short and angled down to keep the sun off your face.',
    colors: [
      { name: 'Black', swatch: '#161616', vars: { '--body': '#161616', '--band': '#444' } },
      { name: 'Ecru', swatch: '#e6dfd1', vars: { '--body': '#e6dfd1', '--band': '#a99f8c' } },
      { name: 'Olive', swatch: '#4d5233', vars: { '--body': '#4d5233', '--band': '#2c2f1c' } }
    ],
    dims: { brim: '5.5 cm', crown: '9 cm' },
    specs: [['Material', '100% cotton twill, 340 g/m²'], ['Brim', '5.5 cm, stitched'], ['Crown', '9 cm'], ['Lining', 'Cotton poplin'], ['Weight', '95 g']],
    details: ['Garment washed', 'Packable: folds flat in a bag', 'Topstitched brim keeps its shape']
  },
  {
    id: 'le-chat', name: 'Le Chat', cat: 'sunglasses', price: 220, symbol: 'p-cat', made: 'acetate',
    tagline: 'A cat-eye frame with a sharp upswept corner.',
    desc: 'Le Chat lifts at the outer corners and narrows at the bridge. It is a 1960s shape cut a little smaller, so it reads as sharp, not costume.',
    colors: [
      { name: 'Black / Smoke', swatch: '#111', vars: { '--frame': '#111', '--lens': 'url(#g-smoke)' } },
      { name: 'Bordeaux / Rose', swatch: '#5e1a1f', vars: { '--frame': '#5e1a1f', '--lens': 'url(#g-rose)' } },
      { name: 'Havana / Amber', swatch: '#7a4a22', vars: { '--frame': 'url(#g-tortoise)', '--lens': 'url(#g-amber)' } }
    ],
    dims: { lens: 54, bridge: 18, temple: 140, height: 42 },
    specs: [['Frame', 'Mazzucchelli acetate'], ['Lens', 'Polarised nylon, UV400, Cat. 3'], ['Hinge', '5-barrel steel'], ['Weight', '28 g'], ['Fit', 'Narrow to medium']],
    details: ['Upswept outer corners', 'Narrow bridge for a close fit', 'Comes with a leather case and microfibre pouch']
  },
  {
    id: 'le-fedora', name: 'Le Fedora', cat: 'hats', price: 160, badge: 'Bestseller', symbol: 'p-fedora', made: 'felt', sizes: true,
    tagline: 'A wool felt fedora with a pinched crown.',
    desc: 'Le Fedora is blocked by hand from pure wool felt. The crown is pinched at the front, the brim is wide enough for shade, and the grosgrain band is set slightly low.',
    colors: [
      { name: 'Noir', swatch: '#1c1c1c', vars: { '--body': '#1c1c1c', '--band': '#c9b79c' } },
      { name: 'Camel', swatch: '#b58a5a', vars: { '--body': '#b58a5a', '--band': '#2a1d14' } },
      { name: 'Grey', swatch: '#6d6a66', vars: { '--body': '#6d6a66', '--band': '#111' } }
    ],
    dims: { brim: '7 cm', crown: '11 cm' },
    specs: [['Material', '100% wool felt'], ['Brim', '7 cm, raw edge'], ['Crown', '11 cm, centre dent'], ['Sweatband', 'Grosgrain cotton'], ['Weight', '120 g']],
    details: ['Hand-blocked in one piece', 'Water-resistant felt', 'Comes in a reusable hat box']
  },
  {
    id: 'l-aviateur', name: "L'Aviateur", cat: 'sunglasses', price: 240, symbol: 'p-aviator', made: 'metal',
    tagline: 'A titanium aviator with a double bridge.',
    desc: "L'Aviateur is a light titanium frame with a double bridge and teardrop lenses. Adjustable nose pads let it sit exactly where you want it.",
    colors: [
      { name: 'Silver / Amber', swatch: '#9a9a9a', vars: { '--frame': '#9a9a9a', '--lens': 'url(#g-amber)' } },
      { name: 'Gold / Green', swatch: '#b49a6a', vars: { '--frame': '#b49a6a', '--lens': 'url(#g-green)' } },
      { name: 'Silver / Mirror', swatch: '#c9ced4', vars: { '--frame': '#9a9a9a', '--lens': 'url(#g-mirror)' } }
    ],
    dims: { lens: 58, bridge: 14, temple: 145, height: 50 },
    specs: [['Frame', 'Beta titanium'], ['Lens', 'Polarised nylon, UV400, Cat. 3'], ['Nose pads', 'Adjustable silicone'], ['Weight', '19 g'], ['Fit', 'Medium to wide']],
    details: ['Double bridge', 'Adjustable nose pads', 'Comes with a leather case and microfibre pouch']
  },
  {
    id: 'la-casquette', name: 'La Casquette', cat: 'hats', price: 75, symbol: 'p-cap', made: 'cotton', sizes: true,
    tagline: 'A six-panel cap with an embroidered MN.',
    desc: 'La Casquette has a low, unstructured crown and a curved brim. The MN mark is embroidered tone on tone, so it is there if you look for it.',
    colors: [
      { name: 'Black', swatch: '#111', vars: { '--body': '#111', '--band': '#fff' } },
      { name: 'Forest', swatch: '#2c3a2f', vars: { '--body': '#2c3a2f', '--band': '#e9e4da' } },
      { name: 'Ecru', swatch: '#e6dfd1', vars: { '--body': '#e6dfd1', '--band': '#111' } }
    ],
    dims: { brim: '7 cm', crown: '10 cm' },
    specs: [['Material', '100% cotton twill'], ['Brim', '7 cm, pre-curved'], ['Crown', '10 cm, unstructured'], ['Closure', 'Brass buckle strap'], ['Weight', '80 g']],
    details: ['Embroidered MN mark', 'Adjustable brass buckle', 'Garment washed']
  },
  {
    id: 'la-chaine', name: 'La Chaîne', cat: 'accessories', price: 65, symbol: 'p-chain', made: 'chain',
    tagline: 'A fine chain that keeps your glasses close.',
    desc: 'La Chaîne clips onto any pair of glasses with soft silicone loops. Wear it to keep your sunglasses around your neck, or on its own as a necklace.',
    colors: [
      { name: 'Gold', swatch: '#b49a6a', vars: { '--metal': '#b49a6a' } },
      { name: 'Silver', swatch: '#b8bcc2', vars: { '--metal': '#b8bcc2' } },
      { name: 'Black', swatch: '#222', vars: { '--metal': '#222' } }
    ],
    dims: { length: '70 cm' },
    specs: [['Material', '18k gold-plated brass'], ['Length', '70 cm'], ['Loops', 'Silicone, fits any temple'], ['Weight', '12 g'], ['Packaging', 'Cotton pouch']],
    details: ['Fits any frame', 'Doubles as a necklace', 'Comes in a cotton pouch']
  }
];

const productUrl = id => `product.html#${id}`;
const findProduct = id => PRODUCTS.find(p => p.id === id);
const varsStyle = vars => Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');

document.body.insertAdjacentHTML('afterbegin', MN_SVG);
