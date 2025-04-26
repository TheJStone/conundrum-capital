import { Row, Col, RowSchema, ColSchema } from './common';
import { z } from 'zod';

/** A tile’s immutable board coordinate */
export interface Tile {
  row: Row;
  col: Col;
  /** Helper “A1”, “I12” etc. */
  id: string;
}

export const TileSchema = z.object({
  id: z.string(),
  row: RowSchema,
  col: ColSchema,
});
