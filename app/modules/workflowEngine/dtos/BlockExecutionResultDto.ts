export type BlockExecutionResultDto = {
  output: { [key: string]: any } | any | null;
  toBlockIds: string[];
  error?: string | null;
  throwsError?: boolean;
};
