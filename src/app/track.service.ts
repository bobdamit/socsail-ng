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
import { TrackResponse } from './track-response';
import { environment } from 'src/environments/environment';


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
	from : Date;
	thru : Date;
	hoursBack : number;

	asQueryArgs() : string {
		let p =  `?vuid=${this.vuid}`;
		if(this.from) {
			p = p.concat(`&start=${formatDate(this.from, "yyyy-MM-dd'T'HH:mm:ss", "en_US")}`);
		}
		if(this.thru) {
			p = p.concat("&end=").concat(formatDate(this.thru, "yyyy-MM-dd'T'HH:mm:ss", "en_US"));
		}
		if(this.hoursBack) {
			p = p.concat(`&hrsback=${this.hoursBack.toString(10)}`);
		}
		return p;
	}
}
