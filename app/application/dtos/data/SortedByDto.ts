// import { Entity, Property } from "@prisma/client";

export interface SortedByDto {
  name: string;
  direction: "asc" | "desc";
  property?: any;
  entity?: any;
}
