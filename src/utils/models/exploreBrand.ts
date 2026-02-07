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
  altText?: string;
}

export interface ExploreBrandProps {
  exploreBrandItems?: any;
  cta: {
    isNewTab: boolean;
    label: string;
    type: string;
    color: string;
    url: string;
  };
  primaryTitle: string;
  media: MediaType;
  secondaryDescription: string;
}
