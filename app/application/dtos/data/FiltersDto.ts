import { FilterablePropertyDto } from "./FilterablePropertyDto";

export interface FiltersDto {
  properties: FilterablePropertyDto[];
  query?: string | null;
}
