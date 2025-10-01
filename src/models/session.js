import { Schema,model } from "mongoose";

const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    accessToken: { type: String, required: true, index: true },
    refreshToken: { type: String, required: true, index: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
}, {  timestamps: true, collation: 'sessions' });

export const Session = model('Session', sessionSchema);
