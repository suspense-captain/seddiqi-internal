export function constructAmplienceImageUrl(imageObject) {  
  if (
    !imageObject ||
    !imageObject.name ||
    !imageObject.endpoint ||
    !imageObject.defaultHost
  ) {
    return null;
  }

  if (imageObject?.mimeType === "image/svg+xml") {
    const encodedName = encodeURIComponent(imageObject.name);
    const svgUrl = `https://seddiqi.a.bigcontent.io/v1/static/${encodedName}`;
    return svgUrl;
  }
  const encodedName = encodeURIComponent(imageObject.name);
  const baseUrl = `https://${imageObject.defaultHost}/i/${imageObject.endpoint}/${encodedName}`;
  return baseUrl;
}
