import axios from "axios";
import qs from "querystring";

const authUrl =
  "https://accounts.spotify.com/authorize?client_id=e9b4a8a42a3d4961a374c71c4ce90981&response_type=code&redirect_uri=http://localhost:3000/spotify/oauth/callback&scope=user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state";

export const getAccessToken = async (code: string) => {
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/spotify/oauth/callback", // Replace with your redirect URI
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log(data);

  return data;
};
