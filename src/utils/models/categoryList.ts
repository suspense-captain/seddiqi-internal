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
export interface CategoryItem {
  media: MediaType;
  title: string;
  description: string;
  opacity?: number;
}

export interface CategoryListProps {
  title: string;
  cta: {
    isNewTab: boolean;
    label: string;
    type: string;
    color: string;
    url: string;
  };
  listItems: CategoryItem[];
}
