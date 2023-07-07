export class TrackResponse {
	vessel: Vessel;

	startUtc: Date;
	endUtc: Date;
	center : Point;
	distanceNm : number;
	avgSpeedKt : number;
	
	trackDataList : TrackData[];
	trackVectorList : Vector[];
}

export class TrackData {
	dateTimeUtc: Date;
	point: Point;
}

export class Vector extends TrackData {
	speedMps : number;
	bearing : number
}




export class Point {
	lat: number;
	lng: number;
}

export class Vessel {

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