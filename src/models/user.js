import { Schema, model }  from "mongoose";


const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

}, { timestamps: true, versionKey: false });
export const User = model('user', userSchema);

