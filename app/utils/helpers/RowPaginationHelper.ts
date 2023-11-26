import { SortedByDto } from "~/application/dtos/data/SortedByDto";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import Constants from "~/application/Constants";
import { FiltersDto } from "~/application/dtos/data/FiltersDto";

export function getPaginationFromCurrentUrl(urlSearchParams: URLSearchParams): { page: number; pageSize: number; sortedBy: SortedByDto[]; query: string } {
  return {
    page: getPageFromCurrentUrl(urlSearchParams),
    pageSize: getPageSizeFromCurrentUrl(urlSearchParams),
    sortedBy: [],
    query: getSearchQueryFromCurrentUrl(urlSearchParams),
  };
}

export function getFiltersFromCurrentUrl(request: Request, properties: FilterablePropertyDto[]): FiltersDto {
  const url = new URL(request.url);
  properties.forEach((property) => {
    const params = url.searchParams.get(property.name);
    property.value = params ?? null;
    if (property.isNumber && property.value) {
      if (isNaN(Number(property.value))) {
        property.value = null;
      }
    }
  });

  const query = url.searchParams.get("q") ?? undefined;

  return { query, properties };
}

function getPageFromCurrentUrl(urlSearchParams: URLSearchParams): number {
  let page = 1;
  const paramsPage = urlSearchParams.get("page");
  if (paramsPage) {
    page = Number(paramsPage);
  }
  if (page <= 0) {
    page = 1;
  }
  return page;
}

function getPageSizeFromCurrentUrl(urlSearchParams: URLSearchParams): number {
  let pageSize = Constants.DEFAULT_PAGE_SIZE;
  const paramsPageSize = urlSearchParams.get("pageSize");
  if (paramsPageSize) {
    pageSize = Number(paramsPageSize);
  }
  if (pageSize > Constants.MAX_PAGE_SIZE) {
    pageSize = Constants.MAX_PAGE_SIZE;
  }
  return pageSize;
}

function getSearchQueryFromCurrentUrl(urlSearchParams: URLSearchParams): string {
  return urlSearchParams.get("q")?.toString() ?? "";
}
