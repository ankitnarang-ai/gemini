import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { showToast } from "../../shared/Toast";

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function OtpVerification({ phone, onVerified }) {
    const [serverOtp] = useState("123456");
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(otpSchema),
    });

    useEffect(() => {
        setTimeout(() => {
            console.log("OTP sent:", serverOtp);
        }, 1000);
    }, []);

    const onSubmit = ({ otp }) => {
        if (otp === serverOtp) {
            localStorage.setItem("auth", "true");
            showToast("OTP Verified!", "success");
            onVerified();
        } else {
            setError("Invalid OTP");
            showToast("Invalid OTP", "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto mt-10 space-y-4"
        >
            <input
                {...register("otp")}
                placeholder="Enter OTP"
                className="w-full border p-2 rounded"
            />
            {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp.message}</p>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <p className="text-sm text-gray-500">OTP is 123456 (simulated)</p>

            <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                type="submit"
            >
                Verify OTP
            </button>
        </form>
    );
}

