import dynamic from 'next/dynamic'

const RolexNavbar = dynamic(() => import('./rolexHeader'))
const RolexHeroBanner = dynamic(() => import('./rolexHeroBanner'))
const ThreeCompactImageText = dynamic(() => import('./threeCompactImageText'))
const ThreeGrid = dynamic(() => import('./threeGrid'))
const ThreeTallImageText = dynamic(() => import('./threeTallImageText'))
const TwoColumnImageText = dynamic(() => import('./twoColumnImageText'))
const FooterBackToTop = dynamic(() => import('./footerBackToTop'))
const ItemSlider = dynamic(() => import('./itemSlider'))
const RolexProductLister = dynamic(() => import('./rolexProductLister'))
const RolexImageBanner = dynamic(() => import('./rolexImageBanner'))
const RolexSmallLink = dynamic(() => import('./rolexSmallLink'))
const RolexTextBlock = dynamic(() => import('./rolexTextBlock'))
const ImageTextWithVariations = dynamic(() => import('./imageTextWithVariations'))
const RolexIframe = dynamic(() => import('./rolexIframe')) 
const RolexTwoColumnImage = dynamic(() => import('./rolexTwoColumnImage')) 
const CollectionsContainer = dynamic(() => import('./collectionsContainer'))
const RolexMap = dynamic(() => import('./rolexMap'))
const RolexNewCollections = dynamic(() => import('./rolexNewCollections'))
const RolexHeroBannerV2 = dynamic(() => import('./rolexHeroBannerV2'))

export { 
    RolexNavbar, 
    RolexHeroBanner, 
    TwoColumnImageText, 
    ThreeGrid,
    ThreeCompactImageText,
    ThreeTallImageText,
    ItemSlider,
    FooterBackToTop,
    RolexProductLister,
    RolexImageBanner,
    RolexSmallLink,
    RolexTextBlock,
    ImageTextWithVariations,
    RolexIframe, 
    RolexTwoColumnImage,
    CollectionsContainer,
    RolexMap,
    RolexNewCollections,
    RolexHeroBannerV2
 };
