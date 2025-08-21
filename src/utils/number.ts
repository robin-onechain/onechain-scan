import Decimal from "decimal.js";

/**
 * 将传入的字符串或数字格式化为带有逗号分隔的字符串
 * @param value - 需要格式化的字符串或数字
 * @returns 格式化后的字符串，如果传入的是 null 或 undefined，则返回空字符串
 */
export const formatNumberWithCommas = (
  value: string | number | null | undefined
): string => {
  if (!value && value !== 0) {
    return "";
  }
  const strValue = value.toString();
  const [integerPart, decimalPart] = strValue.split(".");
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

/**
 * 将传入的 MIST 值换算为指定单位，并返回格式化的字符串
 * @param mistValue - 需要换算的 MIST 值
 * @param unit - 单位，默认为 OCT
 * @param precision - 精度，默认为 9
 * @param showMist - 是否显示括号中的 MIST 值，默认显示
 * @returns 格式化后的字符串，形如 "xxx 单位 （xxx MIST）"
 */
export const convertMist = (
  mistValue: number | null | undefined,
  unit = "OCT",
  showMist = true,
  precision = 9
): string => {
  if ((!mistValue && mistValue !== 0) || isNaN(Number(mistValue))) {
    return "";
  }
  const hcValue = new Decimal(mistValue).dividedBy(
    new Decimal(10).pow(precision)
  );
  const formattedHcValue = hcValue.toFixed(precision).replace(/\.?0+$/, "");
  const formattedMistValue = formatNumberWithCommas(mistValue);
  return showMist
    ? `${formattedHcValue} ${unit}/${formattedMistValue} MIST`
    : `${formattedHcValue} ${unit}`;
};

export const yz_segmentation_text = (
  value: string | number | null | undefined
): string => {
  if (value.indexOf("/") !== -1) {
    return {
      a: value.split("/")[0],
      b: value.split("/")[1]
    };
  } else {
    return {
      a: "",
      b: ""
    };
  }
};
