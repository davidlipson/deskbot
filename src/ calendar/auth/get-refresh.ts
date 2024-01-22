/*const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CAL_CLIENT_ID,
    process.env.GOOGLE_CAL_CLIENT_SECRET,
    "http://localhost:3000/calendar/oauth/callback"
  );

  oAuth2Client.getToken(
    "4/0AfJohXmSE5Z1xEdDIG5TSjeGUetcOkaBzKqVKDCmrIWv8WgojtLkH_BbpiQwAq1s9OVyEQ",
    (err, token: any) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      console.log("Access token:", token.access_token);
      console.log("Refresh token:", token.refresh_token);
    }
  );

  return;
  // Generate the URL for the OAuth consent page
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri: "http://localhost:3000/calendar/oauth/callback",
  });

  console.log("Authorize this app by visiting this url:", authUrl);
*/
