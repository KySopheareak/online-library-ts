import { Document, model, Schema } from "mongoose";

export interface IConfig {
    name: string,
    value: any
    describe: string
}

export type ConfigDocument = Document & IConfig;

const schema = new Schema({
    name: { type: String, required: true },
    value: { type: Object, required: true },
    describe: { type: String, default: '' },
}, { timestamps: true });

export default model<ConfigDocument>('ts_configs', schema);