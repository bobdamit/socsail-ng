import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../components/app.component';
import { TrackViewComponent } from '../components/track-view/track-view.component';
import { LandingComponent } from '../landing/landing.component';


const routes: Routes = [

	{ 
		path: 'track', 
		component: TrackViewComponent 
	},
	{
		path: 'home', 
		component: LandingComponent
	}
//	,
//	{
//		path: 'user',
//		component: UserComponent
//	}

 ];


 @NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
 })
export class RoutingModule { }
