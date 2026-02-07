export interface ContentAndImageTwoColumnProps {
  leftColumn: any;
  rightColumn: {
    image: {
      id: string;
      name: string;
      endpoint: string;
      defaultHost: string;
      mimeType: string;
    };
  };
  reverse: boolean;
  backgroundColor: string;
  cta?: {
    isNewTab: boolean;
    label: string;
    type: string;
    color: string;
  };
  isSquareImage?: boolean;
}
