export type Kitchen = {
  slug: string;
  name: string;
  description: string;
  cuisine: string[];
  serviceArea: string;
  hours: string;
  fulfillment: string[];
  image: string;
  imageAlt: string;
  verified: boolean;
};

// Add a kitchen only after its public name, service details and launch status
// have been confirmed. The order flow works without a published kitchen.
export const kitchens: Kitchen[] = [];

export function getKitchen(slug: string) {
  return kitchens.find((kitchen) => kitchen.slug === slug);
}
