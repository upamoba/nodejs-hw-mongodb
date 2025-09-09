import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  const {
    MONGODB_USER: user,
    MONGODB_PASSWORD: password,
    MONGODB_URL: url,
    MONGODB_DB: db
  } = process.env;

  if (!user || !password || !url || !db) {
    throw new Error('Mongo env variables are missing. Check .env');
  }

  const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${url}/${db}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  console.log('Mongo connection successfully established!');
};
