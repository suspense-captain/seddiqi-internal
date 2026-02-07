// validationUtils.ts

export interface FormErrors {
  email?: string;
  confirmEmail?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
}

type Locale = "en" | "ar";
type Field =
  | "firstName"
  | "lastName"
  | "description"
  | "phone"
  | "email"
  | "attachment";
type Rule =
  | "required"
  | "noNumbers"
  | "invalidFormat"
  | "maxLength"
  | "invalidLength"
  | "registered"
  | "invalidType"
  | "injectionAttempt";

const validationMessages: Record<
  Locale,
  Record<Field, Partial<Record<Rule, string>>>
> = {
  en: {
    firstName: {
      required: "First Name is required.",
      noNumbers:
        "First Name should not contain any special characters and numbers.",
    },
    lastName: {
      required: "Last Name is required.",
      noNumbers:
        "Last Name should not contain any special characters and numbers..",
    },
    description: {
      required: "Description is required.",
      invalidFormat: "Description must contain only letters and numbers.",
      maxLength: "Description must not exceed 150 characters.",
    },
    phone: {
      required: "Phone number is required.",
      invalidFormat: "Only numbers are allowed.",
      invalidLength: "Phone number must be 9 or 10 digits.",
    },
    email: {
      required: "Email is required.",
      invalidFormat: "Invalid email format.",
      registered: "Email is already registered.",
      injectionAttempt: "Invalid characters in email.",
    },
    attachment: {
      invalidType: "Unsupported file type. Please upload a JPEG or PNG.",
      maxLength: "File size exceeds 10 MB. Please upload a smaller file.",
    },
  },
  ar: {
    firstName: {
      required: "الاسم الأول مطلوب.",
      noNumbers: "يجب ألا يحتوي الاسم الأول على أرقام.",
    },
    lastName: {
      required: "اسم العائلة مطلوب.",
      noNumbers: "يجب ألا يحتوي اسم العائلة على أرقام.",
    },
    description: {
      required: "الوصف مطلوب.",
      invalidFormat: "يجب أن يحتوي الوصف على حروف وأرقام فقط.",
      maxLength: "يجب ألا يزيد الوصف عن 150 حرفًا.",
    },
    phone: {
      required: "رقم الهاتف مطلوب.",
      invalidFormat: "يجب أن يحتوي رقم الهاتف على أرقام فقط.",
      invalidLength: "يجب أن يكون رقم الهاتف مكونًا من 9 أو 10 أرقام.",
    },
    email: {
      required: "البريد الإلكتروني مطلوب.",
      invalidFormat: "تنسيق البريد الإلكتروني غير صالح.",
      registered: "البريد الإلكتروني مسجل بالفعل.",
      injectionAttempt: "Invalid characters in email.",
    },
    attachment: {
      invalidType: "Unsupported file type. Please upload a JPEG or PNG",
      maxLength: "File size exceeds 10 MB. Please upload a smaller file",
    },
  },
};

export const isOnlyLetters = (value: string): boolean =>
  /^[A-Za-z\u0600-\u06FF\s]+$/.test(value);

const isAlphaNumericWithSpace = (value: string): boolean =>
  /^[A-Za-z0-9\u0600-\u06FF\s.,!?؟،'"-]+$/.test(value);

const isMaxLength = (value: string, max: number): boolean =>
  value.length <= max;

const isPhoneFormatValid = (value: string): boolean => /^\d+$/.test(value);

const isPhoneLengthValid = (value: string): boolean => /^\d{9,10}$/.test(value);

const isEmailValid = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export const isSafeEmailInput = (value: string): boolean => {
  const newlinePattern = /(\r|\n|%0A|%0D)/i;
  const headerPattern = /(bcc:|cc:|to:)/i;

  return !newlinePattern.test(value) && !headerPattern.test(value);
};

export const getValidationMessage = (
  field: Field,
  rule: Rule,
  locale: Locale = "en"
): string => {
  return (
    validationMessages[locale]?.[field]?.[rule] ||
    validationMessages["en"]?.[field]?.[rule] ||
    "Invalid input"
  );
};

export const passwordCriteria = {
  length: (password: string) => password.length >= 8,
  uppercase: (password: string) => /[A-Z]/.test(password),
  number: (password: string) => /\d/.test(password),
  specialChar: (password: string) => /[!@#$%^&*]/.test(password),
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required.";
  } else if (
    !passwordCriteria.length(password) ||
    !passwordCriteria.uppercase(password) ||
    !passwordCriteria.number(password) ||
    !passwordCriteria.specialChar(password)
  ) {
    return "Password must be at least 8 characters, contain one uppercase letter, one number, and one special character.";
  }
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) {
    return "Confirm password is required.";
  } else if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return "";
};

export const validateLoginPassword = (value: string): string | undefined => {
  if (!value) {
    return "Password is required.";
  }
  return "";
};
export const validateDescription = (
  value: string,
  locale?: string
): string | undefined => {
  if (!value.trim()) {
    return getValidationMessage(
      "description",
      "required",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!isAlphaNumericWithSpace(value)) {
    return getValidationMessage(
      "description",
      "invalidFormat",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!isMaxLength(value, 150)) {
    return getValidationMessage(
      "description",
      "maxLength",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  return "";
};

export const validatePhoneNumber = (value: string): string | undefined => {
  const phonePattern = /^[0-9]{6,15}$/;
  if (!phonePattern.test(value)) {
    return "Please enter a valid phone number.";
  }
};

export const validateEmail = (
  email: string,
  message?: string,
  isRegistered?: boolean,
  locale?: string
): string => {
  if (!email.trim()) {
    return getValidationMessage(
      "email",
      "required",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!isEmailValid(email)) {
    return getValidationMessage(
      "email",
      "invalidFormat",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (isRegistered) {
    return getValidationMessage(
      "email",
      "registered",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!isSafeEmailInput(email)) {
    return getValidationMessage(
      "email",
      "injectionAttempt",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  return "";
};

export const validateConfirmEmail = (
  email: string,
  confirmEmail: string
): string => {
  if (!email) {
    return "Repeat email is required.";
  } else if (email !== confirmEmail) {
    return "Emails do not match.";
  }
  return "";
};

export const validateFirstName = (
  firstName: string,
  locale?: string
): string => {
  if (!firstName.trim())
    return getValidationMessage(
      "firstName",
      "required",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  if (!isOnlyLetters(firstName))
    return getValidationMessage(
      "firstName",
      "noNumbers",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  return "";
};
export const validateFullName = (
  firstName: string,
  locale?: string
): string => {
  if (!firstName) {
    if (locale === "ar-AE") {
      return "الاسم الكامل مطلوب.";
    }
    return "Full Name is required.";
  }
  if (/\d/.test(firstName)) {
    return "Full Name should not contain numbers.";
  }
  return "";
};

export const validateLastName = (lastName: string, locale?: string): string => {
  if (!lastName.trim())
    return getValidationMessage(
      "lastName",
      "required",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  if (!isOnlyLetters(lastName))
    return getValidationMessage(
      "lastName",
      "noNumbers",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  return "";
};

export const validatePhone = (phone: string, locale?: string): string => {
  if (!isPhoneFormatValid(phone)) {
    return getValidationMessage(
      "phone",
      "invalidFormat",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!isPhoneLengthValid(phone)) {
    return getValidationMessage(
      "phone",
      "invalidLength",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }
  return "";
};

export const validateAttachment = (
  attachment: File | null,
  locale?: string
): string => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!attachment) return "";

  if (attachment.size > 10 * 1024 * 1024) {
    return getValidationMessage(
      "attachment",
      "maxLength",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

  if (!allowedTypes.includes(attachment.type)) {
    return getValidationMessage(
      "attachment",
      "invalidType",
      (locale?.split("-")[0] ?? "en") as Locale
    );
  }

};

export const validateTitle = (title: string): string => {
  if (!title) {
    return "Title is required.";
  }
  return "";
};
