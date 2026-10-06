import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
      <h1 className="text-3xl font-bold">Сказка не найдена</h1>
      <p className="mt-3 text-stone-600">Такой страницы нет. Можно создать новую сказку или открыть историю.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2 font-semibold text-white">
          На главную
        </Link>
        <Link href="/history" className="rounded-xl border-2 border-stone-200 px-4 py-2 font-semibold">
          История
        </Link>
      </div>
    </div>
  );
}
