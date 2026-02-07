const headerTitleTranslationsObj = {
  story: "Other",
  display: "The Latest",
  default: "Latest Article",
};
const arabicHeaderTitleTranslations = {
  story: "أخرى",
  display: "الأحدث",
  default: "أحدث مقال",
};
export const headerTitleTranslations = {
  "en-ae": { ...headerTitleTranslationsObj },
  "en-sa": { ...headerTitleTranslationsObj },
  "ar-ae": { ...arabicHeaderTitleTranslations },
  "ar-sa": { ...arabicHeaderTitleTranslations },
};

const newsletterSignupObj = {
  title: "SUBSCRIBE TO NEWSLETTER",
  emailPlaceholder: "Email",
  subscribeButton: "Subscribe",
  privacyPolicyLabel:
    "I consent to receive occasional marketing communications and event invitations from Ahmed Seddiqi, its affiliates, and group companies via phone, email, SMS, or WhatsApp channels.",
  successMessage: "You have successfully subscribed to our newsletter",
  errorMessage: "Subscription failed, please try again",
  alreadySubscribedMessage: "You are already subscribed to our newsletter",
  invalidEmailMessage: "Please enter a valid email address.",
  agreeToPrivacyPolicyMessage: "Please agree to the Privacy Policy.",
  errorOccurredMessage: "An error occurred, please try again",
};
const arabicNewsletterSignup = {
  title: "اشترك في النشرة الإخبارية",
  emailPlaceholder: "البريد الإلكتروني",
  subscribeButton: "اشترك",
  privacyPolicyLabel:
    "أوافق على تلقي مراسلات تسويقية ودعوات للفعاليات من حين لآخر من شركة أحمد صِدّيقي والشركات التابعة لها وشركات المجموعة عبر الهاتف، أو البريد الإلكتروني، أو الرسائل النصية القصيرة، أو قنوات الواتساب.",
  successMessage: "تم الاشتراك في النشرة الإخبارية بنجاح",
  errorMessage: "فشل الاشتراك، يرجى المحاولة مرة أخرى",
  alreadySubscribedMessage: "أنت بالفعل مشترك في النشرة الإخبارية",
  invalidEmailMessage: "الرجاء إدخال عنوان بريد إلكتروني صالح.",
  agreeToPrivacyPolicyMessage: "يرجى الموافقة على سياسة الخصوصية.",
  errorOccurredMessage: "حدث خطأ، يرجى المحاولة مرة أخرى",
};
export const newsletterSignup = {
  "en-ae": { ...newsletterSignupObj },
  "en-sa": { ...newsletterSignupObj },
  "ar-ae": { ...arabicNewsletterSignup },
  "ar-sa": { ...arabicNewsletterSignup },
};

const contactUsData = {
  title: "Contact Us",
  selectTopicLabel: "Select a topic",
  topics: ["Suggestion", "Query", "Warranty", "Complaint"],
  defaultTopic: "Suggestion",
  firstNameLabel: "First Name",
  fullNameLabel: "Full Name",
  lastNameLabel: "Last Name",
  phoneCodeLabel: "Phone Number",
  emailLabel: "Email",
  descriptionLabel: "Description",
  attachmentsLabel: "Attachments",
  submitButton: "Submit",
  submittingButton: "Submitting",
  successMessage: "Your message has been sent successfully!",
  errorMessage: "Failed to send your message, please try again.",
  privacyPolicyAgreement:
  "I agree to Ahmed Seddiqi Terms & Conditions and Privacy Policy.",
  privacyPolicyLabel:
    "I consent to receive occasional marketing communications and event invitations from Ahmed Seddiqi, its affiliates, and group companies via phone, email, SMS, or WhatsApp channels.",
  uploadLimitText: "Upload only jpeg or png files (Max 10 MB)",
  selectedFileText: "Selected File:",
  fileSizeLimitError: "Please select a file smaller than 10 MB.",
};
const arabicContactUsData = {
  fullNameLabel: "الاسم الكامل",
  title: "تواصل معنا",
  selectTopicLabel: "تحديد موضوع",
  topics: ["اقتراح", "استفسار", "ضمان", "شكوى"],
  defaultTopic: "اقتراح",
  firstNameLabel: "الاسم الأول",
  lastNameLabel: "الاسم الأخير",
  phoneCodeLabel: "رقم الهاتف",
  emailLabel: "البريد الإلكتروني",
  descriptionLabel: "الوصف",
  attachmentsLabel: "المرفقات",
  submitButton: "إرسال",
  submittingButton: "جارٍ الإرسال",
  successMessage: "تم إرسال رسالتك بنجاح!",
  errorMessage: "فشل إرسال رسالتك، يرجى المحاولة مرة أخرى.",
  privacyPolicyAgreement:
    "أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بأحمد صِدّيقي.",
  privacyPolicyLabel:
    "أوافق على تلقي المراسلات التسويقية ودعوات الفعاليات من حين لآخر من شركة أحمد صِدّيقي، والشركات التابعة لها، وشركات المجموعة عبر الهاتف، أو البريد الإلكتروني، أو الرسائل النصية القصيرة، أو قنوات واتساب.",
  uploadLimitText: "لم يتم اختيار ملف تحميل (بحد أقصى 10 ميجابايت)",
  selectedFileText: "الملف المحدد:",
  fileSizeLimitError: "يرجى اختيار ملف أصغر من 10 ميجابايت.",
};
export const contactUsFormStatciData = {
  "en-ae": { ...contactUsData },
  "en-sa": { ...contactUsData },
  "ar-ae": { ...arabicContactUsData },
  "ar-sa": { ...arabicContactUsData },
};

export const languageSelectorStaticData = {
  "en-ae": { label: "COUNTRY & LANGUAGE" },
  "en-sa": { label: "COUNTRY & LANGUAGE" },
  "ar-ae": { label: "البلد واللغة" },
  "ar-sa": { label: "البلد واللغة" },
};

const productInfoTextObj = {
  productInfoText: (displayedProductsLength, totalProducts) =>
    `Showing ${displayedProductsLength} out of ${totalProducts} ${
      totalProducts === 1 ? "product" : "products"
    }`,
  loadMoreText: "Load More",
  noProductsFoundText: "No products found.",
  allFilters: "All Filters",
  productsText: (totalProducts) =>
    `${totalProducts} ${totalProducts === 1 ? "Product" : "Products"}`,
  clearAll: "Clear All",
  filterLabel: "Filters",
  noFiltersFound: "No filters available.",
  selectedFilters: "Selected Filters",
  deleteOption: "Delete",
  applyFilters: "Apply Filters",
  sortBy: "Sort By",
  applyButton: "Apply",
  cancelButton: "Cancel",
  back: "Back",
  done: "Done",
  sortAndFilter: "SORT & FILTER",
};
const productInfoTextObjArabic = {
  productInfoText: (displayedProductsLength, totalProducts) =>
    `عرض ${displayedProductsLength} من أصل ${totalProducts} ${
      totalProducts === 1 ? "منتج" : "منتجات"
    }`,
  loadMoreText: "عرض المزيد",
  noProductsFoundText: "لم يتم العثور على منتجات.",
  allFilters: "جميع الفلاتر",
  productsText: (totalProducts) =>
    `${totalProducts} ${totalProducts === 1 ? "منتج" : "منتجات"}`,
  clearAll: "مسح الكل",
  filterLabel: "الفلاتر",
  noFiltersFound: "لا توجد فلاتر متاحة.",
  selectedFilters: "الفلاتر المحددة",
  deleteOption: "حذف",
  applyFilters: "تطبيق الفلاتر",
  sortBy: "الترتيب حسب",
  applyButton: "تطبيق",
  cancelButton: "إلغاء",
  back: "عودة",
  sortAndFilter: "الترتيب و الفلاتر",
  done: "منتهي",
};
export const plpContentTexts = {
  "en-ae": { ...productInfoTextObj },
  "en-sa": { ...productInfoTextObj },
  "ar-ae": { ...productInfoTextObjArabic },
  "ar-sa": { ...productInfoTextObjArabic },
};

const headerStaticDataObj = {
  exploreLabel: "Explore",
  productsLabel: "Products",
  recommendedForYouLabel: "Recommended for you",
};
const arabicHeaderStaticData = {
  exploreLabel: "اكتشف",
  productsLabel: "منتجات",
  recommendedForYouLabel: "موصى به لك",
};
export const headerStaticData = {
  "en-ae": { ...headerStaticDataObj },
  "en-sa": { ...headerStaticDataObj },
  "ar-ae": { ...arabicHeaderStaticData },
  "ar-sa": { ...arabicHeaderStaticData },
};

const pageNotFoundStaticDataObj = {
  title: "Page not found",
  descriptionLine1:
    "We cannot find the page you were looking for. Please check the URL or navigate to another page.",
  descriptionLine2: "We apologise for the inconvenience.",
  buttonText: "Go to homepage",
};
const arabicPageNotFoundStaticData = {
  title: "الصفحة غير موجودة",
  descriptionLine1:
    "لا يمكننا العثور على الصفحة التي تبحث عنها. يرجى التحقق من الرابط أو الانتقال إلى صفحة أخرى.",
  descriptionLine2: "نعتذر عن الإزعاج.",
  buttonText: "الذهاب إلى الصفحة الرئيسية",
};
export const pageNotFoundStaticData = {
  "en-ae": { ...pageNotFoundStaticDataObj },
  "en-sa": { ...pageNotFoundStaticDataObj },
  "ar-ae": { ...arabicPageNotFoundStaticData },
  "ar-sa": { ...arabicPageNotFoundStaticData },
};

const findABoutiqueListingStaticDataObj = {
  allBoutiquesLabel: "All Boutiques",
  ksaLabel: "KSA",
  dubaiLabel: "Dubai",
  abuDhabiLabel: "Abu Dhabi",
  brandsLabel: "Brands",
  locationsLabel: "Locations",
  servicesLabel: "Services",
  loadMoreButton: "Load More",
  nearestStoreLabel: "Nearest Store",
  filterByLabel: "Filter By",
  searchPlaceholder: "Search for brands",
  clearAllButton: "Clear All",
  clearLabel: "Clear",
  applyButton: "Apply",
  resultsLabel: "Results",
  filterLabel: "Filter",
  noLocationsFound: "No locations found",
  noBrandsFound: "No brands found",
  noServicesFound: "No services found",
  viewLess: "View Less",
  viewMore: "View More",
  getDirections: "Get Directions",
  viewDetails: "View Details",
  call: "Call",
  getInTouch: "Get in Touch",
  brandsAvailable: "Brands Available",
  viewAllBrands: "View All Brands",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  backLabel: "Back",
  whatsappLabel: "WhatsApp",
  availableBrands: "Available Brands"
};
const arabicFindABoutiqueListingStaticData = {
  allBoutiquesLabel: "جميع المتاجر",
  ksaLabel: "المملكة العربية السعودية",
  dubaiLabel: "دبي",
  abuDhabiLabel: "أبوظبي",
  brandsLabel: "الماركات",
  locationsLabel: "المواقع",
  servicesLabel: "الخدمات",
  loadMoreButton: "تحميل المزيد",
  nearestStoreLabel: "أقرب متجر",
  filterByLabel: "تصفية حسب",
  searchPlaceholder: "البحث عن طريق اسم العلامة التجارية...",
  clearAllButton: "مسح الكل",
  clearLabel: "واضح",
  applyButton: "تطبيق",
  resultsLabel: "نتيجة",
  filterLabel: "فلتر",
  noLocationsFound: "لم يتم العثور على مواقع",
  noServicesFound: "لم يتم العثور على خدمات",
  viewLess: "عرض أقل",
  viewMore: "عرض المزيد",
  noBrandsFound: "لم يتم العثور على ماركات",
  getDirections: "احصل على الاتجاهات",
  viewDetails: "عرض التفاصيل",
  call: "اتصل",
  getInTouch: "اتصل بنا",
  brandsAvailable: "الماركات المتاحة",
  viewAllBrands: "عرض جميع الماركات",
  monday: "الاثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
  sunday: "الأحد",
  backLabel: "رجوع",
  whatsappLabel: "واتساب",
  availableBrands: "العلامة التجارية المتاحة"
};
export const findABoutiqueListingStaticData = {
  "en-ae": { ...findABoutiqueListingStaticDataObj },
  "en-sa": { ...findABoutiqueListingStaticDataObj },
  "ar-ae": { ...arabicFindABoutiqueListingStaticData },
  "ar-sa": { ...arabicFindABoutiqueListingStaticData },
};

const pdpstaticDataObj = {
  backLabel: "Back",
  colorLabel: "COLOR",
  sizeLabel: "SIZE",
  findBoutiqueRolex: "FIND A ROLEX BOUTIQUE",
  findBoutiqueDefault: "FIND IN BOUTIQUE",
  bookAppointmentLabel: "Book An Appointment",
  selectSizeLabel: "Select Size",
  selectColorLabel: "Select Color",
  errorSelectSizeColor:
    "Please select both size and color before booking an appointment.",
  productDescriptionLabel: "Product Description",
  readMoreLabel: "Read More",
  editorsViewLabel: "Editors View",
  warrantyAndCareLabel: "Warranty & Care",
  productReferenceLabel: "Product Reference:",
  soldOutLabel: "Sold Out",
  findProductInBoutiqueLabel: "Find product in Boutique",
  colorSelectorDescription:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum, velit sit amet consequat volutpat, nisl mauris mollis elit, nec gravida erat enim at tellus.",
};
const arabicPdpStaticDataObj = {
  backLabel: "عودة",
  findBoutiqueRolex: "ابحث عن بوتيك رولكس",
  colorLabel: "اختر اللون",
  sizeLabel: "المقاس",
  findBoutiqueDefault: "ابحث في البوتيك",
  bookAppointmentLabel: "احجز موعدًا",
  selectSizeLabel: "اختر المقاس",
  selectColorLabel: "اختر اللون",
  errorSelectSizeColor: "يرجى اختيار المقاس واللون قبل حجز الموعد.",
  productDescriptionLabel: "وصف المنتج",
  readMoreLabel: "اقرأ المزيد",
  editorsViewLabel: "رأي المحررين",
  warrantyAndCareLabel: "الضمان والعناية",
  productReferenceLabel: "رقم المرجع للمنتج:",
  soldOutLabel: "تم البيع",
  findProductInBoutiqueLabel: "اعثر على المنتج في البوتيك",
  colorSelectorDescription:
    "لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أديبيسينغ إليت. كويزك بيديم، فيليت سيت أميت كونسكوات فولوتبات، نيسل ماوريس موليس إليت، نيك جرافيدا إيرات إنيم أت تيلوس.",
};
export const productDetailStaticData = {
  "en-ae": { ...pdpstaticDataObj },
  "en-sa": { ...pdpstaticDataObj },
  "ar-ae": { ...arabicPdpStaticDataObj },
  "ar-sa": { ...arabicPdpStaticDataObj },
};

const brandsDataObj = {
  arabicAllBrands: "جميع الماركات",
  englishAllBrands: "All brands",
};

export const allBrandsStaticData = {
  "en-ae": brandsDataObj.englishAllBrands,
  "en-sa": brandsDataObj.englishAllBrands,
  "ar-ae": brandsDataObj.arabicAllBrands,
  "ar-sa": brandsDataObj.arabicAllBrands,
};


const introAndExploreData = {
  searchText: "Explore Ahmed Seddiqi Heritage",
  searchTextMobile: "Tell me about the Ahmed Seddiqi legacy",
  carouselView: "Carousel View",
  gridView: "Grid View",
  explore: "Explore",
};
const introAndExploreArabicData = {
  searchText: "استكشف تراث أحمد صديقي",
  searchTextMobile: "أخبرني عن إرث أحمد صديقي",
  carouselView: "عرض دائري",
  gridView: "عرض الشبكة",
  explore: "يستكشف",
};
export const introAndExplore = {
  "en-ae": {...introAndExploreData},
  "en-sa": {...introAndExploreData},
  "ar-ae": {...introAndExploreArabicData},
  "ar-sa": {...introAndExploreArabicData},
};

