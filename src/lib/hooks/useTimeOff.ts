export const getInitials = (value: string, split: string) => {
  return value.split(split)[0].slice(0, 1).toUpperCase();
};

export const fromValueToReadable = (value: string, split: string) => {
  const word = value.split(split);
  const firstLetter = word[0].slice(0, 1).toUpperCase();
  const restWord = word[0].slice(1);
  const secondWord = word[1];
  return firstLetter + restWord + " " + secondWord;
};

export const fromReadableToValue = (value: string, split: string) => {
  const word = value.split(split);
  const firstLetter = word[0].slice(0, 1).toLowerCase();
  const restWord = word[0].slice(1);
  const secondWord = word[1];
  return firstLetter + restWord + "_" + secondWord;
};