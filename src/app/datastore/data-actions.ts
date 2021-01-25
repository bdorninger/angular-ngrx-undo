import { createAction, props } from "@ngrx/store";
import { AddRemoveArgs, ChangeArgs } from "../data";

export const addAction = createAction("[Data] add", props<AddRemoveArgs>());
export const removeAction = createAction(
  "[Data] remove",
  props<AddRemoveArgs>()
);
export const changeAction = createAction(
  "[Data] change",
  props<ChangeArgs<string>>()
);

export const undoAction = createAction("[Data] undo");
export const redoAction = createAction("[Data] redo");
