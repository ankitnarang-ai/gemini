import { useEffect, useState } from "react";
import PhoneLogin from "./PhoneLogin";
// import OtpVerification from "./OtpVerification";

export default function LoginPage({ onSuccess }) {
  const [otpSent, setOtpSent] = useState(false);
  const [phoneData, setPhoneData] = useState(null);

  const isAuthenticated = localStorage.getItem("auth") === "true";

  // Redirect to main app if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] shadow-md rounded-lg p-6 space-y-6 border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center">
          {otpSent ? "Verify OTP" : "Login with Phone"}
        </h2>

        {!otpSent ? (
          <PhoneLogin
            onOtpSent={(data) => {
              setPhoneData(data);
              setOtpSent(true);
            }}
          />
        ) : (
            <PhoneLogin
            onOtpSent={(data) => {
              setPhoneData(data);
              setOtpSent(true);
            }}
          />
        //   <OtpVerification phone={phoneData} onVerified={onSuccess} />
        )}

        <p className="text-sm text-center text-[var(--color-text-secondary)]">
          OTP is <code className="bg-[var(--color-background-elevated)] px-2 py-1 rounded text-[var(--color-text-primary)]">123456</code>
        </p>
      </div>
    </div>
  );
}
