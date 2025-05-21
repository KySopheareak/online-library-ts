import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IErrorLog {
    route: string;
    source: string;
    describe: string;
    error: object;
    data: object;
    ref_id: string;
    updated_by?: IUser | Types.ObjectId | null;
}

export type ErrorLogDocument = Document & IErrorLog;

const schema = new Schema(
    {
        route: { type: String },
        source: { type: String },
        describe: { type: String },
        error: { type: Object },
        data: { type: Object }
    },
    { timestamps: true }
);

export default model<ErrorLogDocument>("ts_error_logs", schema);
