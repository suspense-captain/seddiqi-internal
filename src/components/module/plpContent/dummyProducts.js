export const dummyProducts = (limit = 100) => {
  const baseProduct = {
    assignedCategories: [
      {
        catalogId: "apparel-m-catalog",
        categoryId: "mens-clothing-suits",
      },
      {
        catalogId: "storefront-catalog-m-en",
        categoryId: "mens-clothing-dress-shirts",
      },
      {
        catalogId: "storefront-catalog-m-non-en",
        categoryId: "mens-clothing-dress-shirts",
      },
    ],
    ats: 3600,
    classificationCategory: {
      catalogId: "apparel-m-catalog",
      categoryId: "mens-clothing-suits",
    },
    creationDate: "2024-06-03T08:04:11.000Z",
    id: "25604455M",
    image: {
      absUrl:
        "https://bldb-001.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-apparel-m-catalog/default/v9226098489a8093409fb6fd9c7548a41967685ca/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg",
      alt: {
        default: "No-Iron Textured Dress Shirt, , large",
      },
      disBaseUrl:
        "https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BLDB_001/on/demandware.static/-/Sites-apparel-m-catalog/default/v9226098489a8093409fb6fd9c7548a41967685ca/images/large/PG.15J0037EJ.WHITEFB.PZ.jpg",
      path: "large/PG.15J0037EJ.WHITEFB.PZ.jpg",
      title: {
        default: "No-Iron Textured Dress Shirt, ",
      },
    },
    inStock: true,
    lastModified: "2024-06-03T08:04:55.000Z",
    longDescription: {
      default: {
        markup:
          "This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.",
        source:
          "This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.",
      },
    },
    name: {
      default: "No-Iron Textured Dress Shirt",
    },
    online: true,
    price: 49.99,
    priceCurrency: "USD",
    pricePerUnit: 49.99,
    primaryCategories: [
      {
        catalogId: "apparel-m-catalog",
        categoryId: "mens-clothing-suits",
      },
    ],
    primaryCategoryId: "mens-clothing-dress-shirts",
    shortDescription: {
      default: {
        markup:
          "This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.",
        source:
          "This cotton dress shirt is available in white or blue. Both colors are a wardrobe necessity.",
      },
    },
    type: {
      master: true,
    },
  };
 
  const hits = Array.from({ length: limit }, (_, i) => ({
    ...baseProduct,
    id: `25604455M${i}`,  
    name: {
      default: `No-Iron Textured Dress Shirt - Style ${i + 1}`,
    },  
    price: (Math.random() * 100).toFixed(2),  
  }));

  return {
    limit: limit,
    hits: hits,
    query: {
      TermQuery: {
        fields: ["categoryId"],
        operator: "is",
        values: ["mens-clothing-suits"],
      },
    },
    sorts: [
      {
        field: "creationDate",
        sortOrder: "desc",
      },
    ],
    offset: 0,
    total: limit,
  };
};
