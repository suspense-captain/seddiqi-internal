
/** This is a sample transform function **/
export const transformProduct = (data: any) => {
  const response = data
    ? {
        title: data?.title ?? "",
        description: data?.description ?? "",
      }
    : null;

  return response;
};

/** Product Price Graph transform function **/
export const getProductPriceGraph = (data: any) => {
  const response = data;
  // Extract prices from the product objects
  const prices = response.hits.map(product => product.price);

  // Set minimum price to zero and calculate the maximum price
  const minPrice = 0;
  const maxPrice = Math.max(...prices);

  // number of bins (ranges)
  const binWidth = 50;
  const numBins = Math.ceil(maxPrice / binWidth);

  const priceRanges = {};
  for (let i = 1; i <= numBins; i++) {
      const upperBound = i * binWidth;
      priceRanges[upperBound] = 0;  // Initialize frequency to 0 for each bin
  }

  // Count the frequency of products in each price bin
  prices.forEach(price => {
      for (const upperBound in priceRanges) {
          if (price <= parseInt(upperBound)) {
              priceRanges[upperBound]++;
              break;
          }
      }
  });


  return priceRanges;
};

/** Product price refinement transform function **/
export const transformPriceRefinement = (response : any) => {
  const transformedResponse = JSON.parse(JSON.stringify(response));
  
  // get "price" refinement and transform its "values"
  transformedResponse.refinements = transformedResponse.refinements.map((refinement) => {
    if (refinement.attributeId === "price") {
      const transformedValues = {};
      if (refinement.values) {
        refinement.values.forEach((priceRange) => {
          const upperLimitMatch = priceRange.value.match(/\.\.(\d+)/);
          if (upperLimitMatch) {
            const upperLimit = parseInt(upperLimitMatch[1], 10);
            transformedValues[upperLimit] = priceRange.hitCount;
          }
        });
      }

      refinement.values = transformedValues;
    }
    return refinement;
  });

  return transformedResponse;
}
