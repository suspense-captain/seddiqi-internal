import React, { useEffect, useState } from "react";
import { getProductListing } from "@utils/sfcc-connector/dataService";
import Collections from "../collections";
import { Loader } from "@components/module";

const CollectionsContainer = ({...content}) => {
    if (!content) return null;
    
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const categoryId = "rolex";

    useEffect(() => {
        const fetchProductListing = async () => {
        try {
            setLoading(true);

            const response = await getProductListing({
            categoryId, // passing categoryId here
            method: 'POST',
            currentPage: 1, // assuming the first page
            });
            setProducts(response);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);            
        }
        };

        fetchProductListing();
    }, []); // Re-run the effect if categoryId changes


    if (loading) return <Loader />;

    return (
        <Collections products={products} content={content} />
    );

}


export default CollectionsContainer;
