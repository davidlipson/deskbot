import axios from "axios";
import qs from "querystring";

let cachedAccessToken: string | null = null;
let expirationTime: number = 0;

export const refreshAccessToken = async () => {
  const currentTime = new Date().getTime();

  // If the access token is still valid, return it
  if (cachedAccessToken && currentTime < expirationTime) {
    return cachedAccessToken;
  }

  // Otherwise, refresh the access token
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Cache the new access token and set the new expiration time
  cachedAccessToken = data.access_token;
  expirationTime = currentTime + data.expires_in * 1000;

  return data.access_token;
};
