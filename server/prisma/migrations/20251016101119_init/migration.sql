-- CreateTable
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "steps" JSONB[],
    "clientIDs" JSONB[],

    CONSTRAINT "Doc_pkey" PRIMARY KEY ("id")
);
