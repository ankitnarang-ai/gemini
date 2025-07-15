import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { showToast } from "../../shared/Toast";

const phoneSchema = z.object({
  country: z.string().min(1, "Country required"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .regex(/^[0-9]+$/, "Only digits allowed"),
});

export default function PhoneLogin({ onOtpSent }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { country: "", phone: "" },
  });

  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,idd"
      );
      const countryData = res.data
        .map((c) => ({
          name: c.name.common,
          code: c.idd?.root + (c.idd?.suffixes?.[0] || ""),
        }))
        .filter((c) => c.code);
      countryData.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(countryData);
    } catch (err) {
      console.error("Failed to load countries:", err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("OTP sent successfully", "success");
      onOtpSent(data);
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto mt-10"
    >
      <select {...register("country")} className="w-full border rounded p-2">
        <option value="">Select Country</option>
        {countries.map((c, i) => (
          <option key={i} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
      {errors.country && (
        <p className="text-red-500 text-sm">{errors.country.message}</p>
      )}

      <input
        {...register("phone")}
        placeholder="Phone number"
        className="w-full border rounded p-2"
      />
      {errors.phone && (
        <p className="text-red-500 text-sm">{errors.phone.message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white rounded p-2 disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
}
