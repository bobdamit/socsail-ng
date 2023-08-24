import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

	constructor(private route : ActivatedRoute, private router : Router, private userService : UserService) {

	}
	ngOnInit(): void {
		this.route.queryParams.subscribe(
			params => {
				let rte = params['r'];
				console.log(rte);
				if(rte) {
					this.router.navigate([rte], {relativeTo : this.route});
				}
			}
		);
	}

}
