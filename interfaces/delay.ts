export default interface Delays {
    ActivityId: String,
    ActivityType: String,
    AdvertisedTimeAtLocation: String,
    AdvertisedTrainIdent: string,
    Canceled: boolean,
    EstimatedTimeAtLocation: string,
    FromLocation: {LocationName: string, Priority: number, Order: number},
    ToLocation: {LocationName: string, Priority: number, Order: number},
}