const COUNTS = {
  launch: 6, eclipse: 6, conjunction: 6, opposition: 6,
  apogeePerigee: 6, meteorShower: 6, equinoxSolstice: 6, historical: 6,
};

export function pickIllustration(category) {
  const count = COUNTS[category] ?? 1;
  const index = Math.floor(Math.random() * count) + 1;
  return `/assets/illustrations/${category}/${category}-${index}.svg`;
}