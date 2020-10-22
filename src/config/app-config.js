import dotenv from 'dotenv';
import fs from 'fs';

const result = dotenv.config();

if (result.error) {
  console.log("⚠️  Couldn't find .env file, creating one from .env.example");
  fs.copyFileSync('.env.example', '.env');
  dotenv.config();
}

export default {
  app: {
    port: parseInt(process.env.APP_PORT),
    saltRounds: process.env.SALT_ROUNDS,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
  },
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
};