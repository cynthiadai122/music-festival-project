// src/api/festivals.ts

export interface Band {
  name: string;
  recordLabel: string;
}

export interface Festival {
  name: string;
  bands: Band[];
}

export interface RecordLabelData {
  recordLabel: string;
  bands: {
    bandName: string;
    festivals: string[];
  }[];
}

export const sortByKey = <T>(obj: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  );
};

export const formatFestivalData = (data: Festival[]): RecordLabelData[] => {
  const recordLabels: Record<string, Record<string, Set<string>>> = {};

  data.forEach(festival => {
    const festivalName: string = festival.name || 'Unknown Festival';
    const bands: Band[] = festival.bands || [];

    bands.forEach(band => {
      const label: string = band.recordLabel || 'Unknown';
      const bandName: string = band.name;

      if (!recordLabels[label]) {
        recordLabels[label] = {};
      }
      if (!recordLabels[label][bandName]) {
        recordLabels[label][bandName] = new Set();
      }
      recordLabels[label][bandName].add(festivalName);
    });
  });

  return Object.entries(sortByKey(recordLabels)).map(([label, bands]) => ({
    recordLabel: label,
    bands: Object.entries(sortByKey(bands)).map(([bandName, festivals]) => ({
      bandName,
      festivals: Array.from(festivals).sort()
    }))
  }));
};
