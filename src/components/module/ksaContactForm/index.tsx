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
import ContentHeader from "../contentHeader";

const saveContactFormDataToSFCC = async (userData: any, locale: any) => {
  const objectExists = await getCustomObject({
    objectType: "contactFormData",
    objectKey: userData.email,
    locale
  });
  const objectExistsInDatabase =
    objectExists.isError === false && objectExists.data.key_value_string;

  if (objectExistsInDatabase) {
    const existingData = JSON.parse(objectExists.data.c_formData.default);
    const updatedData = [...existingData, userData];

    const response = await updateCustomObject({
      objectType: "contactFormData",
      userData: updatedData,
      locale
    });

    if (response.isError) {
      logger.error("Failed to update custom object", response);
    }

    return response;
  } else {
    const response = await createCustomObject({
      objectType: "contactFormData",
      userData: [userData],
      locale
    });

    if (response.isError) {
      logger.error("Failed to create custom object", response);
    }

    return response;
  }
};

const KsaContactForm = ({ ...content }) => {
  if(!content) {
    return null
  }
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    phoneCode: "+971",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<ContactUsFormErrors>({
    // topic: "",
    // orderNumber: "",
    firstName: "",
    lastName: "",
    phoneCode: "",
    phoneNumber: "",
    email: "",
    // description: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const isKSA = language?.toLowerCase().includes("-sa");
  const isArabic = language.includes("ar-");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      const userData = {
        type: "",
        orderReferenceNumber: "",
        message: "",
        phoneNumber: `${formData.phoneCode} ${formData.phoneNumber}`,
        firstName: formData.firstName,
        lastName: "Doe",
        email: formData.email,
        privacyPolicy: agreedToTerms,
        emailMarketing: marketingOptIn,
      };
      const data = new FormData();
      Object.keys(userData).forEach((key) => {
        data.append(key, userData[key as keyof typeof userData] as string);
      });

      try {
        const response =  await saveContactFormDataToSFCC(userData, language);
        if (!response?.isError) {
          // router.push(`${isKSA ? language : ""}/contact-us/confirmation`);
          router.push(`/contact-us/confirmation`);
        } else {
          alert(
            isArabic ? "فشل الإرسال!" : "Submission Failed!"
          );
        }
      } catch (err) {
        console.log(err);
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
    if (name === "phoneNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
      return;
    }
    if (name === "lastName" && /\d/.test(value)) {
      return;
    }

    setFormData(updatedFormData);
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        errorMessage = validateFirstName(value, language);
        break;
      case "phoneNumber":
        errorMessage = validatePhone(value, language);
        break;
      case "email":
        errorMessage = validateEmail(value, "", false, language);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateForm = (): boolean => {
    const updatedErrors: ContactUsFormErrors = {
      firstName: validateFirstName(formData.firstName, language),
      phoneCode: "",
      phoneNumber: validatePhone(formData.phoneNumber, language),
      email: validateEmail(formData.email, "", false, language),
    };

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).some((error) => error !== "");
  };

  return (
    <form className={styles.contactForm}>
      <ContentHeader
        barColor={styles.barColor}
        subTitleColor={styles.subTitleColor}
        titleColor={styles.titleColor}
        hideUnderline={true}
        mainTitle={content?.heading}
        richText={content?.description}
      />

      <div className={styles.contactContent}>
        <InputField
          name="firstName"
          label={contactUsFormStatciData[language]?.fullNameLabel}
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          errorMessage={errors.firstName}
          required
        />

        <InputField
          name="email"
          label={contactUsFormStatciData[language]?.emailLabel}
          type="email"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          required
        />

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

        {content?.cta?.label && (
          <div className={styles.btnContainer}>
            <Button
              clickHandler={(e) => handleSubmit(e)}
              className={styles.submitBtn}
              title={isLoading ? isArabic ? "تقديم" : "Submitting" :  content?.cta?.label}
              isLink={false}
              type={content?.cta?.type}
              color={content?.cta?.color}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default KsaContactForm;
