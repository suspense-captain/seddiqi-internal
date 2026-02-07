import { HeartIcon } from "@assets/images/svg";
import React, { useEffect, useState } from "react";
import styles from "./wishlistButton.module.scss";
import { addProductToWishlist, getWishlist, removeProductFromWishlist } from "@utils/sfcc-connector/dataService";

export interface WishlistButtonProps {
  itemId: string;
  accessToken: string;
  customerId: string;
}

const WishlistButton = ({ itemId, accessToken, customerId }: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true); 
  
  const checkLocalStorageForWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return storedWishlist.includes(itemId);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlist = await getWishlist({ customerId, access_token: accessToken, method: "GET" });
        const wishlistItems = wishlist.response.data[0]?.customerProductListItems || [];
        const matchingItem = wishlistItems.find(item => item.productId === itemId);

        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (matchingItem && !storedWishlist.includes(itemId)) {
          storedWishlist.push(itemId);
          localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
        }

        setIsInWishlist(!!matchingItem || storedWishlist.includes(itemId));
      } catch (error) {
        console.error("Error fetching wishlist:", error);

        setIsInWishlist(checkLocalStorageForWishlist());
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [customerId, accessToken, itemId]);

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeProductFromWishlist({ customerId, access_token: accessToken, method: "DELETE", productId: itemId });

        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = storedWishlist.filter(id => id !== itemId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        await addProductToWishlist({ customerId, access_token: accessToken, method: "POST", productId: itemId });
        
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        storedWishlist.push(itemId);
        localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
      }

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error(`Error ${isInWishlist ? 'removing' : 'adding'} item to wishlist:`, error);
    }
  };

  if (loading) {
    return <div className={styles.loader}></div>; 
  }

  return (
    <div className={styles.wishlistButtonWrapper}>
      <button className={styles.heartButton} onClick={handleToggleWishlist}>
        <HeartIcon fill={isInWishlist ? "#000" : "#"} />
      </button>
    </div>
  );
};

export default WishlistButton;
