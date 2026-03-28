import axios from "axios";

export const getCoordinatesFromAddress = async (address) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "Aidify-App",
      },
    }
  );

  if (!response.data.length) {
    throw new Error("Address not found");
  }

  return {
    latitude: response.data[0].lat,
    longitude: response.data[0].lon,
  };
};
