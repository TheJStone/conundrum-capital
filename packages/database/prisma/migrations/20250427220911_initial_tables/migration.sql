-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PuzzleLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "seedTiles" TEXT NOT NULL,
    "initialRack" TEXT NOT NULL,
    "initialShares" TEXT NOT NULL,
    "initialCash" INTEGER NOT NULL,
    "parScore" INTEGER NOT NULL,
    "turnLimit" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "netWorth" INTEGER NOT NULL,
    "turnsUsed" INTEGER NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "PuzzleLevel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Game_puzzleId_idx" ON "Game"("puzzleId");

-- CreateIndex
CREATE INDEX "Game_status_idx" ON "Game"("status");
