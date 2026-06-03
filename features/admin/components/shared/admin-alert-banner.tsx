"use client";

import { AlertCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  unauthorized: "You don't have permission to access that page.",
  account_deactivated: "Your account has been deactivated. Contact an administrator.",
};

export function AdminAlertBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const [visible, setVisible] = useState(Boolean(error));

  useEffect(() => {
    setVisible(Boolean(error));
  }, [error]);

  if (!visible || !error || !MESSAGES[error]) return null;

  const dismiss = () => {
    setVisible(false);
    router.replace("/admin");
  };

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{MESSAGES[error]}</p>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
        <X className="size-4" />
      </button>
    </div>
  );
}
