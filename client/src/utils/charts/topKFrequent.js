export const topKFrequent = (nums, k, category) => {
  const frequencyMap = {};

  // Count occurrences of each element
  for (const num of nums) {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  }

  // Convert map to array of [element, frequency]
  const frequencyArray = Object.entries(frequencyMap);

  // Sort the array based on frequency
  frequencyArray.sort((a, b) => b[1] - a[1]);

  // Get the top k elements
  const topKFrequent = [];
  const maxIndex = Math.min(k, frequencyArray.length); // Ensure k is not greater than the array length
  for (let i = 0; i < maxIndex; i++) {
    let objectToPush = {};
    objectToPush.id = i;
    objectToPush[category] = frequencyArray[i][0];
    objectToPush.frequency = frequencyArray[i][1];
    topKFrequent.push(objectToPush);
  }
  return topKFrequent;
};
