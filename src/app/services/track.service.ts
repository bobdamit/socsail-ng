import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpHeaders,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpEvent
} from '@angular/common/http';
import { formatDate } from "@angular/common";
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { TrackResponse } from '../models/track-response';


@Injectable({
	providedIn: 'root'
})
export class TrackService {

	constructor(private http: HttpClient) {
	}

	getTrack(criteria : TrackCriteria) : Observable<any> {
		const httpOptions = {
		  headers: new HttpHeaders({
		    'Content-Type':  'application/json'
		  })
		};

		let url = `${environment.serviceHost}/track/query${criteria.asQueryArgs()}`;

		return this.http.get<TrackResponse>(url, httpOptions);
	}

}


export class TrackCriteria {
	vuid : string;
	fromUtc : Date;
	thruUtc : Date;
	hoursBack : number;

	asQueryArgs() : string {
		let p =  `?vuid=${this.vuid}`;
		if(this.fromUtc) {
			p = p.concat(`&start-utc=${formatDate(this.fromUtc, "yyyy-MM-dd'T'HH:mm:ss", "en_US")}`);
		}
		if(this.thruUtc) {
			p = p.concat("&end-utc=").concat(formatDate(this.thruUtc, "yyyy-MM-dd'T'HH:mm:ss", "en_US"));
		}
		if(this.hoursBack) {
			p = p.concat(`&hrsback=${this.hoursBack.toString(10)}`);
		}
		return p;
	}
}
