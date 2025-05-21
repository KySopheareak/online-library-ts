import { Document, model, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IAuditLog {
    route: string;
    source: string;
    describe: string;
    response: object;
    data: object;
    ref_id: string;
    updated_by?: IUser | Types.ObjectId;
}

export type AuditLogDocument = Document & IAuditLog;

const schema = new Schema(
    {
        route: { type: String },
        source: { type: String },
        describe: { type: String },
        response: { type: Object },
        data: { type: Object },
        ref_id: { type: String },
        updated_by: { type: Types.ObjectId, require: false, ref: 'users', default: null }
    },
    { timestamps: true }
);

export default model<AuditLogDocument>("audit_logs", schema);
