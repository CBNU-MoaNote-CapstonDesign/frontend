"use client"

import {useState, useCallback} from "react";
import Toast from "./Toast";

export default function ToastContainer({toasts}: { toasts: { message: string, color: string }[] }) {
  const [liveToast, setLiveToast] = useState(toasts);

  const removeToast = (index:number) => {
    setLiveToast(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-2 flex flex-col items-end z-50">
      {liveToast.map((toast, index) => (
        <Toast
          key={index}
          message={toast.message}
          color={toast.color}
          onDone={() => {
            removeToast(index);
          }}
        />
      ))}
    </div>
  );
}
