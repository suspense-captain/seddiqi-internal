import { useState, ChangeEvent } from "react";
import styles from "./resetPassword.module.scss"; // Using CSS Modules for local styling
import InputField from "@components/module/inputField";
import Button from "@components/module/button";
import ArrowRight from "@assets/images/svg/ArrowDown";
import { ArrowUp } from "@assets/images/svg";
import { useRouter } from "next/router";

interface ResetPasswordProps {
  title?: string;
  subTitle?: string;
  step?: number;
  backUrl?: string;
  btnTitle?: string;
}

export default function ResetPassword({
  title = "",
  subTitle = "",
  step = 1,
  backUrl = "auth",
  btnTitle,
}: ResetPasswordProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!email) {
        setError("Email is required");
      } else if (!validateEmail(email)) {
        setError("Please enter a valid email");
      } else {
        // Handle submit logic for email, e.g., API call
        console.log("Submitting email:", email);
        setEmailSent(true);
      }
    } else if (step === 3) {
      if (!password || !confirmPassword) {
        setError("Both password fields are required");
      } else if (password !== confirmPassword) {
        setError("Passwords do not match");
      } else {
        // Handle submit logic for passwords
        console.log("Submitting new password:", password);
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const router = useRouter();

  if (emailSent) {
    return (
      <ResetPassword
        title={"Check your email"}
        subTitle={"We have sent an email to aashamsi@gmail.com. Please follow the steps to recover your password."}
        step={2}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div onClick={() => router.push(backUrl)} className={styles.backBtn}>
        <ArrowRight className={styles.arrow} /> <div>Back</div>
      </div>
      <div className={styles.resetPasswordContainer}>
        <h2 className={styles.heading}>{title}</h2>
        {subTitle && <p className={styles.description}>{subTitle}</p>}

        {step !== 2 && (
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            {step === 1 && (
              <InputField
                name="email"
                showLabel={true}
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                errorMessage={error}
                required={true}
              />
            )}

            {step === 3 && (
              <>
                <InputField
                  name="password"
                  showLabel={true}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required={true}
                />
                <InputField
                  name="confirmPassword"
                  showLabel={true}
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  errorMessage={password !== confirmPassword ? "Passwords do not match" : ""}
                  required={true}
                />
              </>
            )}

            <div className={styles.submitButton}>
              <Button
                clickHandler={() => console.log("")}
                className={styles.resetBtn}
                title={`${btnTitle ? btnTitle : "Send"}`}
                isLink={false}
                type="solid"
                color="metallic"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
