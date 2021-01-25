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
          { address: "ns=2;s=xxx", children: [] },
          { address: "ns=2;s=xxx", children: [] },
          { address: "ns=2;s=xxx", children: [] }
        ]
      },
      { address: "ns=1;s=bbb", desc: "child2", children: [] },
      { address: "ns=1;s=ccc", desc: "child3", children: [] }
    ]
  },
  undoable: [],
  undone: []
};

export const dataReducer = createReducer(
  initialState,
  on(DataActions.addAction, (state, props) => doAdd(state, props)),
  on(DataActions.removeAction, (state, props) => doRemove(state, props)),
  on(DataActions.undoAction, state => doUndo(state)),
  on(DataActions.redoAction, state => doRedo(state))
);

export function reducer(state: State | undefined, action: Action) {
  return dataReducer(state, action);
}

function doAdd(state: State, props: AddRemoveArgs): State {
  console.log("Add called with", state, props);
  const ret = applyDataOp(
    state.data,
    props,
    `newdata.${props.path}.push(props.data)`
  );

  const newUndoable = adjustUndoState(state.undoable, {
    operation: "add",
    props: {
      path: ret.props.path
    }
  });

  return { data: ret.newdata, undoable: newUndoable, undone: [] };
}

function doRemove(state: State, props: AddRemoveArgs): State {
  console.log("Remove called with", state, props);
  const ret = applyDataOp(state.data, props, `newdata.${props.path}.pop()`);

  let newUndoable = [...state.undoable];
  if (ret.props.data !== undefined) {
    newUndoable = adjustUndoState(state.undoable, {
      operation: "remove",
      props: {
        path: ret.props.path,
        oldVal: ret.props.data
      }
    });
  }

  return { data: ret.newdata, undoable: newUndoable, undone: [] };
}

function applyDataOp(
  data: Data,
  props: AddRemoveArgs,
  expr: string
): { newdata: Data; props: AddRemoveArgs } {
  let newdata = JSON.parse(JSON.stringify(data));
  console.log(newdata);
  const retval = eval(expr);
  return { newdata: newdata, props: { path: props.path, data: retval } };
}

function adjustUndoState(
  undoable: UndoableOperation<any>[],
  op: UndoableOperation<any>
): UndoableOperation<any>[] {
  const newUndoable = [...undoable];
  const newRedoable = [];
  newUndoable.push(op);
  return newUndoable;
}

function doUndo(state: State): State {
  const newUndoable = [...state.undoable];
  const newRedoable = [...state.undone];
  let newdata = JSON.parse(JSON.stringify(state.data));

  if (state.undoable.length > 0) {
    const toUndo = newUndoable.pop();
    newdata = undoSingle(toUndo, newdata, newRedoable);
  } else {
    console.log("Nothing to undo");
  }
  return { data: newdata, undoable: newUndoable, undone: newRedoable };
}

function doRedo(state: State): State {
  console.log("Redo called with", state);
  return { ...state };
}

function undoSingle(
  toUndo: UndoableOperation<any>,
  data: Data,
  redoable: UndoableOperation<any>[]
) {
  console.log("Undoing", toUndo);
  let ret: { newdata: Data; props: AddRemoveArgs };
  if (toUndo.operation === "add") {
    ret = applyDataOp(
      data,
      { path: toUndo.props.path, data: undefined },
      `newdata.${toUndo.props.path}.pop()`
    );
  } else if (toUndo.operation === "remove") {
    ret = applyDataOp(
      data,
      { path: toUndo.props.path, data: toUndo.props.oldVal },
      `newdata.${toUndo.props.path}.push(props.data)`
    );
  }
  // adjust redo
  return ret.newdata;
}
