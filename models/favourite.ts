import auth from "./auth"
import storage from "./storage";
import config from "../config/config.json";

const fav = {

    createLikedStation: async function createLikedStation(station: string) {
        const data = {
            artefact: station,
            api_key: config.auth_api_key
        };
        const tokenObject: any = await storage.readToken();
        const response= await
        fetch(`${config.auth_url}/data?api_key=${config.auth_api_key}`,{
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': tokenObject.token
            },
            })
        },

    deleteLiked: async function deleteLiked(id: number) {
        const tokenObject: any = await storage.readToken();
        const data = {
            id: id,
            api_key: config.auth_api_key
        }

        const response= await
        fetch(`${config.auth_url}/data?api_key=${config.auth_api_key}`,{
            body: JSON.stringify(data),
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'x-access-token': tokenObject.token
            },
            })
        },

    }

    getLiked: async function getLiked() {
        const tokenObject: any = await storage.readToken();
        const response = await fetch(`${config.auth_url}/data?api_key=${config.auth_api_key}`,{
            method:"GET",
            headers: {
                'content-type': 'application/json',
                'x-access-token': tokenObject.token
            },
        });
        const res = await response.json();
        //console.log(res.data)
        return res.data;
    }
}

export default fav;