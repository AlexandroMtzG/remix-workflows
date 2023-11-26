import { ReactNode } from "react";

export interface RowHeaderActionDto<T> {
  title?: string | ReactNode;
  onClick?: (idx: number, item: T) => void;
  onClickRoute?: (idx: number, item: T) => string | undefined;
  onClickRouteTarget?: undefined | "_blank";
  disabled?: (item: T) => boolean | boolean;
  hidden?: (item: T) => boolean;
  destructive?: boolean;
  firstColumn?: boolean;
  renderTitle?: (item: T) => ReactNode;
  renderIsDestructive?: (item: T) => boolean;
}
