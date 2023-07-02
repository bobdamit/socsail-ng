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
export class TrackService implements HttpInterceptor {

	constructor(private http: HttpClient) {
		this.url =
    "https://sailtrack-service.herokuapp.com/track/query";
   // "http://localhost:8080/track/query";
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<HttpEvent<any>> {
		throw new Error("Method not implemented.");
	}

	private url : String


	getTrack(criteria : TrackCriteria) : Observable<any> {
		const httpOptions = {
		  headers: new HttpHeaders({
		    'Content-Type':  'application/json'
		  })
		};

		let endpoint = this.url.concat(criteria.asQueryArgs());


		return this.http.get<TrackResponse>(endpoint, httpOptions);
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
