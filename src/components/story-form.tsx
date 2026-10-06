"use client";

import { CHARACTERS, GENRES, LANGUAGE_OPTIONS, genreLabel } from "@/domain/catalog";
import { validationCopy } from "@/domain/messages";
import { createStoryRequestSchema, type StoryRequest } from "@/domain/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "./locale-provider";
import { Check, Chevron } from "./mark";

function selectedCharacters(input: HTMLInputElement): string[] {
  const boxes = input.form?.querySelectorAll('input[name="characters"]:checked');
  if (!boxes) return [];
  return Array.from(boxes).map((node) => (node as HTMLInputElement).value);
}

export function StoryForm({
  initial,
  onSubmit,
}: {
  initial?: StoryRequest | null;
  onSubmit: (data: StoryRequest) => void;
}) {
  const { locale, messages } = useLocale();
  const schema = useMemo(() => createStoryRequestSchema(validationCopy(locale)), [locale]);
  const [tooMany, setTooMany] = useState(false);
  const [selected, setSelected] = useState<string[]>(initial?.characters ?? []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: initial?.age,
      language: initial?.language ?? locale,
      genre: initial?.genre,
      characters: initial?.characters ?? [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" noValidate>
      <div>
        <div className="group">
          <div className="row">
            <label htmlFor="age" className="row-label">
              {messages.age}
            </label>
            <input
              id="age"
              type="number"
              inputMode="numeric"
              enterKeyHint="done"
              min={1}
              max={10}
              className="row-control"
              style={{ maxWidth: "5.5rem" }}
              aria-invalid={errors.age ? true : undefined}
              aria-describedby={errors.age ? "age-hint age-error" : "age-hint"}
              {...register("age", { valueAsNumber: true })}
            />
          </div>
          <div className="row">
            <label htmlFor="genre" className="row-label">
              {messages.genre}
            </label>
            <select
              id="genre"
              className="row-control row-select"
              defaultValue={initial?.genre ?? ""}
              aria-invalid={errors.genre ? true : undefined}
              aria-describedby={errors.genre ? "genre-error" : undefined}
              {...register("genre")}
            >
              <option value="" disabled>
                {messages.choose}
              </option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genreLabel(locale, genre)}
                </option>
              ))}
            </select>
            <span style={{ color: "var(--tint)" }}>
              <Chevron />
            </span>
          </div>
        </div>
        <p id="age-hint" className="foot">
          {messages.ageHint}
        </p>
        {errors.age ? (
          <p id="age-error" className="foot" style={{ color: "var(--danger)" }}>
            {errors.age.message}
          </p>
        ) : null}
        {errors.genre ? (
          <p id="genre-error" className="foot" style={{ color: "var(--danger)" }}>
            {errors.genre.message}
          </p>
        ) : null}
      </div>

      <fieldset
        aria-invalid={errors.language ? true : undefined}
        aria-describedby={errors.language ? "language-error" : undefined}
      >
        <legend className="section">{messages.storyLanguage}</legend>
        <div className="segment">
          {LANGUAGE_OPTIONS.map((language) => (
            <label key={language.value} className="segment-item">
              <input
                type="radio"
                value={language.value}
                defaultChecked={(initial?.language ?? locale) === language.value}
                className="sr-only"
                {...register("language")}
              />
              {language.label}
            </label>
          ))}
        </div>
        {errors.language ? (
          <p id="language-error" className="foot" style={{ color: "var(--danger)" }}>
            {errors.language.message}
          </p>
        ) : null}
      </fieldset>

      <fieldset
        aria-invalid={errors.characters ? true : undefined}
        aria-describedby={errors.characters ? "characters-hint characters-error" : "characters-hint"}
      >
        <legend className="section">{messages.characters}</legend>
        {(["ru", "kk"] as const).map((group) => (
          <div key={group} className={group === "kk" ? "mt-4" : undefined}>
            <h2 className="section">{group === "ru" ? messages.russianHeroes : messages.kazakhHeroes}</h2>
            <div className="group">
              {CHARACTERS.filter((character) => character.group === group).map((character) => {
                const checked = selected.includes(character.value);
                const disabled = !checked && selected.length >= 5;
                return (
                  <label key={character.value} className="choice row">
                    <input
                      type="checkbox"
                      value={character.value}
                      className="sr-only"
                      disabled={disabled}
                      {...register("characters", {
                        onChange: (event) => {
                          const input = event.target as HTMLInputElement;
                          let values = selectedCharacters(input);
                          if (values.length > 5) {
                            input.checked = false;
                            values = values.filter((value) => value !== input.value);
                            setTooMany(true);
                          } else {
                            setTooMany(false);
                          }
                          setSelected(values);
                        },
                      })}
                    />
                    <span className="name">{character.label}</span>
                    <Check />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <p id="characters-hint" className="foot" aria-live="polite">
          {messages.picked(selected.length)}
        </p>
        {tooMany ? (
          <p className="foot" style={{ color: "var(--danger)" }} role="status">
            {messages.tooMany}
          </p>
        ) : null}
        {errors.characters?.message ? (
          <p id="characters-error" className="foot" style={{ color: "var(--danger)" }}>
            {errors.characters.message}
          </p>
        ) : null}
      </fieldset>

      <button type="submit" className="btn btn-fill">
        {messages.createStory}
      </button>
    </form>
  );
}
