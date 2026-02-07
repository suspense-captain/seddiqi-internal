export interface ImageType {
    image: {
      _meta: {
        schema: string;
      };
      id: string;
      name: string;
      endpoint: string;
      defaultHost: string;
      mimeType: string;
    };
    altText: string;
  }
  
  export interface LogoIconType {
    image: ImageType;
  }
  
  export interface ImageQuoteBlockProps {
    image: ImageType;
    mobileMedia: any;
    logoIcon?: LogoIconType;
    nameDesignation: string;
    nameSource: string;
    richText: string;
  }
  