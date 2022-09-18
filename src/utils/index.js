export const valueIsOnRange = (value, lowerLimit, upperLimit) => {
  value = Math.round(value);
  return value >= lowerLimit && value <= upperLimit;
};
