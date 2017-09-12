import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {TransferArrayComponent} from './transferArray.component';
import {WebWorkerService} from '../web-worker.service';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [AppComponent, TransferArrayComponent],
    providers: [WebWorkerService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
