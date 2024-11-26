import dotenv from "dotenv";

dotenv.config();

export const API_URL = process.env.API_URL;
export const PORT = process.env.PORT || 5000;

if (!API_URL) {
  console.error("Error: API_URL is not defined in .env");
  process.exit(1);
}
