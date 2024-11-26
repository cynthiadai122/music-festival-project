import { Request, Response } from "express";
import { fetchFestivalData } from "../services/festivalService";
import { formatFestivalData } from "../api/festivals";

export const getFestivals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const festivalData = await fetchFestivalData();
    const formattedData = formatFestivalData(festivalData);
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch festival data" });
  }
};
