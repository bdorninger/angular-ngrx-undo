import { createSelector } from "@ngrx/store";
import { State } from "./data-reducers";
// import { query } from 'jsonpath/jsonpath';
import {JSONPath} from 'jsonpath-plus';

export interface AddrOptions {
  desc: string;
}

export const selectDataRoot = (state: any): State => {
  // first "data" : key in global store
  // second "data": member in data state
  return state.data;
};

export const selectorData = createSelector(
  selectDataRoot,
  (dataState: State) => {
    console.log("Data: ", dataState);
    return dataState.data;
  }
);

export const selectorRootAddress = createSelector(
  selectDataRoot,
  (dataState: State) => {
    return dataState.data.address;
  }
);

export const selectorAllAddresses = createSelector(
  selectDataRoot,
  (dataState: State, props: AddrOptions) => {    
    return JSONPath({path:`$..children[?(@.desc==='${props.desc}')].address`,json:dataState.data});
    // $..children[?(@.desc==='child2')].address
  }
);
