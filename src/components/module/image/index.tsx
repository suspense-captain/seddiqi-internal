import React, { useEffect, useState } from "react";
import { CmsContent } from "@utils/cms/utils";
import {
  ImageTransformations,
  getImageURL,
} from "@utils/cms/helpers/getImageUrl";

type ImageProps = {
  image: any;
  query?: any;
  format?: string;
  imageAltText?: string;
  di?: string;
  imgWidth?: string;
  poiAspect?: { sm: string; md: string; lg: string; xl: string };
} & CmsContent;

const Image = ({
  display,
  image,
  imageAltText,
  seoText,
  di = "",
  query,
  className,
  height,
  imgWidth,
  poiAspect,
}: ImageProps) => {
  if (!image) {
    return null;
  }

  const [getImage, setImage] = useState(image || null);

  let baseUrl = `https://${image.defaultHost}/i/${
    image.endpoint
  }/${encodeURIComponent(image.name)}`;

  const resolvedDisplay =
    image?.mimeType === "image/svg+xml" ? "Static" : display;

  useEffect(() => {
    fetch(baseUrl + ".json?metadata=true&metaFilter=pointOfInterest", {
      cache: "force-cache",
    })
      .then((res) => res.json())
      .then((data) => {
        setImage({ ...image, ...data });
      })
      .catch((error) => {
        error.json().then((json: any) => {
          console.log(json);
        })
      });
  }, [setImage, baseUrl]);

  const buildSrcUrl = ({ width, poiAspect, format }: any) => {
    let baseUrl = `https://${getImage.defaultHost}/i/${
      getImage.endpoint
    }/${encodeURIComponent(getImage.name)}`;
    const transformations: ImageTransformations = {};

    if (seoText) {
      baseUrl += `/${encodeURIComponent(seoText)}`;
    }

    transformations.width = width;
    transformations.upscale = false;
    transformations.strip = true;
    let queryString = "";

    if (getImage.metadata && getImage.metadata.pointOfInterest && poiAspect) {
      transformations.aspectRatio = poiAspect;
      queryString += `poi=${getImage.metadata.pointOfInterest.x},${getImage.metadata.pointOfInterest.y},${getImage.metadata.pointOfInterest.w},${getImage.metadata.pointOfInterest.h}&scaleFit=poi&sm=aspect`;
    }
    if (query) {
      queryString += `&${query}`;
    }

    const url = getImageURL(
      `${baseUrl}?${queryString}`,
      transformations,
      false,
      di
    );

    return url;
  };

  const source = ({
    minWidth,
    maxWidth,
    width,
    highDensityWidth,
    format,
    poiAspect,
  }: any) => {
    return (
      <source
        srcSet={`${buildSrcUrl({ width, format, poiAspect })} 1x, ${buildSrcUrl(
          {
            width: highDensityWidth,
            format,
            poiAspect,
          }
        )}`}
        media={
          minWidth
            ? `(min-width: ${minWidth}px)`
            : maxWidth
            ? `(max-width: ${maxWidth}px)`
            : undefined
        }
        type={format ? `image/${format}` : undefined}
      />
    );
  };

  const imageTag =
    resolvedDisplay == "Static" ? (
      <picture className="amp-dc-image">
        <img
          loading="lazy"
          src={`//${getImage.endpoint}.a.bigcontent.io/v1/static/${getImage.name}`}
          className={`${className} amp-dc-image-pic`}
          alt={imageAltText}
          title={seoText}
        />
      </picture>
    ) : (
      <picture className="amp-dc-image">
        {/* High density widths selected to be below max avif image size at aspect ratio. (2.5mil pixels) */}
        {source({
          minWidth: "1280",
          width: "1500",
          highDensityWidth: "2234",
          poiAspect: poiAspect && poiAspect.xl ? poiAspect.xl : "2:1",
        })}
        {source({
          minWidth: "1024",
          width: "1280",
          highDensityWidth: "2234",
          poiAspect: poiAspect && poiAspect.lg ? poiAspect.lg : "2:1",
        })}
        {source({
          minWidth: "768",
          width: "1024",
          highDensityWidth: "1920",
          poiAspect: poiAspect && poiAspect.md ? poiAspect.md : "1.5:1",
        })}
        {source({
          maxWidth: "768",
          width: "768",
          highDensityWidth: "1536",
          poiAspect: poiAspect && poiAspect.sm ? poiAspect.sm : "1:1",
        })}

        <img
          loading="lazy"
          src={buildSrcUrl({})}
          className={`${className} amp-dc-image-pic`}
          alt={imageAltText}
          title={seoText}
        />
      </picture>
    );

  return (
    <div
      className={height}
      style={{ position: "relative", width: imgWidth ? imgWidth : "auto" }}
    >
      {imageTag}
    </div>
  );
};

export default Image;
