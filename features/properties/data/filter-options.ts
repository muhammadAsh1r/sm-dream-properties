import type {
  PropertyKind,
  PropertyLocationArea,
  PropertySearchParams,
  PropertySort,
  PropertyStatus,
} from "@/types/property";

export const PROPERTY_KINDS: { value: PropertyKind; label: string }[] = [
  { value: "residential-plot", label: "Residential Plot" },
  { value: "commercial-plot", label: "Commercial Plot" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "farmhouse", label: "Farmhouse" },
];

export const PROPERTY_LOCATIONS: {
  value: PropertyLocationArea;
  label: string;
}[] = [
  { value: "faisal-town", label: "Faisal Town" },
  { value: "faisal-hills", label: "Faisal Hills" },
  { value: "b17", label: "B17" },
  { value: "islamabad", label: "Islamabad" },
];

export const PROPERTY_STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

export const AREA_PRESETS = [
  { value: "5-marla", label: "5 Marla", marla: 5 },
  { value: "10-marla", label: "10 Marla", marla: 10 },
  { value: "1-kanal", label: "1 Kanal", marla: 20 },
  { value: "custom", label: "Custom", marla: null },
] as const;

export const SORT_OPTIONS: { value: PropertySort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
export const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export const PROPERTIES_PER_PAGE = 9;

export const DEFAULT_SEARCH_PARAMS: PropertySearchParams = {
  sort: "latest",
  page: "1",
};

export const KIND_LABELS: Record<PropertyKind, string> = {
  "residential-plot": "Residential Plot",
  "commercial-plot": "Commercial Plot",
  house: "House",
  apartment: "Apartment",
  farmhouse: "Farmhouse",
};

export const LOCATION_LABELS: Record<PropertyLocationArea, string> = {
  "faisal-town": "Faisal Town",
  "faisal-hills": "Faisal Hills",
  b17: "B17",
  islamabad: "Islamabad",
};

export const POSSESSION_LABELS = {
  ready: "Ready for Possession",
  "under-construction": "Under Construction",
  booking: "Booking Open",
} as const;
