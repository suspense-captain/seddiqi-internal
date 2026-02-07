interface Calendly {
  closePopupWidget: () => void;
  destroyBadgeWidget: () => void;
  initBadgeWidget: (e: any) => void;
  initInlineWidget: (e: any) => void;
  initPopupWidget: (e: { url: string }) => void;
  showPopupWidget: (e: { url: string }, t?: string, o?: object) => void;
}

interface Window {
  google: any;
  Calendly: Calendly;
  dataLayer: any[];
}
