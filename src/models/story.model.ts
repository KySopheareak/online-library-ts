import { Document, model, Schema } from "mongoose";

export interface IStory extends Document {
  content: any;
}

const StorySchema = new Schema<IStory>({
  content: { type: Schema.Types.Mixed, required: true },
});

export default model<IStory>("stories", StorySchema);