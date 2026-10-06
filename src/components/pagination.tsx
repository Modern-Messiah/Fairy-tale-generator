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

export function Pagination({
  page,
  pageCount,
  label,
  line,
}: {
  page: number;
  pageCount: number;
  label: string;
  line: string;
}) {
  const items = pageWindow(page, pageCount);
  if (items.length === 0) return null;

  return (
    <nav className="mt-8 flex flex-col items-center gap-3" aria-label={label}>
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="px-1" style={{ color: "var(--secondary)" }}>
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span aria-current="page" className="page-link">
                  {item}
                </span>
              ) : (
                <Link href={item === 1 ? "/history" : `/history?page=${item}`} className="page-link">
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>
      <p className="text-[0.8125rem]" style={{ color: "var(--secondary)" }}>
        {line}
      </p>
    </nav>
  );
}
