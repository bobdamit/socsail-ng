import { Component, ViewChild } from '@angular/core';
import { TrackCriteria, TrackService } from '../../services/track.service';
import { Meta } from '@angular/platform-browser';
import { TrackResponse } from '../../models/track-response';
import { Loader, LoaderOptions } from 'google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-track-view',
  templateUrl: './track-view.component.html',
  styleUrls: ['./track-view.component.scss']
})
export class TrackViewComponent {
	constructor(private trackService: TrackService, private metaService : Meta) {
		this.criteria = new TrackCriteria();
	}
	criteria: TrackCriteria;

	@ViewChild('map') mapElement: any;
	map: google.maps.Map;

	zoom = 9;
	readonly minZoom = 6;
	readonly maxZoom = 18;
	center: google.maps.LatLngLiteral;
	endMarker: google.maps.LatLngLiteral;


	title = 'socsail-ng';

	loading: boolean;
	trackResponse: TrackResponse;
	showVectors: boolean;
	height: string = "300px";
	error: any;

	options: LoaderOptions = {
		version: "weekly", libraries: ["maps"]
	}

	gmLoader = new Loader('AIzaSyDnHXOmRnzs8807X8uQ34Zjn7Jut30_SiQ', this.options);

	async loadMap() {
		const google = await this.gmLoader.load();
		console.info("google loaded");

		const mapProps = {
			center: { lat: -41.5, lng: -71.8 },
			zoom: this.zoom,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
		};

		this.loading = true;

		this.map = new google.maps.Map(this.mapElement.nativeElement, mapProps);

		this.trackService.getTrack(this.criteria)
			.subscribe({
				next: result => {
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

		// give us a nice og:imnage for the kids on social media
		// TODO: get this dynamically from the vessel
		const imageUrl = "https://allhandssailing.com/wp-content/uploads/2022/06/drone1.png";
		this.metaService.addTag( { property: 'og:image', content: imageUrl } );
		this.metaService.addTag( { property: 'og:image:secure_url', content: imageUrl } );


		this.metaService.addTag( { name:'description',content:"Bob's super deluxe sail tracker"});
		const urlParams = new URLSearchParams(window.location.search);
	
		// Pick up some criteria from the URL query params
		this.criteria.vuid = urlParams.get("vuid");  //e3d634c8-506c-4a75-8eb1-930b37fa5582
		if (!this.criteria.vuid) {
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

		if (!this.criteria.vuid) {
			this.error = "No Vessel ID";
			console.error("no vuid on url");
		}
		else {
			console.info(JSON.stringify(this.criteria));
			this.loadMap();
		}

	}



	private drawModel(): void {
		try {
			this.center = this.trackResponse.center;

			console.info(`Center: ${JSON.stringify(this.center)}`);

			if (this.criteria.hoursBack && this.trackResponse.trackDataList.length) {
				this.endMarker = this.trackResponse.trackDataList[this.trackResponse.trackDataList.length - 1].point;
			}

			let points = new Array<google.maps.LatLng>();
			for (let trackPoint of this.trackResponse.trackDataList) {
				points.push(
					new google.maps.LatLng(trackPoint.point.lat, trackPoint.point.lng)
				);
			}
			let line = new google.maps.Polyline(
				{
					path: points,
					geodesic: true,
					strokeColor: "#ff0000",
					strokeOpacity: 1.0,
					strokeWeight: 3.5
				}
			);
			line.setMap(this.map);

			// Build data for Vector Display
			let markerUrlBase = "http://earth.google.com/images/kml-icons/track-directional/track-";

			const KnotsPerMPS = 1.943844492441;

			let vectors = new Array<google.maps.Marker>();
			for (let v of this.trackResponse.trackVectorList) {
				let markerIndex = Math.floor(v.bearing / 22.5);
				let markerUrl = `${markerUrlBase}${markerIndex.toString()}.png`;

				let kts = v.speedMps * KnotsPerMPS;

				let markerText = `${v.dateTimeUtc} (UTC) SOG: ${kts.toFixed(2)} KTs  COG: ${v.bearing.toFixed()} Degrees`;

				vectors.push(new google.maps.Marker(
					{
						position: {
							lat: v.point.lat,
							lng: v.point.lng
						},
						title: markerText,
						opacity: .35,
						icon: markerUrl,
						map: this.map
					}));
			}


			// TODO: we need to do way better on the zoom
			this.zoom = Math.floor(1000 / this.trackResponse.distanceNm);
			this.zoom = Math.max(this.minZoom, this.zoom);
			this.zoom = Math.min(this.maxZoom, this.zoom);
			console.info(`setting zoom to ${this.zoom}`);

			// build a Bounds rectangle
			let gBounds = new google.maps.LatLngBounds(
				{lat: this.trackResponse.geoBounds.bottomLeft.lat, lng : this.trackResponse.geoBounds.bottomLeft.lng},
				{lat: this.trackResponse.geoBounds.topRight.lat, lng : this.trackResponse.geoBounds.topRight.lng}
			);

			console.info(JSON.stringify(gBounds));


//			this.map.setZoom(this.zoom);
			this.map.setCenter({
				lat: this.center.lat,
				lng: this.center.lng
			});

			this.map.fitBounds(gBounds, 50);
		}
		catch(err) {
			this.error = err;
		}
	}
}

