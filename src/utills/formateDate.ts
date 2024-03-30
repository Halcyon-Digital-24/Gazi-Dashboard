export const formatDateForURL = (date: Date): string => {
  const isoString = date.toISOString();
  return isoString.split("T")[0];
};
