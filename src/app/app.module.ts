import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppComponent } from './components/app.component';
import { TrackViewComponent } from './components/track-view/track-view.component';
import { RoutingModule } from './routing/routing.module';
import { LandingComponent } from './landing/landing.component';


@NgModule({
  declarations: [
    AppComponent,
    TrackViewComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,  HttpClientModule, BrowserAnimationsModule,
	MatSidenavModule,
	MatButtonModule,
	MatIconModule,
	MatGridListModule,
	RoutingModule
  ],
  providers: [HttpClientModule, Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
