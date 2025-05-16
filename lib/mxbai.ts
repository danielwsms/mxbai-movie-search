import { Mixedbread } from "@mixedbread/sdk";

if (!process.env.MIXEDBREAD_API_KEY) {
  throw new Error("MIXEDBREAD_API_KEY is not set");
}

export const mxbai = new Mixedbread({
  apiKey: process.env.MIXEDBREAD_API_KEY,
});
