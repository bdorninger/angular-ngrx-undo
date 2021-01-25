import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "./datastore/data-reducers";
import * as DataActions from "./datastore/data-actions";
import { Data } from "./data";
import { selectorData,selectorRootAddress, selectorAllAddresses } from "./datastore/data-selectors"
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

  private _data: Data = {
    address: 'n/a',
    desc: 'not initialized'
  };

  constructor(private store: Store<State>) {}

  public add(): void {
    const postfix = "" + Math.random();
    this.store.dispatch(
      DataActions.addAction({
        path: "myPath" + postfix,
        data: {
          address: "ns=2;s=muzi" + postfix,
          desc: "mydescription" + postfix
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

  public remove(): void {}

  public change(): void {}

  public undo(): void {
    this.store.dispatch(DataActions.undoAction());
  }

  public redo(): void {
    this.store.dispatch(DataActions.redoAction());
  }

  public dataRoot(): string {
    return JSON.stringify(this._data,null,2);
  }

  public dataRootAddress(): Observable<string> {
    return this.store.select(selectorRootAddress);
  }

  public allAddresses() {
    return this.store.select(selectorAllAddresses, { desc: 'child3'});
  }
}
