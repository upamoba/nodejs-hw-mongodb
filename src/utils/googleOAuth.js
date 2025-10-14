import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
});
console.log('GOOGLE_REDIRECT_URI =', process.env.GOOGLE_REDIRECT_URI);

export function getOAuthURL(){
return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope:  [
      "openid",
      "email",
      "profile",

        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ]
});
}


export async function validateCode(code) {
    console.log('Exchanging code with redirect_uri =', client.redirectUri);

  const { tokens } = await client.getToken(code);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return { ticket, tokens };
}
