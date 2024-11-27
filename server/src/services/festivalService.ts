import axios from "axios";
import { Festival } from "../api/festivals";

export const fetchFestivalData = async (): Promise<Festival[]> => {
  const API_URL: string = process.env.API_URL!;

  if (!API_URL) {
    throw new Error("Error: API_URL is not defined in .env");
  }

  try {
    const response = await axios.get<Festival[]>(
      `${API_URL}codingtest/api/v1/festivals/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data from the external API");
  }
};
