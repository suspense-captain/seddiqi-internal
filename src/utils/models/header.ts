export interface LatestsubTitle {
  image?: string;
  title?: string;
  subTitle?: string;
}

export interface Category {
  name: string;
  expand: boolean;
}

export interface Section {
  id: number;
  type: string;
  categories?: Category[];
  special_categories?: Category[];
  the_latest?: LatestsubTitle[];
}

export interface HeaderLogosData {
  id?: number;
  width?: number;
  height?: number;
  title?: string;
  imageUrl?: string;
  url?: string;
}

export interface HeaderData {
  header: string[];
  header_logos: HeaderLogosData[];
  mobile_logos: HeaderLogosData[];
  mobile_siddiqi_logo: HeaderLogosData;
  sections: Section[];
}

export interface MobileHeaderNavbarProps {
  menuOpen?: boolean;
  toggleMenu?: () => void;
}

// accordion
export interface AccordionProps {
  item: any;
  children?: React.ReactNode;
  setSubMenu?: (id: any) => void;
  subMenu?: string | number | boolean;
  showArrow?: boolean;
  isOpen?: boolean;
  url?: string
  isCollapse?: boolean
  isChildAccordion?: boolean
  type?: any
}

// cards
export interface CardInfoProps {
  item: {
    media?: {
      image?: any;
      altText?: string;
    };
    image?: {
      image?: any;
      altText?: string;
    };
    linkTitle?: string;
    link?: string;
    title: string;
    subTitle: string;
  };
  className?: string;
}

// navigation links
export interface NavigationLinkProps {
  url?: string;
  title: string;
  className?: string;
  arrow?: boolean;
  hover?: boolean;
  isNewTab?: boolean; 
}
