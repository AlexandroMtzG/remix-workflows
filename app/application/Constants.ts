// import { DefaultVisibility } from "./dtos/shared/DefaultVisibility";

const DEFAULT_PAGE_SIZE = 10;
// const DEFAULT_ROW_VISIBILITY = DefaultVisibility.Tenant;
const MAX_PAGE_SIZE = 100;
const MAX_EXPORT_PAGE_SIZE = 100000;
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export default {
  DEFAULT_PAGE_SIZE,
  // DEFAULT_ROW_VISIBILITY,
  MAX_PAGE_SIZE,
  MAX_EXPORT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
};
