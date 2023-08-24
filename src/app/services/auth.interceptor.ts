import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor() {
		// bobd@rockscience.net/bobneo
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const TOKEN_STORE_KEY = "br549";
		const RESPONSE_AUTH_TOKEN_HEADER = "Vlad_andfukov";

		let token = localStorage.getItem(TOKEN_STORE_KEY);

		if(token) {
			const cloned = req.clone({
					headers: req.headers.set("Authorization", `Bearer ${token}`)
				});

			return next.handle(cloned)
				.pipe( tap({
					// tap into the response to save the updated jwtToken
					next : (event) => {
						if(event instanceof HttpResponse) {

							let jwtTokenJson = event.headers.get(RESPONSE_AUTH_TOKEN_HEADER);
							let tokenJson = JSON.parse(jwtTokenJson);
							if(tokenJson) {
								localStorage.setItem(TOKEN_STORE_KEY, tokenJson.token);

							}
						}
					}
				}));
		}
		else {
			return next.handle(req);
		}
	}



	
}