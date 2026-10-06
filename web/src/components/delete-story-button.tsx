"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteStoryButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    if (!window.confirm("Удалить эту сказку?")) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Не удалось удалить сказку");
        return;
      }
      router.push("/history");
      router.refresh();
    } catch {
      setError("Не удалось удалить сказку");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Удаляю..." : "Удалить сказку"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
