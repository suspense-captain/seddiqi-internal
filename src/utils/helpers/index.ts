import { useEffect } from "react";

// custom Hook for automatic abortion on unmount or dependency change
// You might add onFailure for promise errors as well.
export const useAsync = (asyncFn: any, onSuccess: any) => {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((data: any) => {
      if (isActive) onSuccess(data);
      else {
        console.debug("aborted setState on unmounted component");
      }
    });
    return () => {
      isActive = false;
    };
  }, [asyncFn, onSuccess]);
};

export const notNull = (x: any) => x != null;
export const mapToID = (x: any) => ({ id: x.id });

const sizeof = require("object-sizeof");
export function objectToSize(obj: any) {
  const bytes = sizeof(obj);
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

/**
 * Deletes undefined properties and nullifies undefined array items.
 * Useful to perform before JSON stringify.
 * Only use if the object structure is not recursive.
 */
export function clearUndefined(root: any): any {
  if (root != null) {
    if (Array.isArray(root)) {
      for (let i = 0; i < root.length; i++) {
        const child = root[i];
        if (child == null) {
          root[i] = null;
        } else {
          clearUndefined(child);
        }
      }
    } else if (typeof root === "object") {
      const keys = Object.keys(root);

      for (const key of keys) {
        const child = root[key];

        if (child == null) {
          if (child === undefined) {
            delete root[key];
          }
        } else {
          clearUndefined(child);
        }
      }
    }
  }

  return root;
}

export const isEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
};

export const isKSALocale = (locale) => {
  if (!locale.includes("SA")) {
    return false;
  }

  return true;
};


export function standardizeLocale(locale: string): string {
  if (!locale || typeof locale !== "string") return undefined;

  const parts = locale.toLowerCase().split(/[-_]/); // handle 'en_ae' or 'en-ae'
  if (parts.length === 1) return parts[0];

  const [lang, country] = parts;
  const transformedLocale = `${lang}-${country.toUpperCase()}`

  return transformedLocale;
}

export function getLocalePrefix(locale?: string, defaultLocale?: string): string {
  const current = standardizeLocale(locale || "");
  const defaultL = standardizeLocale(defaultLocale || "");

  return current && current.toLowerCase() !== defaultL.toLowerCase() ? `${current}/`.toLowerCase() : "";
}

export const sanitizeInput = (value: string): string => {
  return value
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')    // remove all HTML tags
    .replace(/(\r|\n|%0A|%0D)/g, '')   // remove line breaks and encoded newlines
    .trim();
};

export const sanitizeHtmlInput = (value: string): string => {
  return String(value)
    .replace(/&/g, '&amp;')   // escape &
    .replace(/</g, '&lt;')    // escape <
    .replace(/>/g, '&gt;')    // escape >
    .replace(/"/g, '&quot;')  // escape "
    .replace(/'/g, '&#039;')  // escape '
    .replace(/(\r|\n|%0A|%0D)/g, ' '); // remove newlines and encoded line breaks
};
