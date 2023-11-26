import { ReactNode } from "react";
import { InputType } from "~/application/enums/shared/InputType";

export type RowHeaderDisplayDto<T> = {
  title: string;
  name: string;
  type?: InputType;
  value: (item: T, idx: number) => any;
  href?: (item: T) => string | undefined;
  formattedValue?: (item: T, idx?: number) => string | ReactNode;
  options?: { name: string; value: number | string; disabled?: boolean }[];
  setValue?: (value: any, idx: number) => void;
  editable?: (item: T, idx?: number) => boolean;
  className?: string;
  sortable?: boolean;
  breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  inputNumberStep?: string;
  inputBorderless?: boolean;
  inputOptional?: boolean;
  sortBy?: string;
  align?: "left" | "center" | "right";
};
