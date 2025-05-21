import { Schema, model } from 'mongoose';

interface ICounter {
  model: string;
  field: string;
  count: number;
}

const counterSchema = new Schema<ICounter>({
  model: { type: String, required: true },
  field: { type: String, required: true },
  count: { type: Number, default: 0 }
});

export const Counter = model<ICounter>('Counter', counterSchema);