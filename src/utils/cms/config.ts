import { ContentClient, ContentClientConfigV2 } from "dc-delivery-sdk-js";

import Container from "@components/module/container";
import ContentPage from "@components/module/contentPage";
import Image from "@components/module/image";
import Slot from "@components/module/slot";
import CategoryList from "@components/module/categoryList";
import { ArticleCard, DisplayCard, StoryCard } from "@components/module";
import ViewAllBrandsCategory from "@components/module/brands/viewAllBrandsCategory";
import ExclusiveInfoCards from "@components/module/bookAnAppointment/exclusiveInfoCards";
import BrandListing from "@components/module/brandListing";
import GenericAccordion from "@components/module/genericAccordion";

import {
  CollectionsTabList,
  DefaultContentBlock,
  HeroBanner,
  ThreeItemCarousel,
  TwoColumnArticleBlock,
  TwoColumnFullScreenImage,
  TwoColumnImageCopy,
  QuoteBlock,
  ImageQuoteBlock,
  BrandBanner,
  BoutiqueBanner,
  ArticleListCarousel,
  HighlightedProductCarousel,
  FeaturedProductCarousel,
  ExploreBrand,
  ContentAndImageTwoColumn,
  TitleAndTwoBlockImageContentOverlap,
  FullScreenIntroWithSplitContent,
  TwoColumnArticleBlockV2,
  ImageGalleryCarousel,
  ContentAndSingleImageColumn,
  NeedMoreHelp,
  Spacing,
  ScriptRenderer,
  MapComponent,
  HeritageContentComponent,
  ContentAndImageAdvanced,
  ServicePageTabs,
  TwoColumnOurServices,
  IntroComponent,
  FamilyCarousel
} from "@components/rendering";

import {
  RolexHeroBanner,
  RolexNavbar,
  RolexImageBanner,
  ThreeGrid,
  ThreeCompactImageText,
  ItemSlider,
  TwoColumnImageText,
  ThreeTallImageText,
  RolexProductLister,
  RolexTextBlock,
  RolexIframe,
  RolexTwoColumnImage,
  ImageTextWithVariations,
  RolexMap,
  RolexHeroBannerV2
} from "@components/rendering/rolex";
import Hotspot from "@components/rendering/hotspot";
import FeaturedImageGallery from "@components/rendering/featuredImageGallery";
import BrandSearch from "@components/rendering/brandSearch";
import FeaturedCardCarousel from "@components/rendering/featuredCardCarousel";
import CollectionsContainer from "@components/rendering/rolex/collectionsContainer";
import RolexNewCollections from "@components/rendering/rolex/rolexNewCollections";
import KsaContactForm from "@components/module/ksaContactForm";

export const defaultClientConfig: ContentClientConfigV2 = {
  hubName: process.env.DYNAMIC_CONTENT_HUB_NAME || "platinumpanda",
  secureMediaHost: process.env.DYNAMIC_CONTENT_SECURE_MEDIA_HOST || "",
};

const schemaUrl = "https://seddiqi.amplience.com";
const contentUrl = schemaUrl + "/content";
const slotsUrl = schemaUrl + "/slots";
const pageUrl = schemaUrl + "/page";
const moduleUrl = schemaUrl + "/module";
const componentUrl = schemaUrl + "/component";
const renderingUrl = schemaUrl + "/rendering";

export const RolexComponentMapping: any = {
  [`${pageUrl}/landing`]: ContentPage,
  [`${contentUrl}/container`]: Container,
  [`${contentUrl}/image`]: Image,
  [`${contentUrl}/content`]: ContentPage,
  [`${slotsUrl}/container`]: Slot,
  [`${moduleUrl}/article-card`]: ArticleCard,
  [`${moduleUrl}/display-card`]: DisplayCard,
  [`${moduleUrl}/story-card`]: StoryCard,
  [`${componentUrl}/rolex/navbar`]: RolexNavbar,
  [`${componentUrl}/rolex/text-block`]: RolexTextBlock,
  [`${componentUrl}/rolex/hero-banner`]: RolexHeroBanner,
  [`${componentUrl}/rolex/image-banner`]: RolexImageBanner,
  [`${componentUrl}/spacing`]: Spacing,
  [`${componentUrl}/rolex/three-grid`]: ThreeGrid,
  [`${componentUrl}/rolex/three-compact-image-text`]: ThreeCompactImageText,
  [`${componentUrl}/rolex/item-slider`]: ItemSlider,
  [`${componentUrl}/rolex/two-column-image-text-v2`]: TwoColumnImageText,
  [`${componentUrl}/rolex/three-tall-image-text`]: ThreeTallImageText,
  [`${componentUrl}/rolex/product-lister-v2`]: RolexProductLister,
  [`${componentUrl}/rolex/image-text-with-variations`]: ImageTextWithVariations,
  [`${componentUrl}/rolex/iframe-embeded-video`]: RolexIframe,
  [`${componentUrl}/rolex/rolex-two-column-image-with-title`]: RolexTwoColumnImage,
  [`${componentUrl}/rolex/collections`]: CollectionsContainer,
  [`${componentUrl}/botique-banner`]: BoutiqueBanner,
  [`${componentUrl}/script-renderer`]: ScriptRenderer,
  [`${componentUrl}/rolex/contact-us-map`]: RolexMap,
  [`${componentUrl}/rolex/new-collections`]: RolexNewCollections,
  [`${componentUrl}/rolex/hero-banner-v2`]: RolexHeroBannerV2
};

export const ComponentMapping: any = {
  [`${pageUrl}/landing`]: ContentPage,
  [`${contentUrl}/container`]: Container,
  [`${contentUrl}/image`]: Image,
  [`${contentUrl}/content`]: ContentPage,
  [`${contentUrl}/hero_banner`]: HeroBanner,
  [`${renderingUrl}/banner`]: HeroBanner,
  [`${slotsUrl}/container`]: Slot,
  [`${moduleUrl}/article-card`]: ArticleCard,
  [`${moduleUrl}/display-card`]: DisplayCard,
  [`${moduleUrl}/story-card`]: StoryCard,
  [`${componentUrl}/two-column-image-copy`]: TwoColumnImageCopy,
  [`${componentUrl}/two-column-article-block`]: TwoColumnArticleBlock,
  [`${componentUrl}/blog-latest-stories`]: TwoColumnArticleBlockV2,
  [`${componentUrl}/hero-banner`]: HeroBanner,
  [`${componentUrl}/category-list`]: ThreeItemCarousel,
  [`${componentUrl}/two-column-fullscreen-image`]: TwoColumnFullScreenImage,
  [`${componentUrl}/content-block`]: DefaultContentBlock,
  [`${componentUrl}/quote-block`]: QuoteBlock,
  [`${componentUrl}/image-quote-block`]: ImageQuoteBlock,
  [`${componentUrl}/collections-tab-list`]: CollectionsTabList,
  [`${componentUrl}/article-list-carousel`]: ArticleListCarousel,
  [`${componentUrl}/brand-banner`]: BrandBanner,
  [`${componentUrl}/highlighted-product-carousel`]: HighlightedProductCarousel,
  [`${componentUrl}/botique-banner`]: BoutiqueBanner,
  [`${componentUrl}/product-carousel`]: FeaturedProductCarousel,
  [`${componentUrl}/image-gallery-carousel`]: ImageGalleryCarousel,
  [`${componentUrl}/explore-brand`]: ExploreBrand,
  [`${componentUrl}/brand-category-list`]: CategoryList,
  [`${contentUrl}/find-a-boutique-listing`]: ContentPage,
  [`${componentUrl}/brand-listing`]: BrandListing,
  [`${componentUrl}/view-all-brands`]: ViewAllBrandsCategory,
  [`${componentUrl}/content-and-image-two-column`]: ContentAndImageTwoColumn,
  [`${componentUrl}/spacing`]: Spacing,
  [`${componentUrl}/need-help`]: NeedMoreHelp,
  [`${componentUrl}/exclusive-info-list`]: ExclusiveInfoCards,
  [`${componentUrl}/content-and-single-image-column`]: ContentAndSingleImageColumn,
  [`${componentUrl}/hotspot`]: Hotspot,
  // [`${componentUrl}/fullscreen-intro-with-split-content`]: FullscreenIntroWithSplitContent,
  [`${componentUrl}/fullscreen-intro-with-split-content-main`]: FullScreenIntroWithSplitContent,
  [`${componentUrl}/title-and-two-block-image-content-overlap`]: TitleAndTwoBlockImageContentOverlap,
  [`${componentUrl}/brand-search`]: BrandSearch,
  [`${componentUrl}/featured-image-gallery`]: FeaturedImageGallery,
  [`${componentUrl}/generic-accordion`]: GenericAccordion,
  [`${componentUrl}/featured-card-carousel`]: FeaturedCardCarousel,
  [`${componentUrl}/script-renderer`]: ScriptRenderer,
  [`${componentUrl}/map`]: MapComponent,
  [`${componentUrl}/heritage-content-component`]: HeritageContentComponent,
  [`${componentUrl}/content-and-image-advanced-full-variable`]: ContentAndImageAdvanced,
  [`${componentUrl}/service-page-tabs`]: ServicePageTabs,
  [`${componentUrl}/two-column-image-text`]: TwoColumnOurServices,
  [`${componentUrl}/heritage-intro-and-explore`]: IntroComponent,
  [`${componentUrl}/family-carousel`]: FamilyCarousel,
  [`${componentUrl}/ksa-contact-us`]: KsaContactForm,
};

const defaultConfig = {
  url: schemaUrl,
  cms: {
    hubName: "platinumpanda",
    imageHub: "willow",
  },
};

let configObj: any | undefined = undefined;

export function getConfig(): any {
  if (!configObj) {
    configObj = defaultClientConfig;
  }

  return configObj as any;
}

export function getHubName() {
  return getConfig()?.cms?.hubName ?? "unknown";
}
