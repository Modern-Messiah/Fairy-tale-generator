"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import type { StoryRequest } from "@/domain/schema";
import { useLocale } from "./locale-provider";
import { StoryForm } from "./story-form";
import { StoryStream } from "./story-stream";

const spring = { type: "spring" as const, bounce: 0, duration: 0.4 };
const fade = { duration: 0.2, ease: "easeOut" as const };

const panel = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
};

export function StoryStudio() {
  const { locale, messages } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const seenStream = useRef(false);
  const reduce = useReducedMotion();
  const [request, setRequest] = useState<StoryRequest | null>(null);
  const [writing, setWriting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!writing && seenStream.current) headingRef.current?.focus();
  }, [writing]);

  const showForm = !writing || !request;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {showForm ? (
          <motion.section
            key="compose"
            custom={direction}
            variants={panel}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? fade : spring}
          >
            <h1 ref={headingRef} tabIndex={-1} className="large-title outline-none">
              {messages.newStory}
            </h1>
            <p className="lede">{messages.lede}</p>
            <div className="mt-6">
              <StoryForm
                key={request ? "resume" : locale}
                initial={request}
                onSubmit={(data) => {
                  seenStream.current = true;
                  setDirection(1);
                  setRequest(data);
                  setWriting(true);
                  setAttempt((value) => value + 1);
                }}
              />
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="writing"
            custom={direction}
            variants={panel}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? fade : spring}
          >
            <StoryStream
              request={request}
              attempt={attempt}
              onRetry={() => setAttempt((value) => value + 1)}
              onNew={() => {
                setDirection(-1);
                setWriting(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
