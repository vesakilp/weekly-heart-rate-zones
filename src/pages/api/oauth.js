export default async function handler(req, res) {
  const userCode = req.body.userCode
  console.log("userCode", userCode)

  const authResponse = fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      code: userCode,
      grant_type: "authorization_code"
    })
  }).then((response) => {
    response.json().then((body) => {
      console.log(body.access_token)
      res.status(200).json({ accessToken: body.access_token })
    })
  })
}
