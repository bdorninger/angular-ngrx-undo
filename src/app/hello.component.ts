import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { getMessage$, State } from "./datastore/data-reducers";
import * as DataActions from "./datastore/data-actions";
import { Data } from "./data";
import {
  selectorData,
  selectorRootAddress,
  selectorAllAddresses
} from "./datastore/data-selectors";
import { Observable } from "rxjs";

@Component({
  selector: "hello",
  templateUrl: `./hello.component.html`,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `
  ]
})
export class HelloComponent implements OnInit {
  @Input() name: string;

  private msg = "Nothing yet....";

  private _data: Data = {
    address: "n/a",
    desc: "not initialized",
    children:[]
  };

  constructor(private store: Store<State>) {
    getMessage$().subscribe(msg => this.msg = msg);
  }


  public getLastMessage(): string {
    return this.msg;
  }

  public add(): void {
    const postfix = "" + Math.random();
    this.store.dispatch(
      DataActions.addAction({
        path: "children[1].children",
        data: {
          address: "ns=5;s=muzi" + postfix,
          desc: "mydescription",
          children:[]
        }
      })
    );
  }

  public ngOnInit(): void {
    const data$ = this.store.select(selectorData);

    data$.subscribe(data => {
      this._data = data;
    });
  }

  public remove(): void {
    this.store.dispatch(
      DataActions.removeAction({
        path: "children[1].children"        
      })
    );
  }

  public change(): void {}

  public undo(): void {
    this.store.dispatch(DataActions.undoAction());
  }

  public redo(): void {
    this.store.dispatch(DataActions.redoAction());
  }

  public dataRoot(): string {
    return JSON.stringify(this._data, null, 2);
  }

  public dataRootAddress(): Observable<string> {
    return this.store.select(selectorRootAddress);
  }

  public allAddresses() {
    return this.store.select(selectorAllAddresses, { desc: "child3" });
  }
}
