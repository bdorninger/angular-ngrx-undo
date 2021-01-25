import { AddRemoveArgs, Data, UndoableOperation } from "../data";
import { createReducer, on, Action } from "@ngrx/store";
import * as DataActions from "./data-actions";

export interface State {
  data: Data;
  undoable: UndoableOperation<any>[];
  undone: UndoableOperation<any>[];
}

export const initialState: State = {
  data: {
    address: "ns=0;i=1",
    desc: "Root",
    children: [
      {
        address: "ns=1;s=aaa",
        desc: "child1",
        children: [
          { address: "ns=2;s=xxx" },
          { address: "ns=2;s=xxx" },
          { address: "ns=2;s=xxx" }
        ]
      },
      { address: "ns=1;s=bbb", desc: "child2" },
      { address: "ns=1;s=ccc", desc: "child3" }
    ]
  },
  undoable: [],
  undone: []
};

export const dataReducer = createReducer(
  initialState,
  on(DataActions.addAction, (state, props) => doAdd(state, props)),
  on(DataActions.undoAction, state => doUndo(state)),
  on(DataActions.redoAction, state => doRedo(state))
);

export function reducer(state: State | undefined, action: Action) {
  return dataReducer(state, action);
}

function doAdd(state: State, props: AddRemoveArgs): State {
  console.log("Add called with", state, props);
  const undoable: UndoableOperation<Data> = {
    operation: "remove",
    props: {
      path: props.path
    }
  };
  const newUndoable = [...state.undoable];
  newUndoable.push(undoable);
  return { ...state, undoable: newUndoable };
}

function doUndo(state: State): State {
  console.log("Undo called with", state);
  const newUndoable = [...state.undoable];
  if (state.undoable.length > 0) {
    const toUndo = newUndoable.pop();
    console.log("Undoing", toUndo);
  } else {
    console.log("Nothing to undo");
  }
  return { ...state, undoable: newUndoable };
}

function doRedo(state: State): State {
  console.log("Redo called with", state);
  return { ...state };
}
