export interface User {
	uid : string;
	email : string;
	name : string;

	organization : Organization;
	vessels : Vessel[];
}

export interface Organization {
	name : string;
	uid : string;
	images : Image[];
}

export interface Image {
	url : string;
	type : string;
}

export interface Vessel {
	vuid: string;
	name: string;
	manufacturer: string;
	model: string;
	length: number
	lengthUnit: string;
	year: number;
	description: string;
	mmsi: string;
	port:string;
	thumbUrl: string;
	imgUrl: string;
	linkUrl : string;
	linkText: string;
}