import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true},
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  },
  { timestamps: true, versionKey: false,  }
);

export const Contact = model('Contact', contactSchema, 'contacts');

