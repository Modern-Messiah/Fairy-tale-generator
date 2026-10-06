import { parseLocale, type Locale } from "./locale";

const validation = {
  ru: {
    age: "Укажите возраст от 1 до 10 лет",
    language: "Выберите язык сказки",
    genre: "Выберите жанр сказки",
    characters: "Выберите персонажей",
    charactersMin: "Выберите минимум 2 персонажа",
    charactersMax: "Выберите не более 5 персонажей",
    charactersEmpty: "Персонажи не могут быть пустыми строками",
    charactersLong: "Имя персонажа слишком длинное",
    charactersDuplicate: "Персонажи не должны повторяться",
    charactersUnknown: "Выберите персонажей из списка",
  },
  kk: {
    age: "Жас 1-ден 10-ға дейін болуы керек",
    language: "Ертегі тілін таңдаңыз",
    genre: "Ертегі жанрын таңдаңыз",
    characters: "Кейіпкерлерді таңдаңыз",
    charactersMin: "Кемінде 2 кейіпкер таңдаңыз",
    charactersMax: "5 кейіпкерден артық таңдамаңыз",
    charactersEmpty: "Кейіпкер аты бос болмауы керек",
    charactersLong: "Кейіпкер аты тым ұзын",
    charactersDuplicate: "Кейіпкерлер қайталанбауы керек",
    charactersUnknown: "Кейіпкерлерді тізімнен таңдаңыз",
  },
} as const;

export type ValidationCopy = (typeof validation)[Locale];

export function validationCopy(locale: Locale): ValidationCopy {
  return validation[locale];
}

const copy = {
  ru: {
    siteTitle: "Генератор сказок",
    siteDescription: "Детские сказки на русском и казахском языках",
    siteLanguage: "Язык сайта",
    brand: "Сказки",
    history: "История",
    historyTitle: "История сказок",
    newestFirst: "Сначала новые.",
    newShort: "Новая",
    newStory: "Новая сказка",
    storyTitle: "Сказка",
    emptyTitle: "Пока пусто",
    emptyBody: "Первая сказка появится здесь после генерации.",
    createStory: "Создать сказку",
    notFoundTitle: "Страница не найдена",
    notFoundBody: "Такой сказки нет.",
    lede: "Возраст, язык, жанр и от двух до пяти героев. Текст появится здесь же.",
    age: "Возраст",
    genre: "Жанр",
    choose: "Выберите",
    ageHint: "От 1 до 10 лет",
    storyLanguage: "Язык сказки",
    characters: "Персонажи",
    russianHeroes: "Русские герои",
    kazakhHeroes: "Казахские герои",
    tooMany: "Можно выбрать не больше 5 персонажей",
    parameters: "Параметры",
    writing: "Пишу сказку…",
    saved: "Сказка готова и сохранена.",
    retry: "Повторить",
    openStory: "Открыть сказку",
    another: "Ещё одна",
    backHistory: "История",
    factLanguage: "Язык",
    factGenre: "Жанр",
    factAge: "Возраст",
    factCreated: "Создана",
    delete: "Удалить сказку",
    deleting: "Удаляю...",
    deleteConfirm: "Удалить эту сказку?",
    deleteFailed: "Не удалось удалить сказку",
    scrollTop: "Наверх",
    pages: "Страницы истории",
    pageLine: (page: number, count: number) => `Страница ${page} из ${count}`,
    picked: (count: number) => `Выбрано ${count} из 5. Нужно от 2 до 5.`,
  },
  kk: {
    siteTitle: "Ертегі генераторы",
    siteDescription: "Орыс және қазақ тілдеріндегі балалар ертегілері",
    siteLanguage: "Сайт тілі",
    brand: "Ертегілер",
    history: "Тарих",
    historyTitle: "Ертегілер тарихы",
    newestFirst: "Алдымен жаңалары.",
    newShort: "Жаңа",
    newStory: "Жаңа ертегі",
    storyTitle: "Ертегі",
    emptyTitle: "Әзірге бос",
    emptyBody: "Алғашқы ертегі осында генерациядан кейін пайда болады.",
    createStory: "Ертегі жасау",
    notFoundTitle: "Бет табылмады",
    notFoundBody: "Мұндай ертегі жоқ.",
    lede: "Жас, тіл, жанр және екі-бес кейіпкер. Мәтін осында пайда болады.",
    age: "Жас",
    genre: "Жанр",
    choose: "Таңдаңыз",
    ageHint: "1-ден 10 жасқа дейін",
    storyLanguage: "Ертегі тілі",
    characters: "Кейіпкерлер",
    russianHeroes: "Орыс кейіпкерлері",
    kazakhHeroes: "Қазақ кейіпкерлері",
    tooMany: "5 кейіпкерден артық таңдауға болмайды",
    parameters: "Параметрлер",
    writing: "Ертегі жазылуда…",
    saved: "Ертегі дайын және сақталды.",
    retry: "Қайталау",
    openStory: "Ертегіні ашу",
    another: "Тағы біреуі",
    backHistory: "Тарих",
    factLanguage: "Тіл",
    factGenre: "Жанр",
    factAge: "Жас",
    factCreated: "Жасалған",
    delete: "Ертегіні жою",
    deleting: "Жойылуда...",
    deleteConfirm: "Осы ертегіні жою керек пе?",
    deleteFailed: "Ертегіні жою мүмкін болмады",
    scrollTop: "Жоғары",
    pages: "Тарих беттері",
    pageLine: (page: number, count: number) => `${page} / ${count} бет`,
    picked: (count: number) => `${count} / 5 таңдалды. 2-ден 5-ке дейін керек.`,
  },
} as const;

export type Messages = (typeof copy)[Locale];

export function getMessages(locale: Locale): Messages {
  return copy[locale];
}

const serverErrors = {
  "Не удалось создать сказку. Попробуйте ещё раз.": "Ертегі жасалмады. Қайта көріңіз.",
  "Сказка не получилась. Попробуйте ещё раз.": "Ертегі шықпады. Қайта көріңіз.",
  "Соединение прервалось до конца сказки.": "Байланыс ертегі бітпей үзілді.",
  "Ошибка соединения с сервером": "Сервермен байланыс қатесі",
  "Ключ модели не настроен": "Модель кілті бапталмаған",
  "Некорректный JSON": "JSON қате",
  "Проверьте поля формы": "Форма өрістерін тексеріңіз",
} as const;

export function localizeError(message: string, locale: Locale): string {
  if (parseLocale(locale) === "ru") return message;
  return serverErrors[message as keyof typeof serverErrors] ?? message;
}
