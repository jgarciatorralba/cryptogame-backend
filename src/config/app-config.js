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
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    serverDomain: process.env.SERVER_DOMAIN,
    clientDomain: process.env.CLIENT_DOMAIN,
    initialBalance: parseInt(process.env.INITIAL_BALANCE)
  },
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME
  }
};