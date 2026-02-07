export function visibility(style: CSSStyleDeclaration, visibility: "hidden" | "visible" | number) {
    if (typeof visibility === "number") {
      style.opacity = `${visibility}`;
    } else {
      style.opacity = visibility === "hidden" ? "0" : "1";
    }
  }
  
  type Unit = "%" | "vw" | "vh" | "px" | "rem";
  
  export function translateX(style: CSSStyleDeclaration, number: number, unit: Unit = "%") {
    style.transform = `translateX(${number}${unit})`;
  }
  
  export function translateY(style: CSSStyleDeclaration, number: number, unit: Unit = "%") {
    style.transform = `translateY(${number}${unit})`;
  }