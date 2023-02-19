export default async function handler(req, res) {
  const activityId = req.body.activityId
  const accessToken = req.body.accessToken

  const fetchZones = await fetch('https://www.strava.com/api/v3/activities/'+activityId+'/zones', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    }
  }).then((response) => {
    response.json().then((body) => {
      res.status(200).json({ zones: body[0] })
    })
  })
}
