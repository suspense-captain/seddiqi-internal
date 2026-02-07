export interface MediaType {
  image?: {
    _meta: {
      schema: string;
    };
    id: string;
    name: string;
    endpoint: string;
    defaultHost: string;
    mimeType: string;
  };
  video?: {
    _meta: {
      schema: string;
    };
    id: string;
    name: string;
    endpoint: string;
    defaultHost: string;
    mimeType: string;
  };
  altText?: string;
  autoPlay?: boolean;
  showPlay?: boolean;
}

export interface BrandBannerProps {
  mainTitle: string;
  media: MediaType;
  richText: string;
  mainTitleFont?: any;
}
