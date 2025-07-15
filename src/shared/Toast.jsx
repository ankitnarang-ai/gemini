// src/shared/Toast.jsx
import { useEffect, useState } from "react";

let toastCallback = null;

export function showToast(message, type = "info") {
  if (toastCallback) toastCallback({ message, type });
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastCallback = (data) => {
      setToast(data);
      setTimeout(() => setToast(null), 3000); 
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  if (!toast) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[toast.type] || "bg-gray-800";

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`text-white px-4 py-2 rounded shadow-md ${bgColor} transition`}
      >
        {toast.message}
      </div>
    </div>
  );
}
