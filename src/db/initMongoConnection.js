import mongoose from 'mongoose';

export async function initMongoConnection() {
  const {
    MONGODB_USER: user,
    MONGODB_PASSWORD: password,
    MONGODB_URL: url,
    MONGODB_DB: dbName,
  } = process.env;

  if (!user || !password || !url || !dbName) {
    throw new Error('Mongo env variables are missing. Check .env / Render settings.');
  }

  const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${url}/${dbName}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  console.log('Mongo connection successfully established!');
};

