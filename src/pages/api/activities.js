export default async function handler(req, res) {
  const accessToken = req.body.accessToken
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  console.log("accessToken", accessToken);
  console.log("startTime", startTime);
  console.log("endTime", endTime);
  const fetchActivities = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${startTime}&before=${endTime}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    }
  }).then((response) => {
    response.json().then((body) => {
      res.status(200).json({ activities: body })
    })
  })
}
