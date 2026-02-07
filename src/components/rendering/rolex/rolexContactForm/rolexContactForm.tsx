import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import styles from "./rolexContactForm.module.scss";
import {
  validateAttachment,
  validateDescription,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
} from "@utils/helpers/validations";
import { contactUs } from "@utils/sfcc-connector/dataService";
import { useRouter } from "next/router";
import { ContactUsFormErrors } from "@utils/models/errors";
import { countryCodes } from "@utils/data/countryCodes";
import InputField from "@components/module/inputField";
import SlidingRadioSwitch from "@components/module/slidingRadioSwitch";
import { Button } from "@components/module";
import RolexInputField from "../rolexInputField/rolexInputField";
import GoogleRecaptcha from "@components/module/googleRecaptcha";
import { getGoogleRecaptchaValidation } from "@utils/recaptcha";
import Link from "next/link";
import { LanguageContext } from "@contexts/languageContext";

const RolexContactForm = () => {
    const router = useRouter();
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      topic: "Suggestion",
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
    });

    const [agreedToTerms, setAgreedToTerms] = useState(true);
    const [marketingOptIn, setMarketingOptIn] = useState(false);

    const [captchaError, setCaptchaError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null | undefined>(
      null
    );
    const [captchaRef, setCaptchaRef] = useState<any>(null);

      const { language } = useContext(LanguageContext);

  
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

        const captchaRes = await getGoogleRecaptchaValidation(captchaToken);
        setCaptchaToken(null);
        if (captchaRes?.isError) {
          setIsLoading(false);
          return setCaptchaError("error");
        }

        const response = await contactUs({
          method: "POST",
          userData: data,
        });

        if (!response?.isError) {
          const isCpo = router.asPath.includes("/rolex/cpo");
          const thankYouPath = isCpo ? "/rolex/cpo/thank-you" : "/rolex/thank-you";
          router.push(thankYouPath);
        } else {
          alert("Failed to send email");
        }
      } catch (err) {
        console.log(err);
        captchaRef.reset();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z]*$/.test(value)) {
        return;
      }
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      validateField(name, value);
      return;
    }

    if (name === "phoneNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
      return;
    }
    if (name === "lastName" && /\d/.test(value)) {
      return;
    }

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
      const fileError = validateAttachment(file);

      if (fileError) {
        setErrors((prevErrors) => ({ ...prevErrors, ["attachment"]: fileError}));
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
        errorMessage = validateFirstName(value);
        break;
      case "lastName":
        errorMessage = validateLastName(value);
        break;
      case "phoneNumber":
        errorMessage = validatePhone(value);
        break;
      case "email":
        errorMessage = validateEmail(value);
        break;
      case "description":
        errorMessage = validateDescription(value);
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
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      phoneCode: "",
      phoneNumber: validatePhone(formData.phoneNumber),
      email: validateEmail(formData.email),
      description: validateDescription(formData.description),
    };

    setErrors(updatedErrors);
    return !Object.values(updatedErrors).some((error) => error !== "");
  };

  return (
    <form className={styles.contactForm}>
      <h2 className={styles.heading}>Contact Us</h2>

      <div className={`${styles.singleForm} ${styles.doubleForm}`}>
        <RolexInputField
          name="topic"
          showLabel={true}
          label="Select a topic"
          value={formData.topic}
          onChange={handleChange}
          options={["Suggestion", "Query", "Warranty", "Complaint"]}
          required
          optionFull
        />

        {/* <RolexInputField
          name="orderNumber"
          label="Order Number"
          type="text"
          value={formData.orderNumber}
          onChange={handleChange}
          required
        /> */}
      </div>

      <div className={styles.doubleForm}>
        <RolexInputField
          name="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          errorMessage={errors.firstName}
          required
        />

        <RolexInputField
          name="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          errorMessage={errors.lastName}
          required
        />
      </div>
      <div className={styles.doubleForm}>
        <div className={styles.optionSelector}>
          <RolexInputField
            name="phoneCode"
            label=""
            value={formData.phoneCode}
            onChange={handleChange}
            options={countryCodes}
          />

          <RolexInputField
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            errorMessage={errors.phoneNumber}
          />
        </div>
        <RolexInputField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
          required
        />
      </div>

      <RolexInputField
        name="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        errorMessage={errors.description}
        required
      />

      {/* Attachment Input */}
      <div className={styles.attachmentField}>
        <label>Attachments</label>
        <div className={styles.attachment}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div onChange={handleFileChange} className={styles.fileInfo}>
            {attachment?.name ? `Selected File: ${attachment?.name}` : "Upload only jpeg or png files (Max 10 MB)"}
          </div>
          {errors.attachment && <span className={styles.errorMessage}>{errors.attachment}</span>}
        </div>
      </div>

      <div className={styles.doubleForm}>
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
                </>        </div>
        <div className={`${styles.slidingSwitch}`}>
          <SlidingRadioSwitch
            toggleLabel={""}
            onToggle={(value) => setMarketingOptIn(!value)}
            value={marketingOptIn}
          />
          <p className={styles.switchLabel}>
            I consent to receiving occasional marketing communications and event
            invitations from Ahmed Seddiqi, its affiliates, and group companies
            via phone, email, SMS, or WhatsApp channels.
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
          title={isLoading ? "Submitting" : "Submit"}
          isLink={false}
          type="transparent"
          color="metallic"
          disabled={isLoading || !captchaToken}
        />
      </div>
    </form>
  );
};

export default RolexContactForm;
