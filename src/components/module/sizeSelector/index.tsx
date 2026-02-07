import React, { useEffect, useState, useContext } from "react";
import styles from "./sizeSelector.module.scss";
import Typography from "../typography";
import SideDrawer from "../sideDrawer";
import { Button } from "@components/module";
import { getProducts } from "@utils/sfcc-connector/dataService";
import SizeGuide from "@components/module/sizeGuide";
import { SizeSelectorProps } from "@utils/models/sizeSelector";
import { useSizeGuideProviderContext } from "@contexts/sizeGuideSelectorContext";

const SizeSelector: React.FC<SizeSelectorProps> = ({
  title,
  description,
  onClose,
  isOpen,
  productId,
  onSelectSize,
}) => {
  const { sizeGuideData } = useSizeGuideProviderContext();
  const sizeGuideContent = sizeGuideData?.content?.page;

  if(!sizeGuideContent) {
    return null;
  }
  
  const sizeGuidedeliveryKey = sizeGuideContent._meta?.deliveryKey;

  const [gender, setGender] = useState<"gents" | "ladies" | "unisex" | null>(
    null
  );
  const [longDescription, setLongDescription] = useState<string>("");
  const [sizeSelectorVariants, setSizeSelectorVariants] = useState<string[]>(
    []
  );
  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideInfo, setSizeGuideInfo] = useState({
    primaryTitle: "",
    primaryDescription: "",
    secondaryTitle: "",
    secondaryDescription: "",
    items: [],
    category: "watches",
    gender: "gents",
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const data = await getProducts({ pids: productId, method: "GET" });
          const product = data?.data?.find((p: any) => p.id === productId);

          if (product) {
            const productGender = product?.c_gender?.toLowerCase();
            const category = product?.c_categoryName?.toLowerCase();

            setGender(productGender);
            setProductCategory(category);
            setLongDescription(product?.longDescription || "");

            const sizes = product.variants
              .map((item) => item.variationValues?.size)
              .filter((size) => size)
              .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

            setSizeSelectorVariants(sizes);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  const openSizeGuide = () => {
    // Extract the last part of the deliveryKey to determine the size guide
    const sizeGuideDeliveryKeyParts = sizeGuidedeliveryKey?.split("/");
    const sizeGuideKey = sizeGuideDeliveryKeyParts?.[1];
    let sizeGuideDataToUse;

    if (sizeGuideKey === "gents-watches") {
      sizeGuideDataToUse = sizeGuideData;
    } else if (sizeGuideKey === "ladies-watches") {
      sizeGuideDataToUse = sizeGuideData;
    } else {
      console.error(
        "Size guide data is undefined for gender-category:",
        sizeGuideKey
      );
      return;
    }

    const { content } = sizeGuideDataToUse;
    if (!content) {
      console.error(
        "Content is undefined in size guide data:",
        sizeGuideDataToUse
      );
      return;
    }

    const { page } = content;
    const {
      primaryTitle,
      primaryDescription,
      secondaryTitle,
      secondaryDescription,
      productSizes: items,
    } = page;

    // Set the SizeGuide data and open it
    setSizeGuideInfo({
      primaryTitle,
      primaryDescription,
      secondaryTitle,
      secondaryDescription,
      items,
      category: productCategory,
      gender: gender || "gents", // Default to gents if not set
    });
    setIsSizeGuideOpen(true);
  };

  const renderSizeGuideLinks = () => {
    if (productCategory === "watches" || productCategory === "jewellery") {
      return (
        <Button
          className={styles.sizeGuideBtn}
          title={"Size Guide"}
          color="black_dark"
          type={"plain"}
          clickHandler={openSizeGuide}
        />
      );
    }
    return null;
  };
  const handleSizeClick = (size: string) => {
    onSelectSize(size);
    onClose(); 
  };

  return (
    <div className={styles.sizeSelectorWrapper}>
      <SideDrawer
        isOpen={isOpen}
        onClose={onClose}
        showFooter={false}
        showBackButton={false}
        position={"right"}
        title={title || "Size Selector"}
        onSubmit={null}
        onClearAll={null}
        className={""}
        button2Color={"black_dark"}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <Typography variant="p" className={styles.longDescription}>
              {longDescription}
            </Typography>
          </div>
          <div className={styles.sizeTabWrapper}>
            {sizeSelectorVariants.length > 0 &&
              sizeSelectorVariants.map((size, index) => (
                <span key={index} className={styles.sizeTab} onClick={() => handleSizeClick(size)}>
                  {size}
                </span>
              ))}
          </div>
          <div className={styles.sizeInfoWrapper}>
            <span className={styles.findMySizeBtnWrapper}>
              <Button
                isLink={true}
                link={"/"}
                className={styles.findMySizeBtn}
                title={"Find My Size"}
                color="black_dark"
                type={"plain"}
              />
            </span>
            <span className={styles.sizeGuideBtnWrapper}>
              {renderSizeGuideLinks()}
            </span>
          </div>
          <hr className={styles.sizeSelectorDivider} />
        </div>
      </SideDrawer>

      {/* SizeGuide component */}
      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        primaryTitle={sizeGuideInfo.primaryTitle}
        primaryDescription={sizeGuideInfo.primaryDescription}
        secondaryTitle={sizeGuideInfo.secondaryTitle}
        secondaryDescription={sizeGuideInfo.secondaryDescription}
        items={sizeGuideInfo.items}
      />
    </div>
  );
};

export default SizeSelector;
