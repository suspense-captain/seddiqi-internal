export interface SpecsData {
  title: string;
  description: string;
}

export interface TabsData {
  id: number;
  tabTitle?: string;
  specs?: SpecsData[];
  productImageUrl?: string;
}



export interface ItemsData {
  id: number;
  itemTitle: string;
  itemDescription: string | boolean;
}

export interface Specs {
  id: number;
  specsTitle: string;
  items?: ItemsData[];
}

export interface ListSpecsData {
  mainTitle: string;
  specs?: Specs[];
}

export interface NonTabItemsData {
  id: number;
  specsTitle: string;
  specsDescription: string;
}

export interface NonTabSpecs {
  id: number;
  items?: NonTabItemsData[];
}

export interface NonTabListSpecsData {
  nonTabSpecs?: NonTabSpecs[];
}

export interface TechSpecsData {
  tabsData?: TabsData[];
  category: string;
  specsData?: ListSpecsData[];
  nonTabSpecsData?: NonTabListSpecsData[];
  // caliber: string;
  // movement: string;
  // powerReserve: string;
  // chronograph: string;
  // vibration: string;
  // cylinder: string;
  // caseMaterial: string;
  // caseback: string;
  // waterResistance: boolean;
  // waterResistanceDepth: string;
  // waterResistanceDepthUnit: string;
  // bezel: string;
  // crown: string;
  // crystal: string;
  // productWeight: string;
  // watchHeadWeight: string;
  // diameter: string;
  // thickness: string;
  // height: string;
  // lugWidth: string;
  // strapMaterial: string;
  // strapColor: string;
  // strapType: string;
  // lug: string;
  // buckleMaterial: string;
  // buckleType: string;
  // buckleSize: string;
}
