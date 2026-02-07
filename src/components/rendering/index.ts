import dynamic from 'next/dynamic'
import Spacing from "./spacing";
import AcccountPage from "./accountPage";
import MyProfile from "./myProfile";
import MyFavourites from "./myFavourites";
import Bookings from "./bookings";

const Header = dynamic(() => import('./header'))
const Footer = dynamic(() => import('./footer'))
const HeroBanner = dynamic(() => import('./heroBanner'))
const TwoColumnImageCopy = dynamic(() => import('./twoColumnImageCopy'))
const TwoColumnArticleBlock = dynamic(() => import('./twoColumnArticleBlock'))
const ThreeItemCarousel = dynamic(() => import('./threeItemCarousel'))
const TwoColumnFullScreenImage = dynamic(() => import('./twoColumnFullScreenImage'))
const DefaultContentBlock = dynamic(() => import('./defaultContentBlock'))
const CollectionsTabList = dynamic(() => import('./collectionsTabList'))
const QuoteBlock = dynamic(() => import('./quoteBlock'))
const ImageQuoteBlock = dynamic(() => import('./imageQuoteBlock'))
const BoutiqueBanner = dynamic(() => import('./boutiqueBanner'))
const ArticleListCarousel = dynamic(() => import('./articleListCarousel'))
const BrandBanner = dynamic(() => import('./brandBanner'))
const HighlightedProductCarousel = dynamic(() => import('./highlightedProductCarousel'))
const FeaturedProductCarousel = dynamic(() => import('./featuredProductCarousel'))
const PdpTabs = dynamic(() => import('./pdpTabs'))
const ExploreBrand = dynamic(() => import('./exploreBrand'))
const ContentAndImageTwoColumn = dynamic(() => import('./contentAndImageTwoColumn'))
const ContentAndSingleImageColumn = dynamic(() => import('./contentAndSingleImageColumn'))
const TitleAndTwoBlockImageContentOverlap = dynamic(() => import('./titleAndTwoBlockImageContentOverlap'))
const ImageGalleryCarousel = dynamic(() => import('./imageGalleryCarousel'))
const NeedMoreHelp = dynamic(() => import('./needMoreHelp'))
const Hotspot = dynamic(() => import('./hotspot'))
const ScriptRenderer = dynamic(() => import('./scriptRenderer'))
const MapComponent = dynamic(() => import('./mapComponent'))
const HeritageContentComponent = dynamic(() => import('./heritageContentComponent'))
const TwoColumnOurServices = dynamic(() => import('./twoColumnOurServices'));
const TwoColumnArticleBlockV2 = dynamic(() => import('./twoColumnArticleBlockV2'))
const ContentAndImageAdvanced = dynamic(() => import("./contentAndImageAdvanced"));
const ServicePageTabs = dynamic(() => import('./servicePageTabs'));
const IntroComponent = dynamic(() => import('./introComponent'))
const FamilyCarousel = dynamic(() => import('./familyCarousel'))
const FullScreenIntroWithSplitContent = dynamic(() => import('./fullScreenIntroSplitContent'))

export {
  Header,
  Footer,
  HeroBanner,
  TwoColumnImageCopy,
  TwoColumnArticleBlock,
  TwoColumnArticleBlockV2,
  ThreeItemCarousel,
  TwoColumnFullScreenImage,
  DefaultContentBlock,
  CollectionsTabList,
  QuoteBlock,
  ImageQuoteBlock,
  BrandBanner,
  HighlightedProductCarousel,
  BoutiqueBanner,
  ArticleListCarousel,
  FeaturedProductCarousel,
  PdpTabs,
  ExploreBrand,
  Spacing,
  AcccountPage,
  MyProfile,
  MyFavourites,
  Bookings,
  ContentAndImageTwoColumn,
  ContentAndSingleImageColumn,
  TitleAndTwoBlockImageContentOverlap,
  FullScreenIntroWithSplitContent,
  ImageGalleryCarousel,
  NeedMoreHelp,
  Hotspot,
  ScriptRenderer,
  MapComponent,
  HeritageContentComponent,
  ContentAndImageAdvanced,
  ServicePageTabs,
  TwoColumnOurServices,
  IntroComponent,
  FamilyCarousel
};
