import { describe, expect, it } from "vitest";
import { languageName } from "./catalog";
import { parseLocale } from "./locale";
import { getMessages, localizeError, validationCopy } from "./messages";

describe("parseLocale", () => {
  it("accepts Kazakh and treats everything else as Russian", () => {
    expect(parseLocale("kk")).toBe("kk");
    expect(parseLocale("ru")).toBe("ru");
    expect(parseLocale(undefined)).toBe("ru");
    expect(parseLocale(null)).toBe("ru");
    expect(parseLocale("")).toBe("ru");
    expect(parseLocale("en")).toBe("ru");
  });
});

describe("interface copy", () => {
  it("keeps the same keys in Russian and Kazakh", () => {
    expect(Object.keys(getMessages("kk")).sort()).toEqual(Object.keys(getMessages("ru")).sort());
    expect(Object.keys(validationCopy("kk")).sort()).toEqual(Object.keys(validationCopy("ru")).sort());
  });

  it("translates known server errors and leaves unknown text", () => {
    const pairs = [
      ["Не удалось создать сказку. Попробуйте ещё раз.", "Ертегі жасалмады. Қайта көріңіз."],
      ["Сказка не получилась. Попробуйте ещё раз.", "Ертегі шықпады. Қайта көріңіз."],
      ["Соединение прервалось до конца сказки.", "Байланыс ертегі бітпей үзілді."],
      ["Ошибка соединения с сервером", "Сервермен байланыс қатесі"],
      ["Ключ модели не настроен", "Модель кілті бапталмаған"],
      ["Некорректный JSON", "JSON қате"],
      ["Проверьте поля формы", "Форма өрістерін тексеріңіз"],
    ] as const;

    for (const [russian, kazakh] of pairs) {
      expect(localizeError(russian, "ru")).toBe(russian);
      expect(localizeError(russian, "kk")).toBe(kazakh);
    }
    expect(localizeError("неизвестная ошибка", "kk")).toBe("неизвестная ошибка");
  });

  it("names the story language in the interface language", () => {
    expect(languageName("ru", "ru")).toBe("Русский");
    expect(languageName("kk", "ru")).toBe("Қазақша");
    expect(languageName("ru", "kk")).toBe("Орысша");
    expect(languageName("kk", "kk")).toBe("Қазақша");
    expect(getMessages("ru").pageLine(2, 4)).toBe("Страница 2 из 4");
    expect(getMessages("kk").picked(3)).toBe("3 / 5 таңдалды. 2-ден 5-ке дейін керек.");
  });
});
