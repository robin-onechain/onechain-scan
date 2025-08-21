import moment from "moment";

/**
 * 计算时间戳之间的差异，并格式化为耗时
 * @param timestamp - 传入的时间戳（毫秒级别的UTC时间）
 * @returns 格式化后的耗时字符串
 */
export function calculateAge(timestamp: number | string): string {
  if (isNaN(Number(timestamp))) {
    return "";
  }

  const now = moment();
  const past = moment(Number(timestamp));
  if (past.isSameOrAfter(now)) {
    return "1s";
  }

  const diff = moment.duration(now.diff(past));

  if (diff.asMilliseconds() < 1000) {
    return "1s";
  }

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();
  const seconds = diff.seconds();

  let result = "";
  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (seconds > 0 || result === "") {
    result += `${seconds}s`;
  }

  return result.trim();
}
