import { describe, expect, it } from "vitest";
import { formatStoryDate, pageCount, parsePage, storyPreview } from "./text";

describe("story text helpers", () => {
  it("shortens a long preview and keeps a short one", () => {
    expect(storyPreview("Жила-была лиса.", 100)).toBe("Жила-была лиса.");
    expect(storyPreview("# Заголовок\n\nЖила-была **лиса**.", 12)).toBe("Заголовок Жи...");
  });

  it("formats the date as day.month.year hour:minute", () => {
    expect(formatStoryDate(new Date(2024, 0, 2, 3, 4))).toBe("02.01.2024 03:04");
  });

  it("reads a page number and ignores junk", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage(["4"])).toBe(4);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage(undefined)).toBe(1);
  });

  it("counts pages of nine", () => {
    expect(pageCount(0, 9)).toBe(1);
    expect(pageCount(9, 9)).toBe(1);
    expect(pageCount(10, 9)).toBe(2);
  });
});
