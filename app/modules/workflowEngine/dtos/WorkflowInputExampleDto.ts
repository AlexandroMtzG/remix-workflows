export type WorkflowInputExampleDto = {
  id?: string;
  title: string;
  input: { [key: string]: any };
  createdAt?: Date;
};
