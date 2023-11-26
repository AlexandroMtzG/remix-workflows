import numeral from "numeral";

export const defaultCurrencySymbol = "$";
export type NumberFormatType = "integer" | "decimal" | "currency" | "percentage" | "rating";
export const NumberFormats: { name: string; value: NumberFormatType }[] = [
  { name: "Integer", value: "integer" },
  { name: "Decimal", value: "decimal" },
  { name: "Currency", value: "currency" },
  { name: "Percent", value: "percentage" },
  { name: "Rating", value: "rating" },
];

const numberFormat = (value: number): string => {
  try {
    return numeral(value).format("0,0");
  } catch (e) {
    return value?.toString();
  }
};
const decimalFormat = (value: number): string => {
  try {
    return numeral(value).format("0,0.00");
  } catch (e) {
    return value?.toString();
  }
};
const intFormat = (value: number | string): string => {
  try {
    return numeral(value).format("0,0");
  } catch (e) {
    return value?.toString();
  }
};
const pad = (num: number, size: number) => {
  const s = "000000000" + num;
  return s.substring(s.length - size);
};
const custom = (value: number, format: string): string => {
  try {
    return numeral(value).format(format);
  } catch (e) {
    return value?.toString();
  }
};

export default {
  numberFormat,
  decimalFormat,
  intFormat,
  pad,
  defaultCurrencySymbol,
  custom,
};
