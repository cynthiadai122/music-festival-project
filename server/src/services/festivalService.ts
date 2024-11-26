// src/services/festivalService.ts
import axios from 'axios';
import { Festival } from '../api/festivals';

const API_URL: string = process.env.API_URL!;
console.log('cynthiatest2 ', API_URL);

if (!API_URL) {
  console.error('Error: API_URL is not defined in .env');
  process.exit(1);
}

export const fetchFestivalData = async (): Promise<Festival[]> => {
  try {
    const response = await axios.get<Festival[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from external API:', error);
    throw new Error('Failed to fetch data from the external API');
  }
};
