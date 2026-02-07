import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
} from "react";
import styles from "./contactForm.module.scss";
import InputField from "../inputField";
import Button from "../button";
import {
  validateAttachment,
  validateDescription,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
} from "@utils/helpers/validations";
import {
  contactUs,
  createCustomObject,
  getCustomObject,
  updateCustomObject,
} from "@utils/sfcc-connector/dataService";
import { useRouter } from "next/router";
import { ContactUsFormErrors } from "@utils/models/errors";
import { countryCodes } from "@utils/data/countryCodes";
import SlidingRadioSwitch from "../slidingRadioSwitch";
import { LanguageContext } from "@contexts/languageContext";
import { contactUsFormStatciData } from "@utils/data/english-arabic-static-data";
import logger from "@utils/logger";
import { getGoogleRecaptchaValidation } from "@utils/recaptcha";
import GoogleRecaptcha from "../googleRecaptcha";
import Link from "next/link";

const saveContactFormDataToSFCC = async (userData: any, locale) => {
  const objectExists = await getCustomObject({
    objectType: "contactFormData",
    objectKey: userData.email,
  });
  const objectExistsInDatabase =
    objectExists.isError === false && objectExists.data.key_value_string;

  if (objectExistsInDatabase) {
    const existingData = JSON.parse(objectExists.data.c_formData.default);
    const updatedData = [...existingData, userData];

    const response = await updateCustomObject({
      objectType: "contactFormData",
      userData: updatedData,
      locale,
    });

    if (response.isError) {
      logger.error("Failed to update custom object", response);
    }

    return response;
  } else {
    const response = await createCustomObject({
      objectType: "contactFormData",
      userData: [userData],
      locale,
    });

    if (response.isError) {
      logger.error("Failed to create custom object", response);
    }

    return response;
  }
};

const ContactForm = () => {
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: contactUsFormStatciData[language]?.defaultTopic,
    orderNumber: "",
    firstName: "",
    lastName: "",
    phoneCode: "+971",
    phoneNumber: "",
    email: "",
    description: "",
  });
  const [errors, setErrors] = useState<ContactUsFormErrors>({
    topic: "",
    orderNumber: "",
    firstName: "",
    lastName: "",
    phoneCode: "",
    phoneNumber: "",
    email: "",
    description: "",
    attachment: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const isKSA = language.includes("-sa");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null | undefined>(
    null
  );
  const [captchaRef, setCaptchaRef] = useState<any>(null);

  const onCaptchaChange = (value: string | null | undefined) => {
    setCaptchaToken(value);
    setCaptchaError("");
  };

  const onCaptchaError = () => {
    setCaptchaError("Something went wrong!");
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const userData = {
        type: formData.topic,
        orderReferenceNumber: formData.orderNumber,
        message: formData.description,
        phoneNumber: `${formData.phoneCode} ${formData.phoneNumber}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        privacyPolicy: agreedToTerms,
        emailMarketing: marketingOptIn,
      };
      const data = new FormData();
      Object.keys(userData).forEach((key) => {
        data.append(key, userData[key as keyof typeof userData] as string);
      });

      if (attachment) {
        data?.append("attachment", attachment);
      }

      // check google recaptcha error
      if (!captchaToken || captchaError) return setCaptchaError("required");

      try {
        const response = await saveContactFormDataToSFCC(userData, language);
        if (!isKSA) {
          const captchaRes = await getGoogleRecaptchaValidation(captchaToken);
          setCaptchaToken(null);
          if (captchaRes?.isError) {
            setIsLoading(false);
            return setCaptchaError("error");
          }

          await contactUs({
            method: "POST",
            userData: data,
            locale: language,
          });
        }

        if (!response?.isError) {
          captchaRef.reset();
          router.push(`${isKSA ? language : ""}/contact-us/confirmation`);
        } else {
          const isArabic = language.toLowerCase().includes("ar");
          alert(
            isArabic ? "فشل في إرسال البريد الإلكتروني" : "Failed to send email"
          );
        }
      } catch (err) {
        console.log(err);
        captchaRef.reset();
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      phoneCode: isKSA ? "+966" : "+971",
    }));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // if (name === "phoneNumber") {
    //   if (/^\d*$/.test(value) && value.length <= 10) {
    //     setFormData((prevData) => ({ ...prevData, [name]: value }));
    //   }
    //   return;
    // }
    // if (name === "lastName" && /\d/.test(value)) {
    //   return;
    // }

    if (name === "description") {
      const alphanumericOnly = value.replace(/[^a-zA-Z0-9\s]/g, "");
      setFormData((prevData) => ({ ...prevData, [name]: alphanumericOnly }));
      validateField(name, alphanumericOnly);
      return;
    }

    setFormData(updatedFormData);
    validateField(name, value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileError = validateAttachment(file, language);

      if (fileError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ["attachment"]: fileError,
        }));
        return null;
      }
      // 10 MB limit
      setAttachment(file);
    }
  };

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        errorMessage = validateFirstName(value, language);
        break;
      case "lastName":
        errorMessage = validateLastName(value, language);
        break;
      case "phoneNumber":
        errorMessage = validatePhone(value, language);
        break;
      case "email":
        errorMessage = validateEmail(value, "", false, language);
        break;
      case "description":
        errorMessage = validateDescription(value, language);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateForm = (): boolean => {
    const updatedErrors: ContactUsFormErrors = {
      topic: "",
      orderNumber: "",
      firstName: validateFirstName(formData.firstName, language),
      lastName: validateLastName(formData.lastName, language),
      phoneCode: "",
      phoneNumber: validatePhone(formData.phoneNumber, language),
      email: validateEmail(formData.email, "", false, language),
      description: validateDescription(formData.description, language),
    };

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).some((error) => error !== "");
  };

  return (
    <form className={styles.contactForm}>
      <h2 className={styles.heading}>
        {contactUsFormStatciData[language]?.title}
      </h2>

      <div className={`${styles.singleForm} ${styles.doubleForm}`}>
        <InputField
          name="topic"
          showLabel={true}
          label={contactUsFormStatciData[language]?.selectTopicLabel}
          value={formData.topic}
          onChange={handleChange}
          options={contactUsFormStatciData[language]?.topics}
          required
          optionFull
        />

        {/* <InputField
          name="orderNumber"
          label="Order Number"
          type="text"
          value={formData.orderNumber}
          onChange={handleChange}
          required
        /> */}
      </div>

      <div className={styles.doubleForm}>
        <InputField
          name="firstName"
          label={contactUsFormStatciData[language]?.firstNameLabel}
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          errorMessage={errors.firstName}
          required
        />

        <InputField
          name="lastName"
          label={contactUsFormStatciData[language]?.lastNameLabel}
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          errorMessage={errors.lastName}
          required
        />
      </div>
      <div className={styles.doubleForm}>
        <div className={styles.optionSelector}>
          <InputField
            name="phoneCode"
            label=""
            value={formData.phoneCode}
            onChange={handleChange}
            options={countryCodes}
          />

          <InputField
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            errorMessage={errors.phoneNumber}
          />
        </div>
        <InputField
          name="email"
          label={contactUsFormStatciData[language]?.emailLabel}
          type="email"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          required
        />
      </div>

      <InputField
        name="description"
        label={contactUsFormStatciData[language]?.descriptionLabel}
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        errorMessage={errors.description}
        required
        maxLength={150}
      />

      {/* Attachment Input */}
      <div className={styles.attachmentField}>
        <label>{contactUsFormStatciData[language]?.attachmentsLabel}</label>
        <div className={styles.attachment}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div onChange={handleFileChange} className={styles.fileInfo}>
            {attachment?.name
              ? `${contactUsFormStatciData[language]?.selectedFileText} ${attachment?.name}`
              : contactUsFormStatciData[language]?.uploadLimitText}
          </div>
          {errors.attachment && (
            <span className={styles.errorMessage}>{errors.attachment}</span>
          )}
        </div>
      </div>

      <div className={styles.switches}>
        <div className={`${styles.slidingSwitch}`}>
          <SlidingRadioSwitch
            noToggle={true}
            toggleLabel={""}
            onToggle={(value) => setAgreedToTerms(true)}
            value={agreedToTerms}
          />
               <>
                  {language?.includes("ar-") ? (
                    <p
                      className={styles.switchLabel}
                      dir="rtl"
                      style={{ textAlign: "right" }}
                    >
                      أوافق على{" "}
                      <Link href="/terms-and-conditions" locale="ar">
                        <span className={styles.labelHover}>
                          الشروط والأحكام
                        </span>
                      </Link>{" "}
                      و{" "}
                      <Link href="/privacy" locale="ar">
                        <span className={styles.labelHover}>
                          سياسة الخصوصية
                        </span>
                      </Link>{" "}
                      الخاصة بأحمد صِدّيقي.
                    </p>
                  ) : (
                    <p className={styles.switchLabel}>
                      I agree to Ahmed Seddiqi & Sons{" "}
                      <Link href="/terms-and-conditions">
                        <span className={styles.labelHover}>
                          Terms & Conditions
                        </span>
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy">
                        <span className={styles.labelHover}>
                          Privacy Policy
                        </span>
                      </Link>
                      .
                    </p>
                  )}
                </>
        </div>
        <div className={`${styles.slidingSwitch}`}>
          <SlidingRadioSwitch
            toggleLabel={""}
            onToggle={(value) => setMarketingOptIn(!value)}
            value={marketingOptIn}
          />
            <p className={styles.switchLabel}>
              {contactUsFormStatciData[language]?.privacyPolicyLabel}
            </p>
        </div>
      </div>

      <GoogleRecaptcha
        error={captchaError}
        onChange={onCaptchaChange}
        onErrored={onCaptchaError}
        setCaptchaRef={setCaptchaRef}
      />

      <div className={styles.btnContainer}>
        <Button
          clickHandler={(e) => handleSubmit(e)}
          className={styles.submitBtn}
          title={
            isLoading
              ? contactUsFormStatciData[language]?.submittingButton
              : contactUsFormStatciData[language]?.submitButton
          }
          isLink={false}
          type="solid"
          color="metallic"
          disabled={isLoading || !captchaToken}
        />
      </div>
    </form>
  );
};

export default ContactForm;
