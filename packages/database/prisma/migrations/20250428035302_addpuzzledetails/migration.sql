/*
  Warnings:

  - Added the required column `difficulty` to the `PuzzleLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solutionBuys` to the `PuzzleLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solutionMoves` to the `PuzzleLevel` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `PuzzleLevel` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PuzzleLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "seedTiles" TEXT NOT NULL,
    "initialRack" TEXT NOT NULL,
    "initialShares" TEXT NOT NULL,
    "initialCash" INTEGER NOT NULL,
    "parScore" INTEGER NOT NULL,
    "turnLimit" INTEGER NOT NULL,
    "solutionMoves" TEXT NOT NULL,
    "solutionBuys" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PuzzleLevel" ("createdAt", "description", "id", "initialCash", "initialRack", "initialShares", "name", "parScore", "seedTiles", "turnLimit") SELECT "createdAt", "description", "id", "initialCash", "initialRack", "initialShares", "name", "parScore", "seedTiles", "turnLimit" FROM "PuzzleLevel";
DROP TABLE "PuzzleLevel";
ALTER TABLE "new_PuzzleLevel" RENAME TO "PuzzleLevel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
