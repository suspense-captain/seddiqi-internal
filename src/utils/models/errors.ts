export interface SignUpFormErrors {
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
}

export interface SignInFormErrors {
  email?: string;
  phone?: string;
  password?: string;
}

export interface ContactUsFormErrors {
  topic?: string;
  orderNumber?: string;
  firstName: string;
  lastName?: string;
  phoneCode?: string;
  phoneNumber?: string;
  email: string;
  description?: string;
  attachment?: string
}
export interface KsaContactUsFormErrors {
  topic?: string;
  orderNumber?: string;
  firstName: string;
  lastName?: string;
  phoneCode?: string;
  phoneNumber?: string;
  email: string;
  description?: string;
}
