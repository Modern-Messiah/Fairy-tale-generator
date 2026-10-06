export const LANGUAGES = ["ru", "kk"] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "kk", label: "Казахский (Қазақша)", flag: "🇰🇿" },
];

export const GENRES = [
  "adventure",
  "fantasy",
  "magic",
  "comedy",
  "drama",
  "animals",
  "family",
  "educational",
  "detective",
  "travel",
] as const;

export type Genre = (typeof GENRES)[number];

export const GENRE_OPTIONS: { value: Genre; label: string }[] = [
  { value: "adventure", label: "Приключения" },
  { value: "fantasy", label: "Фэнтези" },
  { value: "magic", label: "Волшебная сказка" },
  { value: "comedy", label: "Комедия" },
  { value: "drama", label: "Драма" },
  { value: "animals", label: "Сказка о животных" },
  { value: "family", label: "Семейная сказка" },
  { value: "educational", label: "Поучительная сказка" },
  { value: "detective", label: "Детектив" },
  { value: "travel", label: "Путешествия" },
];

const GENRE_NAMES: Record<Language, Record<Genre, string>> = {
  ru: {
    adventure: "Приключения",
    fantasy: "Фэнтези",
    magic: "Волшебная сказка",
    comedy: "Комедия",
    drama: "Драма",
    animals: "Сказка о животных",
    family: "Семейная сказка",
    educational: "Поучительная сказка",
    detective: "Детектив",
    travel: "Путешествия",
  },
  kk: {
    adventure: "Шытырман оқиға",
    fantasy: "Фэнтези",
    magic: "Сиқырлы ертегі",
    comedy: "Комедия",
    drama: "Драма",
    animals: "Жануарлар туралы ертегі",
    family: "Отбасылық ертегі",
    educational: "Тәрбиелік ертегі",
    detective: "Детектив",
    travel: "Саяхат",
  },
};

export type CharacterOption = {
  value: string;
  label: string;
  group: Language;
};

export const CHARACTERS: CharacterOption[] = [
  { value: "Заяц", label: "Заяц", group: "ru" },
  { value: "Волк", label: "Волк", group: "ru" },
  { value: "Лиса", label: "Лиса", group: "ru" },
  { value: "Медведь", label: "Медведь", group: "ru" },
  { value: "Колобок", label: "Колобок", group: "ru" },
  { value: "Курочка Ряба", label: "Курочка Ряба", group: "ru" },
  { value: "Маша", label: 'Маша (из "Маша и медведь")', group: "ru" },
  { value: "Иван-царевич", label: "Иван-царевич", group: "ru" },
  { value: "Баба-Яга", label: "Баба-Яга", group: "ru" },
  { value: "Кощей Бессмертный", label: "Кощей Бессмертный", group: "ru" },
  { value: "Змей Горыныч", label: "Змей Горыныч", group: "ru" },
  { value: "Василиса Прекрасная", label: "Василиса Прекрасная", group: "ru" },
  { value: "Царевна-лягушка", label: "Царевна-лягушка", group: "ru" },
  { value: "Илья Муромец", label: "Илья Муромец", group: "ru" },
  { value: "Алдар Көсе", label: "Алдар Көсе", group: "kk" },
  { value: "Әйел Арстан", label: "Әйел Арстан (Женщина-лев)", group: "kk" },
  { value: "Ер Төстік", label: "Ер Төстік", group: "kk" },
  { value: "Жиренше", label: "Жиренше", group: "kk" },
  { value: "Қарақшы", label: "Қарақшы (Разбойник)", group: "kk" },
  { value: "Тазша бала", label: "Тазша бала", group: "kk" },
  { value: "Қанбақ шал", label: "Қанбақ шал", group: "kk" },
  { value: "Алпамыс батыр", label: "Алпамыс батыр", group: "kk" },
  { value: "Қобыланды батыр", label: "Қобыланды батыр", group: "kk" },
  { value: "Жалмауыз кемпір", label: "Жалмауыз кемпір (Баба-Яга)", group: "kk" },
];

export const CHARACTER_VALUES = new Set(CHARACTERS.map((character) => character.value));

export const STORY_REQUEST_STORAGE_KEY = "storyFormData";

export const PAGE_SIZE = 9;

export const MAX_STORY_CHARS = 100_000;

export function languageLabel(language: string): string {
  return LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ?? language;
}

export function languageBadge(language: string): string {
  if (language === "ru") return "🇷🇺 Русский";
  if (language === "kk") return "🇰🇿 Қазақша";
  return language;
}

export function genreLabel(language: string, genre: string): string {
  if (language === "ru" || language === "kk") {
    const names = GENRE_NAMES[language];
    if (genre in names) return names[genre as Genre];
  }
  return GENRE_OPTIONS.find((option) => option.value === genre)?.label ?? genre;
}
