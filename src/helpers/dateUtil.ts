export const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

export const createDateString = (date: Date) => {
  if (date.getFullYear() === new Date().getFullYear()) {
    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long' });
  }
  else {
    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
  }
};