import { TopKFrequentType } from "../../types/app";

export const topKFrequent = (
  arr: (number | string)[],
  k: number,
  category: string
) => {
  const frequencyMap: Record<string, number> = {};

  for (const el of arr) {
    const key = String(el);
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
  }

  const frequencyArray: [string, number][] = Object.entries(frequencyMap);

  frequencyArray.sort((a, b) => b[1] - a[1]);

  const topKFrequent: TopKFrequentType[] = [];

  const maxIndex = Math.min(k, frequencyArray.length);
  for (let i = 0; i < maxIndex; i++) {
    const objectToPush: {
      id: number;
      [key: string]: number | string;
      frequency: number;
    } = {
      id: i,
      [category]: frequencyArray[i][0],
      frequency: frequencyArray[i][1],
    };
    topKFrequent.push(objectToPush);
  }

  return topKFrequent;
};
