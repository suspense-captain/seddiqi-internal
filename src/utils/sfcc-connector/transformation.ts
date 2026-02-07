import { TechSpecsData } from "@utils/models/pdpTabs";

function getStrapDescription(data) {
  if (data.hasOwnProperty("c_strapDescription")) {
    return data.c_strapDescription;
  }

  if (data.hasOwnProperty("c_braceletDescription")) {
    return data.c_braceletDescription;
  }

  return null;
}

function getMaterialDescription(data) {
  if (data.hasOwnProperty("c_strapMaterial")) {
    return data.c_strapMaterial;
  }

  if (data.hasOwnProperty("c_braceletMaterial")) {
    return data.c_braceletMaterial;
  }

  return null;
}

const transformTechSpecsDetails = (data: any): TechSpecsData => {
  const isWatches = data?.c_groupName?.toLowerCase().includes("watch") || data?.c_groupName?.toLowerCase().includes("clock");

  return {
    tabsData: [
      {
        id: 1,
        tabTitle: "Dial",
        specs: [
          {
            title: "Dial Type",
            description: data.hasOwnProperty("c_dialType")
              ? data.c_dialType
              : null,
          },
          {
            title: "Dial Material",
            description: data.hasOwnProperty("c_dialMaterial")
              ? data.c_dialMaterial
              : null,
          },
        ],
        productImageUrl: data.hasOwnProperty("c_caseTabImage")
          ? data.c_caseTabImage
          : data.imageGroups[0]?.images[0]?.link,
      },
      {
        id: 2,
        tabTitle: "Movement",
        specs: [
          {
            title: "Movement",
            description: data.hasOwnProperty("c_movement1")
              ? data.c_movement1
              : null,
          },
          {
            title: "Complication",
            description: data.hasOwnProperty("c_complication1")
              ? data.c_complication1
              : null,
          },
        ],
        productImageUrl: data.hasOwnProperty("c_movementTabImage")
          ? data.c_movementTabImage
          : data.imageGroups[0]?.images[0]?.link,
      },
      {
        id: 3,
        tabTitle: "Case",
        specs: [
          {
            title: "Case Diameter",
            description: data.hasOwnProperty("c_size")
              ? data.c_size + " mm"
              : null,
          },
          {
            title: "Water Resistance",
            description: data.hasOwnProperty("c_waterResistanceDepth")
              ? data.c_waterResistanceDepth
              : null,
          },
        ],
        productImageUrl: data.hasOwnProperty("c_dialTabImage")
          ? data.c_dialTabImage
          : data.imageGroups[0]?.images[0]?.link,
      },
      {
        id: 4,
        tabTitle: "Bracelet",
        specs: [
          {
            title: "Strap Details",
            description: getStrapDescription(data),
          },
          {
            title: "Strap Material",
            description: getMaterialDescription(data),
          },
        ],
        productImageUrl: data.hasOwnProperty("c_braceletTabImage")
          ? data.c_braceletTabImage
          : data.imageGroups[0].images.length >= 3
          ? data.imageGroups[0]?.images[data.imageGroups[0].images.length - 1]
              ?.link
          : null,
      },
    ],
    category: data.c_groupName || null,
    specsData: [
      {
        mainTitle: "DETAIL SPECIFICATIONS",
        specs: [
          {
            id: 1,
            specsTitle: "Dial",
            items: [
              {
                id: 1,
                itemTitle: "Dial Color",
                itemDescription: data.hasOwnProperty("c_dialColour")
                  ? data.c_dialColour
                  : null,
              },
              {
                id: 2,
                itemTitle: "Dial Material",
                itemDescription: data.hasOwnProperty("c_dialMaterial")
                  ? data.c_dialMaterial
                  : null,
              },
              {
                id: 3,
                itemTitle: "Dial Index",
                itemDescription: data.hasOwnProperty("c_dialFigure")
                  ? data.c_dialFigure
                  : null,
              },
              {
                id: 4,
                itemTitle: "Glass Material",
                itemDescription: data.hasOwnProperty("c_glass")
                  ? data.c_glass
                  : null,
              },
              {
                id: 5,
                itemTitle: "Dial Stone Details",
                itemDescription: data.hasOwnProperty("c_dialTypeOfStones1")
                  ? data.c_dialTypeOfStones1
                  : null,
              },
            ],
          },
          {
            id: 2,
            specsTitle: "Movement",
            items: [
              {
                id: 1,
                itemTitle: "Movement",
                itemDescription: data.hasOwnProperty("c_movement1")
                  ? data.c_movement1
                  : null,
              },
              {
                id: 2,
                itemTitle: "Complication",
                itemDescription: data.hasOwnProperty("c_complication1")
                  ? data.c_complication1
                  : null,
              },
              {
                id: 3,
                itemTitle: "Power Reserve",
                itemDescription: data.hasOwnProperty("c_powerReserve")
                  ? data.c_powerReserve
                  : null,
              },
              {
                id: 4,
                itemTitle: "Caliber",
                itemDescription: data.hasOwnProperty("c_movementCalibre")
                  ? data.c_movementCalibre
                  : null,
              },
            ],
          },
          {
            id: 3,
            specsTitle: "Case",
            items: [
              {
                id: 1,
                itemTitle: "Case Material",
                itemDescription: data.hasOwnProperty("c_caseMaterial")
                  ? data.c_caseMaterial
                  : null,
              },
              {
                id: 2,
                itemTitle: "Case Diameter",
                itemDescription: data.hasOwnProperty("c_size")
                  ? data.c_size + " mm"
                  : null,
              },
              {
                id: 3,
                itemTitle: "Water Resistance",
                itemDescription:
                  data.c_waterResistance === true
                    ? data.c_waterProofDepthnumber
                    : "",
              },
              {
                id: 4,
                itemTitle: "Bezel Type",
                itemDescription: data.hasOwnProperty("c_bezelType")
                  ? data.c_bezelType
                  : null,
              },
              {
                id: 5,
                itemTitle: "Bezel Material",
                itemDescription: data.hasOwnProperty("c_braceletMaterial")
                  ? data.c_braceletMaterial
                  : null,
              },
            ],
          },
          {
            id: 4,
            specsTitle: "Bracelet",
            items: [
              {
                id: 1,
                itemTitle: "Strap Details",
                itemDescription: getStrapDescription(data),
              },
              {
                id: 2,
                itemTitle: "Strap Material",
                itemDescription: getMaterialDescription(data),
              },
              {
                id: 3,
                itemTitle: "Buckle Type",
                itemDescription: data.hasOwnProperty("c_buckleType")
                  ? data.c_buckleType
                  : null,
              },
              {
                id: 4,
                itemTitle: "Original Accessories",
                itemDescription: data.hasOwnProperty("c_accessories")
                  ? data.c_accessories
                  : null,
              },
              {
                id: 5,
                itemTitle: "Strap Lock",
                itemDescription: data.hasOwnProperty("c_typeOfLock")
                  ? data.c_typeOfLock
                  : null,
              },
            ],
          },
        ],
      },
    ],
    nonTabSpecsData: isWatches
      ? [
          {
            nonTabSpecs: [
              {
                id: 1,
                items: [
                  {
                    id: 1,
                    specsTitle: "Dial Color",
                    specsDescription: data.hasOwnProperty("c_dialColour")
                      ? data.c_dialColour
                      : null,
                  },
                ],
              },
              {
                id: 2,
                items: [
                  {
                    id: 1,
                    specsTitle: "Movement",
                    specsDescription: data.hasOwnProperty("c_movement1")
                      ? data.c_movement1
                      : null,
                  },
                ],
              },
              {
                id: 3,
                items: [
                  {
                    id: 1,
                    specsTitle: "Case Material",
                    specsDescription: data.hasOwnProperty("c_caseMaterial")
                      ? data.c_caseMaterial
                      : null,
                  },
                ],
              },
              {
                id: 4,
                items: [
                  {
                    id: 1,
                    specsTitle: "Dial Material",
                    specsDescription: data.hasOwnProperty("c_dialMaterial")
                      ? data.c_dialMaterial
                      : null,
                  },
                ],
              },
              {
                id: 5,
                items: [
                  {
                    id: 1,
                    specsTitle: "Complication",
                    specsDescription: data.hasOwnProperty("c_complication1")
                      ? data.c_complication1
                      : null,
                  },
                ],
              },
              {
                id: 6,
                items: [
                  {
                    id: 1,
                    specsTitle: "Strap Material",
                    specsDescription: getMaterialDescription(data),
                  },
                ],
              },
            ],
          },
        ]
      : [
          {
            nonTabSpecs: [
              {
                id: 1,
                items: [
                  {
                    id: 1,
                    specsTitle: "Collection",
                    specsDescription: data.hasOwnProperty("c_family")
                      ? data.c_family
                      : null,
                  },
                ],
              },
              {
                id: 2,
                items: [
                  {
                    id: 1,
                    specsTitle: "Metal",
                    specsDescription: data.hasOwnProperty("c_productMetal")
                      ? data.c_productMetal
                      : null,
                  },
                ],
              },
              {
                id: 3,
                items: [
                  {
                    id: 1,
                    specsTitle: "Gem Stone",
                    specsDescription: data.hasOwnProperty("c_karat")
                      ? data.c_karat
                      : null,
                  },
                ],
              },
            ],
          },
        ],
  };
};

export { transformTechSpecsDetails };
