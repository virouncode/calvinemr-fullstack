export const isUpdated = (data) => {
  if (!data.updates) {
    return false;
  } else if (data.updates.length === 0) {
    return false;
  } else {
    return true;
  }
};

export const getLastUpdate = (data) => {
  if (!isUpdated(data)) {
    return;
  } else {
    return data.updates.sort((a, b) => b.date_updated - a.date_updated)[0];
  }
};
