-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "characters" JSONB NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Story_createdAt_idx" ON "Story"("createdAt");

-- CreateIndex
CREATE INDEX "Story_language_idx" ON "Story"("language");

-- CreateIndex
CREATE INDEX "Story_age_idx" ON "Story"("age");
