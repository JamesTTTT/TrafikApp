// export  async function getCoordinatesFromAdress(address: string) {
//     const urlEncodedAddress = encodeURIComponent(address);
//     const url = "https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=";
//     const response = await fetch(`${url}${urlEncodedAddress}`);
//     const result = await response.json();

//     return result;
// };

export default function getCoordinates(address: string) {
    const coords = address.slice(7, -1);
    const coordsArray = coords.split(" ")
    const res = {
        lat: coordsArray[1],
        lon: coordsArray[0]
    }
    return res;
};