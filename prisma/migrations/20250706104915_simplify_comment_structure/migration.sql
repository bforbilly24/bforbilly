-- CreateTable
CREATE TABLE "GuestBookEntry" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorImage" TEXT,
    "parentId" TEXT,
    "repliedToUserId" TEXT,
    "repliedToUserName" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestBookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestBookEntry_shortId_key" ON "GuestBookEntry"("shortId");

-- CreateIndex
CREATE INDEX "GuestBookEntry_createdAt_idx" ON "GuestBookEntry"("createdAt");

-- CreateIndex
CREATE INDEX "GuestBookEntry_parentId_idx" ON "GuestBookEntry"("parentId");

-- CreateIndex
CREATE INDEX "GuestBookEntry_shortId_idx" ON "GuestBookEntry"("shortId");

-- CreateIndex
CREATE INDEX "GuestBookEntry_authorId_idx" ON "GuestBookEntry"("authorId");

-- CreateIndex
CREATE INDEX "GuestBookEntry_isDeleted_idx" ON "GuestBookEntry"("isDeleted");

-- AddForeignKey
ALTER TABLE "GuestBookEntry" ADD CONSTRAINT "GuestBookEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GuestBookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
