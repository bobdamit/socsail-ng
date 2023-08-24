import { Vessel } from "./user-models";


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


export interface Point {
	lat: number;
	lng: number;
}

