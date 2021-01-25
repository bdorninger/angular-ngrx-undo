export interface Data {
  address: string;
  desc?: string;
  children: Data[];
}

export type Operation = "add" | "remove" | "change";

export interface UndoableOperation<T> {
  operation: Operation;
  props?: { path: string; oldVal?: T; newVal?: T };
}

export interface AddRemoveArgs {
  path: string;
  data?: Data;
}

export interface ChangeArgs<T> {
  path: string;
  newVal: T;
}
