import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { showToast } from "../../shared/Toast"; // Adjust path if needed

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function Otp({ onVerify, phone, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleResend = () => {
    showToast(`OTP sent again to ${phone}`);
    setOtpSent(true);
    setTimeout(() => setOtpSent(false), 5000);
  };

  const onSubmit = (data) => {
    onVerify(data.otp);
  };

  useEffect(() => {
    showToast(`OTP sent to ${phone}`);
  }, [phone]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <h2 className="text-lg font-semibold">Enter OTP sent to {phone}</h2>

      <input
        type="text"
        {...register("otp")}
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.otp && (
        <p className="text-red-500 text-sm">{errors.otp.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        disabled={otpSent}
        onClick={handleResend}
        className="text-sm text-blue-500 hover:underline mt-2"
      >
        {otpSent ? "OTP sent!" : "Resend OTP"}
      </button>
    </form>
  );
}
