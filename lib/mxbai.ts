import { Mixedbread } from "@mixedbread/sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MIXEDBREAD_API_KEY) {
  throw new Error("MIXEDBREAD_API_KEY is not set");
}

export const mxbai = new Mixedbread({
  apiKey: process.env.MIXEDBREAD_API_KEY,
});
