export interface ColorSelectorProps {
    title: string | null;
    description: string | null;
    onClose: () => void;
    isOpen: boolean;
    colorVariations?:[] | null;
    onSelectColor: (size: string) => void;
  }