import config from "../config/config.json";

const delays = {
    getDelays: async function getDelays() {
        const response = await fetch(`${config.base_url}/delayed`);
        const result = await response.json();

        return result.data;
    },
    timeDifference: function timeDifference(dt2, dt1) {
        let diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    },

    // getDelaybyStation: async function getDelaybyStation(stationArc:string){
    //     const result = await this.getDelays()

    //     let res = result.filter(function(delay){
    //         return delay.FromLocation.LocationName == stationArc;
    //      })
    //     console.log(res)
    //     console.log("done")
    //     return res
    // }
}

export default delays