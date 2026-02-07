const isObject = (object) =>
  typeof !!object && object === "object" && !Array.isArray(object);


export const removeEmptyObjectsByKeys = (object) => {

  if (!isObject(object)) return;

  let newObject = {};
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });
  return object;
};


export const filterObjectRemoveEmptyKey = (filters) => {

    let newObject = {};
    Object.keys(filters).forEach((key) => {
  
      if (filters[key] === null || filters[key].length === 0) {
        delete filters[key];
      }
      
    });
    return filters;
}
