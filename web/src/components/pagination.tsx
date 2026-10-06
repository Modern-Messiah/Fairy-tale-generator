import Link from "next/link";

function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 1) return [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  const items: (number | "gap")[] = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("gap");
  }
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total) {
    if (end < total - 1) items.push("gap");
    items.push(total);
  }
  return items;
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const items = pageWindow(page, pageCount);
  if (items.length === 0) return null;

  return (
    <nav className="mt-8 flex flex-col items-center gap-3" aria-label="Страницы истории">
      <ol className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white p-3 shadow-lg">
        {items.map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="px-2 text-stone-400">
              ...
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span
                  aria-current="page"
                  className="grid h-11 min-w-11 place-items-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-3 font-bold text-white"
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={item === 1 ? "/history" : `/history?page=${item}`}
                  className="grid h-11 min-w-11 place-items-center rounded-xl border-2 border-stone-200 px-3 font-semibold hover:border-[#667eea]"
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>
      <p className="text-sm text-stone-700">
        Страница <strong>{page}</strong> из <strong>{pageCount}</strong>
      </p>
    </nav>
  );
}
