/**
 * Intrinsic size and dominant colour for every photograph, generated once from
 * the originals. `<CafeImage>` paints the colour as the loading ground, so a
 * lazy photo fades in from its own tone instead of from a blank box. It costs
 * seven bytes per image, where a blurred placeholder costs several hundred.
 */
export const imageMeta: Record<string, { w: number; h: number; c: string }> = {
  "/images/bag-baguette_about.jpg": { w: 1012, h: 1800, c: "#7a6a5c" },
  "/images/barista-work_about.jpg": { w: 1351, h: 1800, c: "#7b624c" },
  "/images/barista_shared.jpg": { w: 2122, h: 1466, c: "#4e3826" },
  "/images/bread-bags_about.jpg": { w: 1012, h: 1800, c: "#7c766b" },
  "/images/burekas-dips_catering.jpg": { w: 1012, h: 1800, c: "#906749" },
  "/images/burekas-dish_catering.jpg": { w: 1351, h: 1800, c: "#8f6c50" },
  "/images/burekas-eggs_shared.jpg": { w: 1360, h: 907, c: "#837973" },
  "/images/burekas-golden_shared.jpg": { w: 1350, h: 1800, c: "#ae7d45" },
  "/images/burekas-table_shared.jpg": { w: 1013, h: 1800, c: "#75644c" },
  "/images/cheesecake-basque_shared.jpg": { w: 1350, h: 1800, c: "#827666" },
  "/images/chestnut-tart_shared.jpg": { w: 1351, h: 1800, c: "#9a9490" },
  "/images/chocolate-croissant_shared.jpg": { w: 1205, h: 1356, c: "#705f48" },
  "/images/cinnamon-rolls_shared.jpg": { w: 1350, h: 1800, c: "#927a64" },
  "/images/coffee-duo_shared.jpg": { w: 1600, h: 2000, c: "#897e73" },
  "/images/coffee-sandwich_shared.jpg": { w: 1350, h: 1800, c: "#6a6252" },
  "/images/coffee-shelf_shared.jpg": { w: 1439, h: 1800, c: "#6e6051" },
  "/images/cold-drinks_shared.jpg": { w: 1600, h: 1537, c: "#8e7d60" },
  "/images/courtyard-tall_shared.jpg": { w: 1200, h: 1800, c: "#87847d" },
  "/images/croissant-macro_shared.jpg": { w: 1013, h: 1800, c: "#a38255" },
  "/images/cup-pastry_coffee-club.jpg": { w: 1350, h: 1800, c: "#8d8276" },
  "/images/flat-white_shared.jpg": { w: 1351, h: 1800, c: "#a6a4a2" },
  "/images/iced-latte-palms_shared.jpg": { w: 1349, h: 1800, c: "#747873" },
  "/images/jachnun-closeup_shared.jpg": { w: 1360, h: 907, c: "#9f6b40" },
  "/images/jachnun-plate_jachnun.jpg": { w: 1351, h: 1800, c: "#9f948e" },
  "/images/jachnun-tray_shared.jpg": { w: 1360, h: 907, c: "#9e8a7e" },
  "/images/juice-orange_shared.jpg": { w: 1500, h: 1240, c: "#6f675c" },
  "/images/latte-cinnamon_shared.jpg": { w: 1012, h: 1800, c: "#9d9287" },
  "/images/latte-outdoors_shared.jpg": { w: 1013, h: 1800, c: "#686950" },
  "/images/matcha-iced_shared.jpg": { w: 1248, h: 1561, c: "#6d695c" },
  "/images/matcha-pair_shared.jpg": { w: 1013, h: 1800, c: "#7c6d58" },
  "/images/orange-cake_shared.jpg": { w: 1350, h: 1800, c: "#928978" },
  "/images/pastry-berries_shared.jpg": { w: 1350, h: 1800, c: "#79756f" },
  "/images/portafilter_shared.jpg": { w: 1440, h: 1800, c: "#30241a" },
  "/images/salad-box_shared.jpg": { w: 1864, h: 1346, c: "#b9ab93" },
  "/images/sandwich-box_catering.jpg": { w: 1800, h: 1457, c: "#ac8b70" },
  "/images/sandwich-close_catering.jpg": { w: 1616, h: 1080, c: "#463c2c" },
  "/images/sandwich-seeded_shared.jpg": { w: 1012, h: 1800, c: "#896c44" },
  "/images/storefront_shared.jpg": { w: 1221, h: 1289, c: "#95897b" },
  "/images/sweet-box_catering.jpg": { w: 1800, h: 1372, c: "#a68065" },
  "/images/takeaway-cup_shared.jpg": { w: 1012, h: 1800, c: "#72736c" },
  "/images/toast-hands_shared.jpg": { w: 1012, h: 1800, c: "#66584f" },
  "/images/tray-carry_shared.jpg": { w: 1351, h: 1800, c: "#73665d" },
  "/images/yard_shared.jpg": { w: 1364, h: 832, c: "#7a7157" },
};

export const imageTone = (src?: string): string | undefined => (src ? imageMeta[src]?.c : undefined);
