// Contest sponsors shown next to each vote category.
export const SPONSORS = {
  fan: { name: "PPHB", logo: "/sponsors/pphb.png" },
  tent: { name: "Jet Specialty", logo: "/sponsors/jet-specialty.png" },
} as const;

export type SponsorKey = keyof typeof SPONSORS;
