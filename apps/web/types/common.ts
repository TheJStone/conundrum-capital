// apps/web/types/common.ts

import { z } from 'zod';

export type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const RowSchema = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  z.literal(6), z.literal(7), z.literal(8)
]);
export const ColSchema = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10), z.literal(11)
]);


export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 9;
export const TOTAL_SHARES_PER_CHAIN = 25;
