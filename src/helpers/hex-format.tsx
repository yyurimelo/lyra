export const isHexColor = (value: string) => {
  value = value.replace(/[^0-9a-fA-F]/g, "");
  value = value.slice(0, 6);
  const formattedValue = "#" + value;
  return formattedValue;
};
