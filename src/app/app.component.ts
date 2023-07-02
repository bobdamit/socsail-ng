import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackService, TrackCriteria } from './track.service';
import { TrackResponse } from './track-response';
import { AgmMap } from '@agm/core';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

// https://angular-maps.com/api-docs/agm-core/index.html

export class AppComponent implements OnInit {

	constructor(private trackService: TrackService) {
		this.criteria = new TrackCriteria();
	}
	criteria: TrackCriteria;

	@ViewChild('map', { static: true }) map: AgmMap;

	zoom = 9;
	minZoom = 4;
	maxZoom = 18;
	center: google.maps.LatLngLiteral;
	endMarker: google.maps.LatLngLiteral;

	title = 'socsail-ng';

	sidePanelOpened: boolean;

	loading: boolean;
	result: TrackResponse;
	vectors : VectorDisplay[];
	showVectors : boolean;
	height : string = "300px";
	big : boolean;
	bigVersionLink : string;
	error: string;


	ngOnInit(): void {
		const urlParams = new URLSearchParams(window.location.search);

		this.bigVersionLink = window.location + "&big=1";

		this.map.mapTypeId = "HYBRID";

		// Pick up some criteria from the URL query params
		this.criteria.vuid = urlParams.get("vuid");  //e3d634c8-506c-4a75-8eb1-930b37fa5582
		if (urlParams.get("start")) {
			this.criteria.from = new Date(urlParams.get("start"));
		}

		if (urlParams.get("end")) {
			this.criteria.thru = new Date(urlParams.get("end"));
		}

		if (urlParams.get("hrsback")) {
			this.criteria.hoursBack = parseInt(urlParams.get("hrsback"));
		}

		if(urlParams.get("big")) {
			this.height = "600px";
			this.big = true;
		}

    if(!this.criteria.vuid) {
      this.error = "No Vessel ID";
    }
    else {
      this.fetchAndDraw();
    }


	}

  private fetchAndDraw() {
		this.loading = true;

		this.trackService.getTrack(this.criteria)
			.subscribe(
				result => {
					this.result = result;
					this.buildModel();
					this.loading = false;
				},
				error => {
					this.error = error;
					console.log("caught error " + error.message);
					this.loading = false;
				}
			);


		this.center = {
			lat: 41.5,
			lng: -71,
		};

  }

	private buildModel(): void {
		this.center = this.result.center;
		if (this.criteria.hoursBack && this.result.trackDataList.length) {
			this.endMarker = this.result.trackDataList[this.result.trackDataList.length - 1].point;
		}

		// Build data for Vector Display
		let markerUrlBase = "http://earth.google.com/images/kml-icons/track-directional/track-";

		this.vectors = new Array<VectorDisplay>();
		for(let v of this.result.trackVectorList) {
			let markerIndex = Math.floor(v.bearing/22.5);
			let markerUrl = markerUrlBase.concat(markerIndex.toString()).concat(".png");
			let kts = v.speedMps * 1.943844492441;
			let markerText = `${v.dateTime}: Speed: ${kts.toFixed(2)}  Bearing: ${v.bearing.toFixed()} Degrees`;
			this.vectors.push({lat: v.point.lat, lng: v.point.lng, txt:markerText, icon: {url:markerUrl,scaledSize:{height:40,width:40}}} );
		}

		this.zoom = Math.floor(5000/this.result.distanceNm);
		this.zoom = Math.max(this.minZoom, this.zoom);
		this.zoom = Math.min(12,this.zoom);
		console.log(`setting zoom to ${this.zoom}`);
	}
}

class VectorDisplay {
	lat : number;
	lng : number;
	icon : any;
	txt : string
}
