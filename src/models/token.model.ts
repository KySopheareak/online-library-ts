import { Document, model, Schema } from "mongoose";

export interface IToken {
    id: string;
    token: string;
    token_expired_in: Date;
}

export type TokenDocument = Document & IToken;

const schema = new Schema({
    id: { type: String, required: true },
    token: { type: String, required: true },
    token_expired_in: { type: Date, required: true },
}, { timestamps: true });

export default model<TokenDocument>('ts_tokens', schema);