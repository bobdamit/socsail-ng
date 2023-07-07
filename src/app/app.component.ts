import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackService, TrackCriteria } from './track.service';
import { TrackResponse } from './track-response';
import {Loader, LoaderOptions} from 'google-maps';
import { environment } from 'src/environments/environment';

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

	@ViewChild('map') mapElement: any;
	map: google.maps.Map;	

	zoom = 9;
	minZoom = 4;
	maxZoom = 18;
	center: google.maps.LatLngLiteral;
	endMarker: google.maps.LatLngLiteral;

	title = 'socsail-ng';

	sidePanelOpened: boolean;

	loading: boolean;
	trackResponse: TrackResponse;
	schmectors : VectorDisplay[];
	showVectors : boolean;
	height : string = "300px";
	big : boolean;
	bigVersionLink : string;
	error: string;

	options: LoaderOptions = { 
		version:"weekly", libraries: ["maps"] 
	}

	gmLoader = new Loader('AIzaSyDnHXOmRnzs8807X8uQ34Zjn7Jut30_SiQ', this.options);

	async loadMap() {
		const google = await this.gmLoader.load();
		console.info("google loaded");

		const mapProps = 	{
			center: {lat: -41.5, lng: -71.8},
			zoom: this.zoom,
			mapTypeId : google.maps.MapTypeId.TERRAIN
		};


		this.map = new google.maps.Map(this.mapElement.nativeElement, mapProps);

		this.trackService.getTrack(this.criteria)
			.subscribe( {
				next:result => {
					this.trackResponse = result;
					this.drawModel();
					this.loading = false;
				},
				error: err => {
					this.error = err;
					this.loading = false;
				}
			});

	}

	ngOnInit(): void {
	
		const urlParams = new URLSearchParams(window.location.search);

		this.bigVersionLink = window.location + "&big=1";


		// Pick up some criteria from the URL query params
		this.criteria.vuid = urlParams.get("vuid");  //e3d634c8-506c-4a75-8eb1-930b37fa5582
		if(!this.criteria.vuid) {
			this.criteria.vuid = environment.defaultVuid;
		}

		if (urlParams.get("start-utc")) {
			this.criteria.fromUtc = new Date(urlParams.get("start-utc"));
		}

		if (urlParams.get("end-utc")) {
			this.criteria.thruUtc = new Date(urlParams.get("end-utc"));
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
		console.error("no vuid on url");
    }
    else {
		console.info(JSON.stringify(this.criteria));
		this.loadMap();
    }

	}



	private drawModel(): void {
		this.center = this.trackResponse.center;
		
		console.info(`Center: ${JSON.stringify(this.center)}`);

		if (this.criteria.hoursBack && this.trackResponse.trackDataList.length) {
			this.endMarker = this.trackResponse.trackDataList[this.trackResponse.trackDataList.length - 1].point;
		}

		let points  =  new Array<google.maps.LatLng>();
		for(let trackPoint of this.trackResponse.trackDataList) {
			points.push(
				new google.maps.LatLng(trackPoint.point.lat, trackPoint.point.lng)
			);
		}
		let line = new google.maps.Polyline(
			{
				path : points,
				geodesic : true,
				strokeColor : "#ff0000",
				strokeOpacity:1.0,
				strokeWeight:2
			}
		);
		line.setMap(this.map);

		// Build data for Vector Display
		let markerUrlBase = "http://earth.google.com/images/kml-icons/track-directional/track-";

		const KnotsPerMPS = 1.943844492441;

		let vectors = new Array<google.maps.Marker>();
		for(let v of this.trackResponse.trackVectorList) {
			let markerIndex = Math.floor(v.bearing/22.5);
			let markerUrl = `${markerUrlBase}${markerIndex.toString()}.png`;

			let kts = v.speedMps * KnotsPerMPS;
			
			let markerText = `${v.dateTimeUtc} (UTC) SOG: ${kts.toFixed(2)} KTs  COG: ${v.bearing.toFixed()} Degrees`;

			vectors.push( new google.maps.Marker( 
				{
				position : {
					lat: v.point.lat, 
					lng : v.point.lng
				}, 
				title : markerText,
				icon : markerUrl,
				map : this.map}));
		}

		this.schmectors = new Array<VectorDisplay>();
		for(let v of this.trackResponse.trackVectorList) {
			let markerIndex = Math.floor(v.bearing/22.5);
			let markerUrl = `${markerUrlBase}${markerIndex.toString()}.png`;

			let kts = v.speedMps * KnotsPerMPS;
			
			let markerText = `${v.dateTimeUtc} (UTC) Speed: ${kts.toFixed(2)} KTs  Bearing: ${v.bearing.toFixed()} Degrees`;

			this.schmectors.push({
				lat: v.point.lat, 
				lng: v.point.lng, 
				txt:markerText, 
				icon: {
					map : this.map, 
					url:markerUrl,scaledSize:{
						height:40,
						width:40
					}
				}
			});
		}

		this.zoom = Math.floor(5000/this.trackResponse.distanceNm);
		this.zoom = Math.max(this.minZoom, this.zoom);
		this.zoom = Math.min(12,this.zoom);
		console.info(`setting zoom to ${this.zoom}`);

		this.map.setZoom(this.zoom);
		this.map.setCenter({
			lat : this.center.lat,
			lng : this.center.lng
		});

	}
}

class VectorDisplay {
	lat : number;
	lng : number;
	icon : any;
	txt : string
}
