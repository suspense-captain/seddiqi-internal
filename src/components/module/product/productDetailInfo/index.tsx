import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import styles from "./productDetailInfo.module.scss";
import {
  ArrowRight,
  CalendarIcon,
  CubeIcon,
  HeartIcon,
  PlusIcon,
  ShareIcon,
} from "@assets/images/svg";
import { Button, ScrollToTop, SideDrawer } from "@components/module";
import Carousel from "@components/module/carousel";
import CarouselBtns from "@components/module/carouselBtns";
import {
  useClickOutside,
  useCloseOnScroll,
  useDeviceWidth,
  useWindowWidth,
} from "@utils/useCustomHooks";
import Image from "next/image";
import ProductImageFullScreen from "../productImageFullScreen";
import {
  SizeGuide,
  SizeSelector,
  StoreLocationDetails,
  ColorSelector,
} from "@components/module";
import StoreLocator from "@components/module/storeLocator";
import { SizeGuideProvider } from "@contexts/sizeGuideSelectorContext";
import ProductDescriptionFlyoutCard from "../productDescriptionFlyoutCard";
import ProductCareAndWarrantyFlyoutCard from "../productCareAndWarrantyFlyoutCard";
import ProductShippingDetailsFlyoutCard from "../productShippingDetailsFlyoutCard";
import Popup from "@components/rendering/popup";
import Script from "next/script";
import PopupContent from "@components/rendering/popupContent";
import ProductBadge from "../badge";
import { BookAppointmentContext } from "@contexts/bookAppointmentContext";
import { LanguageContext } from "@contexts/languageContext";
import { productDetailStaticData } from "@utils/data/english-arabic-static-data";

const ProductDetailInfo = ({
  product,
  content,
  sizeGuideData,
  shippingData,
  warrantyData,
  editorsView,
  sizeGuideDataMenWatches,
  sizeGuideDataWomenWatches,
}) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [storeLocatorPopup, showStoreLocatorPopup] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMobile = !useDeviceWidth()[0];
  const [isSizeSelectorOpen, setSizeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setColorSelectorOpen] = useState(false);
  const [isCardOpen, setCardOpen] = useState(null);
  const productInfo = content?.page?.components[1];
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isBoutiqueLocationDetailsOpen, setBoutiqueLocationDetailsOpen] =
    useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const prevScrollY = useRef(0);
  const windowWidth = useWindowWidth();
  const [showPopup, setShowPoup] = useState(false);
  const orderable = product.inventory.orderable;
  const representedProduct = product.representedProduct;
  const storeId = Boolean(product.c_storeId?.trim());
  const { 
    isFromPdp
  } = useContext(BookAppointmentContext);
  const storeInventories = product.inventories;

  if (!product) return null;

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSizeSelectorOpen(false);
    if (selectedColor) {
      setErrorMessage(" ");
    }
    setSizeSelectorOpen(false);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setColorSelectorOpen(false);
    if (selectedSize) {
      setErrorMessage(" ");
    }
    setColorSelectorOpen(false);
  };

  const handleSizeSelectorOpen = (size) => {
    setSizeSelectorOpen(true);
    setCardOpen(null);
  };

  const handleColorSelectorOpen = () => {
    setColorSelectorOpen(true);
  };

  const handleColorSelectorClose = () => {
    setColorSelectorOpen(false);
  };

  const handleCardToggle = (card) => {
    setCardOpen((prev) => (prev === card ? null : card));
  };

  const handleSizeGuideClose = () => {
    setSelectedProductId(null);
    setSizeGuideOpen(false);
    setSizeSelectorOpen(false);
  };

  const handleBoutiqueLocationDetailsOpen = () => {
    setBoutiqueLocationDetailsOpen(true); // Close Boutique Location Details Popup
  };

  const handleBoutiqueLocationDetailsClose = () => {
    setBoutiqueLocationDetailsOpen(false); // Close Boutique Location Details Popup
  };

  useEffect(() => {
    if (product) {
      const productDetails = {
        name: product.name,
        brand: product.brand,
      };
      localStorage.setItem(
        "selectedProductDetails",
        JSON.stringify(productDetails)
      );
    }
    return () => {
      localStorage.removeItem("selectedProductDetails");
    };
  }, [product]);

  const handleBookAppointment = () => {
    if (!product?.c_brandName) {
      return;
    };

    const brandName = product.c_brandName.toLowerCase();
    let brand = product.c_brandName;

    if (brandName.includes("rolex certified pre-owned")) {
      brand = "Rolex Certified Pre-Owned";
    } else if (brandName.includes("rolex")) {
      brand = "Rolex";
    }

    localStorage.setItem("selectedWatches", JSON.stringify([brand]));
    localStorage.setItem("isFromPdp", JSON.stringify(window.location.href));

    router.push("/book-an-appointment");
  };

  const getColorVariations = (product) => {
    const colorAttribute = product.variationAttributes?.find(
      (attr) => attr.id === "color"
    );
    if (!colorAttribute) return [];

    return colorAttribute.values.map((value) => value.name);
  };

  const colorVariations = getColorVariations(product);

  const ImageSlide = ({ item }) => {
    return (
      <div onClick={() => setShowZoom(true)} className={styles.imgContainer}>
        <Image fill className={styles.image} alt={item?.alt} src={item?.link} />
      </div>
    );
  };

  const VideoSlide = ({ item }) => {
    return (
      <div className={styles.imgContainer}>
        <video
          loop
          muted
          autoPlay
          className={styles.videoPlayer}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={item?.videoLink1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const slides = useMemo(() => {
    return product?.imageGroups[0]?.images?.map((item, index) =>
      item?.videoLink1 ? (
        <VideoSlide item={item} key={index} />
      ) : (
        <ImageSlide item={item} key={index} />
      )
    );
  }, [product]);

  const openStoreLocator = () => {
    showStoreLocatorPopup(true);
    setIsMapLoaded(true);
  };

  useClickOutside(
    isCardOpen !== "careAndWarranty" ? handleCardToggle : null,
    "sideDrawer_content"
  );

  useCloseOnScroll(
    isCardOpen !== "careAndWarranty" ? isCardOpen : null,
    setCardOpen
  );

  
  const handleBack = () => {
    // Goes back to the previous page in history
    router.back();
  };

  const ExclusiveSection = ({ text }: { text: string }) => {
    return (
      <div className={styles.exclusive}>
        <ProductBadge tagText={text} />
      </div>
    );
  };

  const shouldShowWarrantyAndCare = () => {
    if (!product?.c_brandName) return false;

    const brandName = product.c_brandName.toLowerCase();
    return brandName.includes("rolex") || brandName.includes("jewellery");
  };

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    swiper?.slidePrev();
  };

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    swiper?.slideNext();
  };

  const isPrevDisabled = activeIndex === 0;
  const isNextDisabled = activeIndex === slides.length - 1;
  const handleCloseClick = (value) => {
    setShowPoup(value); // Set the clicked store as active
  };
  const { language } = useContext(LanguageContext)

  const texts = productDetailStaticData[language]

  const isRolexCpo = product?.c_brandName?.toLowerCase() === "rolex cpo";
  const reference = isRolexCpo ? product?.c_alternateReferenceNo : product?.id;

  return (
    <>
      <div className={styles.container}>
        {showZoom && (
          <ProductImageFullScreen
            listitems={product?.imageGroups[0]?.images}
            setShowZoom={setShowZoom}
            activeImage={activeIndex}
          />
        )}
        {isMobile && (
          <div className={styles.backBtn} onClick={() => handleBack()}>
            <ArrowRight /> <span>{texts?.backLabel || "Back"}</span>
          </div>
        )}
        <div className={styles.carousel} onClick={() => setShowZoom(true)} >
        <Carousel
            setTransition={""}
            setSpeed={500}
            isAnimated={"no"}
            slides={slides}
            setSwiper={setSwiper}
            setActiveIndex={setActiveIndex}
          />
          {windowWidth > 1036 && (
            <div className={styles.exclusive}>
              <ProductBadge
                tagText={
                  orderable
                    ? representedProduct?.c_edition
                      ? representedProduct?.c_edition
                      : ""
                    : "Sold Out"
                }
              />
            </div>
          )}
          {/* <div className={styles.sliderBtns}>
            <div
              className={`${styles.leftBtn} ${
                isPrevDisabled ? styles.disabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();        
                if (!isPrevDisabled) goPrev();
              }}
            >
              <ArrowRight className={styles.arrowLeft} />
            </div>

            <div
              className={`${styles.rightBtn} ${
                isNextDisabled ? styles.disabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();    
                if (!isNextDisabled) goNext();
              }}
            >
              <ArrowRight className={styles.arrowRight} />
            </div>
          </div> */}

          <div onClick={() => setShowZoom(true)} className={styles.plus}>
            <PlusIcon />
          </div>
          {/*}
          <div className={styles.threesixty}>
            <CubeIcon />
            <span className={styles.degree}>360°</span>
          </div>
          */}
          <div className={styles.carouselBtns}>
            <CarouselBtns
              slides={slides}
              activeIndex={activeIndex}
              swiper={swiper}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.productDetails}>
            <div className={styles.productHead}>
              <div className={styles.brand}>
                {orderable ? (
                  representedProduct?.c_edition && (
                    <ExclusiveSection text={representedProduct?.c_edition} />
                  )
                ) : (
                  <ExclusiveSection text={texts?.soldOutLabel || "Sold Out"} />
                )}
                <span>{product?.c_brandName}</span>
              </div>
              <div className={styles.title}>{product?.c_model}</div>
              {/*
              <div className={styles.price}>
                {product?.currency} {product?.price}
              </div>
              */}
            </div>
            {/*
            <div className={styles.Variant}>
              <div className={styles.size}>
                <div className={styles.label} onClick={() => setSizeSelectorOpen(true)}>
                {selectedSize ? selectedSize : "Select Size"} 
                </div>
                <ArrowRight />
              </div>
              <div className={styles.color}>
                <div className={styles.label}  onClick={() => setColorSelectorOpen(true)}>
                {selectedColor ? selectedColor : "Select Color"} 
                </div>
                <ArrowRight />
              </div>
            </div>
            */}
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}
            {/* {storeId && orderable && ( */}
              <Button
                isLink={false}
                link={""}
                className={styles.boutiqueBtn}
                title={
                  product?.c_brandName?.toLowerCase().includes("rolex")
                    ? "FIND A ROLEX BOUTIQUE"
                    : "FIND IN BOUTIQUE"
                }
                color="metallic"
                type={"solid"}
                clickHandler={openStoreLocator}
                disabled={orderable ? false : true}
              />
            {/* )} */}
            {/* <div className={styles.appointment}>
              {storeId && orderable && (
                <div className={styles.appointmentLeft}>
                  <CalendarIcon fill="#" />
                  <Button
                    isLink={false}
                    link={"/"}
                    className={styles.appointmentBtn}
                    title={texts?.bookAppointmentLabel  || "Book An Appointment"}
                    color="black_dark"
                    type={"Plain"}
                    clickHandler={handleBookAppointment}
                  />
                </div>
              )}
              <button
                className={styles.shareButton}
                onClick={() => handleCloseClick(true)}
              >
                <ShareIcon />
              </button>
            </div> */}
            <div className={styles.productText}>
              <div className={styles.productLabel}>Product Description</div>
              <div className={styles.productDesc}>
                {product?.shortDescription}

                {/*
                <Button
                  link={"/"}
                  className={styles.readMore}
                  title={"Read More"}
                  color="black_dark"
                  type={"plain"}
                  clickHandler={() => handleCardToggle("description")}
                />*/}
              </div>
            </div>
            {(editorsView || product?.longDescription) &&
              isCardOpen === "description" && (
                <ProductDescriptionFlyoutCard
                  isDescriptionCardOpen={isCardOpen === "description"}
                  setDescriptionCardOpen={() => handleCardToggle("description")}
                  editorsView={editorsView}
                  product={product}
                />
              )}

            {warrantyData && isCardOpen === "careAndWarranty" && (
              <ProductCareAndWarrantyFlyoutCard
                isCareAndWarrantyCardOpen={isCardOpen === "careAndWarranty"}
                setCareAndWarrantyCardOpen={() =>
                  handleCardToggle("careAndWarranty")
                }
                warrantyAndCare={warrantyData}
              />
            )}
            {/*shippingData && isCardOpen === "shipping" && (
              <ProductShippingDetailsFlyoutCard
                isShippingCardOpen={isCardOpen === "shipping"}
                setShippingCardOpen={() => handleCardToggle("shipping")}
                shippingDetails={shippingData}
              />
            )*/}
            <div>
              {`${texts?.productReferenceLabel || "Product Reference:"} ${reference}`}
            </div>
            <div
              className={`${!editorsView && styles.noEditView} ${
                styles.bottom
              }`}
            >
              {editorsView && (
                <>
                  <div
                    onClick={() => handleCardToggle("description")}
                    className={styles.tab}
                  >
                    {texts?.editorsViewLabel || "Editors View"}
                  </div>
                  <div className={styles.vline}>&nbsp;</div>
                </>
              )}

              {shouldShowWarrantyAndCare() && (
                <div
                  onClick={() => handleCardToggle("careAndWarranty")}
                  className={styles.tab}
                >
                  {texts?.warrantyAndCareLabel || "Warranty & Care" }
                </div>
              )}
            </div>

            <Popup
              showPopup={showPopup}
              handleCloseClick={handleCloseClick}
              className={styles.sharePopup}
            >
              <div className={styles.popupContainer}>
                <PopupContent
                  headerText={"LET YOUR FRIENDS DISCOVER AHMED SEDDIQI"}
                  subText={"Let your friends discover Ahmed Seddiqi"}
                />
              </div>
            </Popup>
          </div>
          {/*}
          <div className={styles.save}>
            <HeartIcon fill="#" />
          </div>
          */}
        </div>
        {/* Size Selector  */}

        <SizeGuideProvider sizeGuideData={sizeGuideData}>
          <SizeSelector
            isOpen={isSizeSelectorOpen}
            onClose={handleSizeGuideClose}
            productId={product.id}
            title={texts?.sizeLabel || "SIZE"}
            description={""}
            onSelectSize={handleSelectSize}
          />
        </SizeGuideProvider>

        {/* Color Selector  */}
        <ColorSelector
          isOpen={isColorSelectorOpen}
          onClose={handleColorSelectorClose}
          title={texts?.colorLabel || "COLOR"}
          description={texts?.colorSelectorDescription ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum, velit sit amet consequat volutpat, nisl mauris mollis elit, nec gravida erat enim at tellus."
          }
          colorVariations={colorVariations}
          onSelectColor={handleSelectColor}
        />
      </div>

      {isMapLoaded && (
        <SideDrawer
          isOpen={storeLocatorPopup}
          onClose={() => showStoreLocatorPopup(false)}
          showFooter={false}
          onSubmit={null}
          onClearAll={null}
          showBackButton={false}
          title={texts?.findProductInBoutiqueLabel || "Find product in Boutique"}
          position={"right"}
          button2Color={"black_dark"}
        >

          <StoreLocator
            productImgAlt={product?.imageGroups[0]?.images[0].alt}
            productImgSrc={product?.imageGroups[0]?.images[0].link}
            productBrand={product?.c_brandName}
            productName={product?.c_model}
            productPrice={product?.price}
            productCurrency={product?.currency}
            productStoreIds={product?.c_storeId}
          />
          
        </SideDrawer>
      )}

      <ScrollToTop />
    </>
  );
};

export default ProductDetailInfo;
