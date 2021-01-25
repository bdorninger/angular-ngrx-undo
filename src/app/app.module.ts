import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { StoreModule } from "@ngrx/store";
import * as DataReducer from "./datastore/data-reducers";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ data: DataReducer.reducer })
  ],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
