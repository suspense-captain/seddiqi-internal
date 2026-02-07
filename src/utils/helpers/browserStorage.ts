//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

// Get item from sessionStorage
export const getItemFromSession = (key: string) => {
  if (isBrowser()) {
    const item = window.sessionStorage.getItem(key);
    if (!!item && item !== "undefined" && item !== "null") {
      return JSON.parse(item);
    } else {
      return undefined;
    }
  }
};

// Set item from sessionStorage
export const setItemInSession = (key: string, data: any) => {
  window.sessionStorage.setItem(key, JSON.stringify(data));
};

// Remove item from  sessionStorage
export const removeItemFromSession = (key: string) => {
  window.sessionStorage.removeItem(key);
};

// Get Item from Local Storage
export const getItemFromLocal = (key: string) => {
  if (isBrowser()) {
    const item = window.localStorage.getItem(key);
    if (!!item && item !== "undefined" && item !== "null") {
      return JSON.parse(item);
    } else {
      return undefined;
    }
  }
};

// Set item from  Local Storage
export const setItemInLocal = (key: string, data: any) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

// Remove item from   Local Storage
export const removeItemFromLocal = (key: string) => {
  window.localStorage.removeItem(key);
};
