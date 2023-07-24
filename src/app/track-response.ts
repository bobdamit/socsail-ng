export class TrackResponse {
	vessel: Vessel;
	request: TrackQueryRequest;

	startUtc: Date;
	endUtc: Date;
	center : Point;
	distanceNm : number;
	avgSpeedKt : number;

	geoBounds : GeoBounds;
	
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

export interface GeoBounds {
	topRight : Point;
	bottomLeft : Point;
}


export interface TrackQueryRequest {
	vesselUid: string;
	hoursBack?: number;
	hoursBackMode?: string
	startDateUtc?: Date;
	endDateUtc?: Date,
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