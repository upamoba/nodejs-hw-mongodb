import { Schema,model } from "mongoose";

const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
}, { versionKey: false, timestamps: true, collation: 'session' });

export const Session = model('session', sessionSchema);
