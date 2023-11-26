import { Link } from "@remix-run/react";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { InputType } from "~/application/enums/shared/InputType";
import InputNumber from "~/components/ui/input/InputNumber";
import InputSelect from "~/components/ui/input/InputSelect";
import InputText from "~/components/ui/input/InputText";

function displayRowValue<T>(header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  return (
    <>
      {!header.setValue ? (
        <>
          {header.href !== undefined && header.href(item) ? (
            <Link to={header.href(item) ?? ""} className="rounded-md border-b border-dashed border-transparent hover:border-gray-400 focus:bg-gray-100">
              <span>{header.formattedValue ? header.formattedValue(item, idxRow) : header.value(item, idxRow)}</span>
            </Link>
          ) : (
            <span>{header.formattedValue ? header.formattedValue(item, idxRow) : header.value(item, idxRow)}</span>
          )}
        </>
      ) : (
        <>
          {header.type === undefined || header.type === InputType.TEXT ? (
            <InputText
              borderless={header.inputBorderless}
              withLabel={false}
              name={header.name}
              title={header.title}
              value={header.value(item, idxRow)}
              disabled={header.editable && !header.editable(item, idxRow)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(e, idxRow);
                }
              }}
              required={!header.inputOptional}
            />
          ) : header.type === InputType.NUMBER ? (
            <InputNumber
              borderless={header.inputBorderless}
              withLabel={false}
              name={header.name}
              title={header.title}
              value={header.value(item, idxRow)}
              disabled={header.editable && !header.editable(item)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(e, idxRow);
                }
              }}
              required={!header.inputOptional}
              step={header.inputNumberStep}
            />
          ) : header.type === InputType.SELECT ? (
            <InputSelect
              borderless={header.inputBorderless}
              withLabel={false}
              name={header.name}
              title={header.title}
              value={header.value(item, idxRow)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(Number(e), idxRow);
                }
              }}
              options={header.options ?? []}
              required={!header.inputOptional}
              disabled={header.editable && !header.editable(item)}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default {
  displayRowValue,
};
