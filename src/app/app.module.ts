import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { GoogleMapComponent } from './google.map/google.map.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent
  ],
  imports: [
    BrowserModule,  HttpClientModule, BrowserAnimationsModule,
	MatSidenavModule,
	MatButtonModule,
	MatIconModule,
	MatGridListModule
  ],
  providers: [HttpClientModule, Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
