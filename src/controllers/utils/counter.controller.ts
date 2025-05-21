
import { Counter } from '../../models/utils/counter.model';

export const getNextSequenceValue = async (modelName: string, fieldName: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName, field: fieldName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.count;
};