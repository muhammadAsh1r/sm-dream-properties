export type PropertyStatus = "sale" | "rent";

export type PropertyKind =
  | "residential-plot"
  | "commercial-plot"
  | "house"
  | "apartment"
  | "farmhouse";

export type PropertyCategory =
  | "residential"
  | "commercial"
  | "plot"
  | "industrial";

export type PropertyLocationArea =
  | "faisal-town"
  | "faisal-hills"
  | "b17"
  | "islamabad";

export type PossessionStatus =
  | "ready"
  | "under-construction"
  | "booking";

export type AreaUnit = "sqft" | "marla" | "kanal";

export type PropertySort =
  | "latest"
  | "price-asc"
  | "price-desc"
  | "featured";

export type PropertyAgent = {
  name: string;
  designation: string;
  phone: string;
  email: string;
  whatsapp: string;
  photoUrl: string;
};

export type PropertyCoordinates = {
  lat: number;
  lng: number;
};

export type DescriptionSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type Property = {
  id: string;
  propertyId: string;
  title: string;
  slug: string;
  shortDescription: string;
  descriptionSections: DescriptionSection[];
  price: number;
  currency: string;
  status: PropertyStatus;
  kind: PropertyKind;
  category: PropertyCategory;
  location: string;
  locationArea: PropertyLocationArea;
  area: number;
  areaUnit: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  garage?: number;
  purpose: string;
  possessionStatus: PossessionStatus;
  featured: boolean;
  isNew: boolean;
  images: string[];
  amenities: string[];
  coordinates: PropertyCoordinates;
  nearbyLandmarks: string[];
  agent: PropertyAgent;
  createdAt: string;
  updatedAt: string;
};

/** Legacy card shape used on homepage */
export type PropertyCardData = {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  type: PropertyStatus;
  location: string;
  area: number;
  areaUnit: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  featured: boolean;
  isNew: boolean;
  imageUrl: string;
  shortDescription?: string;
  kind?: PropertyKind;
  agentName?: string;
  createdAt?: string;
};

export type PropertySearchParams = {
  kind?: string;
  minPrice?: string;
  maxPrice?: string;
  area?: string;
  customAreaMin?: string;
  customAreaMax?: string;
  location?: string;
  status?: string;
  bedrooms?: string;
  bathrooms?: string;
  q?: string;
  sort?: string;
  page?: string;
  featured?: string;
};

export function toPropertyCardData(property: Property): PropertyCardData {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    price: property.price,
    currency: property.currency,
    type: property.status,
    location: property.location,
    area: property.area,
    areaUnit: property.areaUnit,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    featured: property.featured,
    isNew: property.isNew,
    imageUrl: property.images[0] ?? "",
    shortDescription: property.shortDescription,
    kind: property.kind,
    agentName: property.agent.name,
    createdAt: property.createdAt,
  };
}
