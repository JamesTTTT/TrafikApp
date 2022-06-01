export default interface Delays {
    ActivityId: string,
    ActivityType: string,
    AdvertisedTimeAtLocation: string,
    AdvertisedTrainIdent: string,
    Canceled: boolean,
    EstimatedTimeAtLocation: string,
    FromLocation: {LocationName: string, Priority: number, Order: number},
    ToLocation: {LocationName: string, Priority: number, Order: number},
}