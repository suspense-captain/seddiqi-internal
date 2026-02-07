export interface SizeGuideProps {
    primaryTitle: string;
    primaryDescription: string;
    secondaryTitle: string;
    secondaryDescription: string;
    items: ProductSize[];
    onClose: () => void;
    isOpen: boolean;
  }
  
  export interface ProductSize {
    label: string;
    listItems: string[];
  }
  