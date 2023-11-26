import moment from "moment";

export type DateFormatType = "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "diff";
export const DateFormats: { name: string; value: DateFormatType }[] = [
  { name: "YYYY-MM-DD", value: "YYYY-MM-DD" },
  { name: "DD-MM-YYYY", value: "DD-MM-YYYY" },
  { name: "MM-DD-YYYY", value: "MM-DD-YYYY" },
  { name: "Diff", value: "diff" },
];
export type DateDisplay = "ymd" | "ago" | "dm" | "mdy" | "hms";
const dateAgo = (value: Date | string | null | undefined): string => {
  const today = moment(new Date());
  const at = moment(value);
  const days = Math.abs(today.diff(at, "days"));
  // if (unitOfTime) {
  //   return moment(at)
  //     .startOf(unitOfTime)
  //     .fromNow();
  // }
  if (days <= 1) {
    return moment(at).startOf("minute").fromNow();
  } else if (days <= 7) {
    return moment(at).startOf("day").fromNow();
  } else if (days <= 30) {
    return moment(at).startOf("week").fromNow();
  } else if (days <= 30 * 12) {
    return moment(at).startOf("month").fromNow();
  } else if (days <= 30 * 12 * 2) {
    return moment(at).startOf("year").fromNow();
  } else {
    return moment(at).format("YYYY-MM-DD");
  }
};
const dateYMD = (value: Date | string | null | undefined): string => {
  return moment(value).format("YYYY-MM-DD");
};
const dateDMY = (value: Date | string | null | undefined): string => {
  return moment(value).format("DD-MM-YYYY");
};
const dateMDY = (value: Date | string | null | undefined): string => {
  return moment(value).format("MM-DD-YYYY");
};
const dateLL = (value: Date | string | null | undefined): string => {
  return moment(value).format("YYYY-MM-DD");
};
const dateYMDHMS = (value: Date | string | null | undefined): string => {
  return moment(value).format("YYYY-MM-DD HH:mm:ss");
};
const dateMonthName = (value: Date | string | null | undefined): string => {
  return moment(value).format("MMMM YYYY");
};
const dateDM = (value: Date | string | null | undefined): string => {
  return moment(value).format("D MMM");
};
const dateMonthDayYear = (value: Date | string | null | undefined): string => {
  return moment(value).format("MMMM D, YYYY");
};
const dateHMS = (value: Date | string | null | undefined): string => {
  return moment(value).format("HH:mm:ss");
};

const daysFromDate = (value: Date, days: number) => {
  return new Date(new Date().setDate(value.getDate() + days));
};

const diffDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return (utc2 - utc1) / _MS_PER_DAY;
};

const add = (value: Date, days: number) => {
  return new Date(new Date().setDate(value.getDate() + days));
};

const getMonths = () => {
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
};

const getMonthName = (month: number): string => {
  const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (month >= 1 && month <= 12) {
    return months[month - 1].substring(0, 3);
  }
  return "";
};

const isCurrentMonth = (year: number, month: number): boolean => {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() + 1 === month;
};

const gteFromFilter = (filter: string, from?: Date) => {
  let gte: Date | undefined = undefined;
  if (!from) {
    from = new Date();
  }

  if (filter === "last-24-hours") {
    gte = daysFromDate(from, 1 * -1);
  } else if (filter === "last-7-days") {
    gte = daysFromDate(from, 7 * -1);
  } else if (filter === "last-30-days") {
    gte = daysFromDate(from, 30 * -1);
  } else if (filter === "last-3-months") {
    gte = daysFromDate(from, 30 * 3 * -1);
  } else if (filter === "last-6-months") {
    gte = daysFromDate(from, 30 * 6 * -1);
  } else if (filter === "last-year") {
    gte = daysFromDate(from, 30 * 12 * -1);
  } else {
    // eslint-disable-next-line no-console
    console.log("gteFromFilter: filter not found", filter);
  }
  return gte;
};

const getDuration = ({ start, end, format = "s" }: { start: Date; end: Date; format: "ms" | "s" | "m" | "h" | "d" | "w" | "M" | "y" }) => {
  const diff = +new Date(end) - +new Date(start);
  const seconds = Math.floor(diff / 1000);
  switch (format) {
    case "ms":
      return diff;
    case "s":
      return seconds;
    case "m":
      return Math.floor(seconds / 60);
    case "h":
      return Math.floor(seconds / 3600);
    case "d":
      return Math.floor(seconds / 86400);
    case "w":
      return Math.floor(seconds / 604800);
    case "M":
      return Math.floor(seconds / 2592000);
    case "y":
      return Math.floor(seconds / 31536000);
    default:
      return diff;
  }
};

function getDurationInSeconds({ start, end }: { start: Date | null; end: Date | null }) {
  if (start && end) {
    const diff = +new Date(end) - +new Date(start);
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    }
  }
  return "-";
}

export default {
  dateAgo,
  dateYMD,
  dateDMY,
  dateMDY,
  dateLL,
  dateYMDHMS,
  dateMonthName,
  dateDM,
  dateHMS,
  dateMonthDayYear,
  daysFromDate,
  diffDays,
  add,
  getMonths,
  getMonthName,
  isCurrentMonth,
  gteFromFilter,
  getDuration,
  getDurationInSeconds,
};
