import { Colors } from "~/application/enums/shared/Colors";

export interface FilterablePropertyDto {
  name: string;
  title: string;
  manual?: boolean;
  condition?: string;
  value?: string | null;
  options?: { name: string; value: string; color?: Colors }[];
  isNumber?: boolean;
  isBoolean?: boolean;
  hideSearch?: boolean;
}
