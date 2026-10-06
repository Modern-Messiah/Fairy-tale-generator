"use client";

import { CHARACTERS, GENRE_OPTIONS, LANGUAGE_OPTIONS, STORY_REQUEST_STORAGE_KEY } from "@/domain/catalog";
import { storyRequestSchema, type StoryRequest } from "@/domain/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function selectedCharacters(input: HTMLInputElement): string[] {
  const boxes = input.form?.querySelectorAll('input[name="characters"]:checked');
  if (!boxes) return [];
  return Array.from(boxes).map((node) => (node as HTMLInputElement).value);
}

export function StoryForm() {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryRequest>({
    resolver: zodResolver(storyRequestSchema),
    defaultValues: { characters: [] },
  });

  function onSubmit(data: StoryRequest) {
    sessionStorage.setItem(STORY_REQUEST_STORAGE_KEY, JSON.stringify(data));
    router.push("/generate");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 text-center">
        <p className="mb-3 text-5xl motion-safe:animate-pulse">✨📚✨</p>
        <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl">Генератор сказок</h1>
        <p className="mt-3 text-lg text-stone-800">
          Создайте уникальную детскую сказку с помощью искусственного интеллекта
        </p>
      </header>

      <section className="mb-8 rounded-3xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 to-sky-200 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Как это работает?</h2>
        <ol className="grid gap-3">
          {[
            "Укажите возраст ребенка",
            "Выберите язык и жанр",
            "Отметьте интересных персонажей",
            "Нажмите «Создать сказку» и наблюдайте за магией",
          ].map((step, index) => (
            <li key={step} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-sm font-bold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        noValidate
      >
        <fieldset className="relative mb-8 rounded-2xl border-2 border-stone-200 bg-stone-50 p-5 pt-8">
          <legend className="absolute -top-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl">
            <span aria-hidden="true">👶</span>
            <span className="sr-only">Возраст</span>
          </legend>
          <label htmlFor="age" className="mb-2 block text-lg font-bold">
            Возраст ребенка
          </label>
          <input
            id="age"
            type="number"
            min={1}
            max={10}
            placeholder="Например: 7"
            className="w-full rounded-xl border-2 border-stone-200 px-4 py-3 text-lg outline-none focus:border-[#667eea]"
            aria-invalid={errors.age ? true : undefined}
            aria-describedby="age-hint"
            {...register("age", { valueAsNumber: true })}
          />
          <p id="age-hint" className="mt-2 text-sm text-stone-600">
            Укажите возраст от 1 до 10 лет
          </p>
          {errors.age ? <p className="mt-2 text-sm text-red-700">{errors.age.message}</p> : null}
        </fieldset>

        <fieldset className="relative mb-8 rounded-2xl border-2 border-stone-200 bg-stone-50 p-5 pt-8">
          <legend className="absolute -top-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl">
            <span aria-hidden="true">🌍</span>
            <span className="sr-only">Язык</span>
          </legend>
          <p className="mb-3 text-lg font-bold">Язык сказки</p>
          <div className="flex flex-wrap gap-3">
            {LANGUAGE_OPTIONS.map((language) => (
              <label
                key={language.value}
                className="cursor-pointer rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 has-[:checked]:border-[#667eea] has-[:checked]:bg-gradient-to-br has-[:checked]:from-[#667eea] has-[:checked]:to-[#764ba2] has-[:checked]:text-white"
              >
                <input type="radio" value={language.value} className="sr-only" {...register("language")} />
                <span className="mr-2 text-2xl" aria-hidden="true">
                  {language.flag}
                </span>
                <span className="font-semibold">{language.label}</span>
              </label>
            ))}
          </div>
          {errors.language ? (
            <p className="mt-2 text-sm text-red-700">{errors.language.message}</p>
          ) : null}
        </fieldset>

        <fieldset className="relative mb-8 rounded-2xl border-2 border-stone-200 bg-stone-50 p-5 pt-8">
          <legend className="absolute -top-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl">
            <span aria-hidden="true">📖</span>
            <span className="sr-only">Жанр</span>
          </legend>
          <label htmlFor="genre" className="mb-2 block text-lg font-bold">
            Жанр сказки
          </label>
          <select
            id="genre"
            className="w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 text-lg outline-none focus:border-[#667eea]"
            defaultValue=""
            aria-invalid={errors.genre ? true : undefined}
            {...register("genre")}
          >
            <option value="" disabled>
              Выберите жанр сказки...
            </option>
            {GENRE_OPTIONS.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
          {errors.genre ? <p className="mt-2 text-sm text-red-700">{errors.genre.message}</p> : null}
        </fieldset>

        <fieldset className="relative mb-8 rounded-2xl border-2 border-stone-200 bg-stone-50 p-5 pt-8">
          <legend className="absolute -top-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-xl">
            <span aria-hidden="true">🎭</span>
            <span className="sr-only">Персонажи</span>
          </legend>
          <p className="mb-1 text-lg font-bold">Выберите персонажей</p>
          <p className="mb-3 text-sm text-stone-600">От 2 до 5 персонажей</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CHARACTERS.map((character) => {
              const checked = selected.includes(character.value);
              const disabled = !checked && selected.length >= 5;
              return (
                <label
                  key={character.value}
                  className={`flex items-center gap-2 rounded-xl border-2 bg-white px-3 py-2 ${
                    checked ? "border-sky-500 bg-sky-50" : "border-stone-200"
                  } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                >
                  <input
                    type="checkbox"
                    value={character.value}
                    className="h-4 w-4"
                    disabled={disabled}
                    {...register("characters", {
                      onChange: (event) => {
                        const input = event.target as HTMLInputElement;
                        let values = selectedCharacters(input);
                        if (values.length > 5) {
                          input.checked = false;
                          values = values.filter((value) => value !== input.value);
                          setNotice("Можно выбрать не более 5 персонажей");
                          window.setTimeout(() => setNotice(""), 2000);
                        }
                        setSelected(values);
                      },
                    })}
                  />
                  <span>{character.label}</span>
                </label>
              );
            })}
          </div>
          {errors.characters ? (
            <p className="mt-2 text-sm text-red-700">{errors.characters.message}</p>
          ) : null}
        </fieldset>

        <div className="grid gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6 py-4 text-lg font-bold text-white shadow-lg hover:brightness-110"
          >
            Создать волшебную сказку
          </button>
          <Link
            href="/history"
            className="rounded-2xl border-2 border-stone-200 px-6 py-4 text-center text-lg font-semibold hover:border-[#667eea]"
          >
            Посмотреть историю сказок
          </Link>
        </div>
      </form>

      {notice ? (
        <p
          role="status"
          className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-red-500 px-4 py-3 text-white shadow-lg"
        >
          {notice}
        </p>
      ) : null}
    </div>
  );
}
