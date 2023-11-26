import clsx from "clsx";
import DateUtils, { DateDisplay } from "~/utils/shared/DateUtils";

export default function DateCell({ date, displays = ["ymd", "ago"] }: { date: Date | null; displays?: DateDisplay[] }) {
  return (
    <>
      {date && (
        <div title={DateUtils.dateYMDHMS(date)} className="flex flex-col">
          {displays.includes("ymd") && <div>{DateUtils.dateYMD(date)}</div>}
          {displays.includes("dm") && <div>{DateUtils.dateDM(date)}</div>}
          {displays.includes("ago") && <div className={clsx(displays.length > 1 && "text-xs")}>{DateUtils.dateAgo(date)}</div>}
          {displays.includes("mdy") && <div>{DateUtils.dateMonthDayYear(date)}</div>}
          {displays.includes("hms") && <div>{DateUtils.dateHMS(date)}</div>}
        </div>
      )}
    </>
  );
}
