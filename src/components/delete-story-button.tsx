"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "./locale-provider";

export function DeleteStoryButton({ id }: { id: number }) {
  const router = useRouter();
  const { messages } = useLocale();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!window.confirm(messages.deleteConfirm)) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setError(messages.deleteFailed);
        return;
      }
      router.push("/history");
      router.refresh();
    } catch {
      setError(messages.deleteFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={onDelete} disabled={pending} className="btn btn-danger">
        {pending ? messages.deleting : messages.delete}
      </button>
      {error ? (
        <p className="mt-2 text-[0.8125rem]" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
