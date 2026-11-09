export type Property = {
  slug: string;
  title: string;
  location: string;
  region: string;
  type: "Villa" | "Apartment" | "Townhouse";
  intent: "Buy" | "Rent";
  price: number;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
  tag: string;
};

// Fictional sample records for UI development only. Replace with verified agency inventory.
export const properties: Property[] = [
  { slug: "capri-coastal-house", title: "The Capri House", location: "Capri, Italy", region: "Italy", type: "Villa", intent: "Buy", price: 4850000, priceLabel: "€4,850,000", beds: 5, baths: 4, area: 390, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85", tag: "Coastal living" },
  { slug: "lisbon-residence", title: "Santo Amaro Residence", location: "Lisbon, Portugal", region: "Portugal", type: "Apartment", intent: "Buy", price: 1280000, priceLabel: "€1,280,000", beds: 3, baths: 2, area: 168, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85", tag: "City address" },
  { slug: "marrakech-courtyard", title: "The Courtyard House", location: "Marrakech, Morocco", region: "Morocco", type: "Villa", intent: "Rent", price: 9200, priceLabel: "€9,200 / month", beds: 4, baths: 4, area: 310, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", tag: "Private retreat" },
  { slug: "paris-pied-a-terre", title: "Rue de Lille Apartment", location: "Paris, France", region: "France", type: "Apartment", intent: "Buy", price: 2150000, priceLabel: "€2,150,000", beds: 2, baths: 2, area: 122, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85", tag: "New to market" },
  { slug: "mallorca-finca", title: "Son Vida Finca", location: "Mallorca, Spain", region: "Spain", type: "Villa", intent: "Rent", price: 14500, priceLabel: "€14,500 / month", beds: 6, baths: 5, area: 460, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85", tag: "Island life" },
  { slug: "geneva-townhouse", title: "Old Town Townhouse", location: "Geneva, Switzerland", region: "Switzerland", type: "Townhouse", intent: "Buy", price: 3400000, priceLabel: "€3,400,000", beds: 4, baths: 3, area: 250, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85", tag: "Architectural detail" }
];
