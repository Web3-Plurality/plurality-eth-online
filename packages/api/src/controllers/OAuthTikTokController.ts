import express, { Request, Response } from "express";
import * as dotenv from 'dotenv';

export const tiktokRouter = express.Router();

dotenv.config();

tiktokRouter.get('/', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/v2/auth/authorize/';

    // the following params need to be in `application/x-www-form-urlencoded` format.
    url += `?client_key=${process.env.CLIENT_KEY}`;
    url += '&scope=user.info.basic';
    url += '&response_type=code';
    url += `&redirect_uri=${process.env.SERVER_ENDPOINT_REDIRECT}`;
    url += '&state=' + csrfState;

    res.redirect(url);
})

tiktokRouter.get('/callback', (req, res) => {
      console.log("triggered!")
      console.log(req)
    }
  );