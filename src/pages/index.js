import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import moment from 'moment'
import React, {useState, useEffect} from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  let lastWeeksActivities = {};
  let thisWeeksActivities = {};

  const startOfLastWeek = moment().subtract(1, 'isoWeek').startOf('isoWeek').unix();
  const endOfLastWeek = moment().subtract(1, 'isoWeek').endOf('isoWeek').unix();
  const startOfThisWeek = moment().startOf('isoWeek').unix();
  const endOfThisWeek = moment().endOf('isoWeek').unix();

  const resolveActivities = async (userCode) => {
    const fetchToken = await fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userCode}),
    })
    let accessToken;
    accessToken = await fetchToken.json().then(body => body.accessToken)

    if(accessToken){

      const fetchActivities = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessToken, startTime: startOfLastWeek, endTime: endOfThisWeek}),
      })
      const _activities = await fetchActivities.json().then(body => body.activities)


      _activities.map(function(_activity) {
        const _activityStartTime = (new Date(_activity.start_date_local).getTime()) / 1000
        if(startOfLastWeek <= _activityStartTime && _activityStartTime <= endOfLastWeek) {
          lastWeeksActivities[_activity.id]= {
            activityStart: (new Date(_activity.start_date_local).getTime()) / 1000
          }
        }
        if(startOfThisWeek <= _activityStartTime && _activityStartTime <= endOfThisWeek) {
          thisWeeksActivities[_activity.id]= {
            activityStart: (new Date(_activity.start_date_local).getTime()) / 1000
          }
        }
      });
    }

    if({...lastWeeksActivities, ...thisWeeksActivities}) {
      let zone1 = 0;
      let zone2 = 0;
      let zone3 = 0;
      let zone4 = 0;
      let zone5 = 0;
      let totalTime = 0;

      const activityIds = Object.keys({...lastWeeksActivities, ...thisWeeksActivities})
      await Promise.all(activityIds.map(async activityId => {
        const fetchZones = (await fetch('/api/zones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({accessToken, activityId}),
        })).json().then((body) =>
        {
          const zones = {
            zone1: body.zones.distribution_buckets[0].time,
            zone2: body.zones.distribution_buckets[1].time,
            zone3: body.zones.distribution_buckets[2].time,
            zone4: body.zones.distribution_buckets[3].time,
            zone5: body.zones.distribution_buckets[4].time
          }
          if(activityId in lastWeeksActivities){
            lastWeeksActivities[activityId] = {...lastWeeksActivities[activityId], ...zones}
          }
          if(activityId in thisWeeksActivities){
            thisWeeksActivities[activityId] = {...thisWeeksActivities[activityId], ...zones}
          }
        })
      }))
      let _lastWeekZonePercentages = [0,0,0,0,0]
      let lastWeekZone1Total = 0
      let lastWeekZone2Total = 0
      let lastWeekZone3Total = 0
      let lastWeekZone4Total = 0
      let lastWeekZone5Total = 0
      let lastWeekZonesTotal = 0;
      Object.values(lastWeeksActivities).map((zone)=>{
        lastWeekZone1Total += zone.zone1;
        lastWeekZonesTotal += zone.zone1;
        lastWeekZone2Total += zone.zone2;
        lastWeekZonesTotal += zone.zone2;
        lastWeekZone3Total += zone.zone3;
        lastWeekZonesTotal += zone.zone3;
        lastWeekZone4Total += zone.zone4;
        lastWeekZonesTotal += zone.zone4;
        lastWeekZone5Total += zone.zone5;
        lastWeekZonesTotal += zone.zone5;
      })
      _lastWeekZonePercentages[0] = Math.round(lastWeekZone1Total / lastWeekZonesTotal * 100)
      _lastWeekZonePercentages[1] = Math.round(lastWeekZone2Total / lastWeekZonesTotal * 100)
      _lastWeekZonePercentages[2] = Math.round(lastWeekZone3Total / lastWeekZonesTotal * 100)
      _lastWeekZonePercentages[3] = Math.round(lastWeekZone4Total / lastWeekZonesTotal * 100)
      _lastWeekZonePercentages[4] = Math.round(lastWeekZone5Total / lastWeekZonesTotal * 100)


      let _thisWeekZonePercentages = [0,0,0,0,0]
      let thisWeekZone1Total = 0
      let thisWeekZone2Total = 0
      let thisWeekZone3Total = 0
      let thisWeekZone4Total = 0
      let thisWeekZone5Total = 0
      let thisWeekZonesTotal = 0;
      console.log("thisWeeksActivities", thisWeeksActivities)
      Object.values(thisWeeksActivities).map((zone)=>{
        console.log("zone", zone)
        thisWeekZone1Total += zone.zone1;
        thisWeekZonesTotal += zone.zone1;
        thisWeekZone2Total += zone.zone2;
        thisWeekZonesTotal += zone.zone2;
        thisWeekZone3Total += zone.zone3;
        thisWeekZonesTotal += zone.zone3;
        thisWeekZone4Total += zone.zone4;
        thisWeekZonesTotal += zone.zone4;
        thisWeekZone5Total += zone.zone5;
        thisWeekZonesTotal += zone.zone5;
      })
      console.log(thisWeekZone1Total)
      console.log(thisWeekZonesTotal)
      console.log(thisWeekZone1Total / thisWeekZonesTotal * 100)
      console.log(Math.round(thisWeekZone1Total / thisWeekZonesTotal * 100))
      _thisWeekZonePercentages[0] = Math.round(thisWeekZone1Total / thisWeekZonesTotal * 100)
      _thisWeekZonePercentages[1] = Math.round(thisWeekZone2Total / thisWeekZonesTotal * 100)
      _thisWeekZonePercentages[2] = Math.round(thisWeekZone3Total / thisWeekZonesTotal * 100)
      _thisWeekZonePercentages[3] = Math.round(thisWeekZone4Total / thisWeekZonesTotal * 100)
      _thisWeekZonePercentages[4] = Math.round(thisWeekZone5Total / thisWeekZonesTotal * 100)
      console.log("_thisWeekZonePercentages", _thisWeekZonePercentages)

      setLastWeekZonePercentages(_lastWeekZonePercentages)
      setThisWeekZonePercentages(_thisWeekZonePercentages)
    }
  };

  const [lastWeekZonePercentages, setLastWeekZonePercentages] = useState([0,0,0,0,0]);
  const [thisWeekZonePercentages, setThisWeekZonePercentages] = useState([0,0,0,0,0]);

  const router = useRouter()
  useEffect(()=>{
    if(!router.isReady) return;
    const userCode = router.query.code;
    if(userCode) resolveActivities(userCode);
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          {
            lastWeekZonePercentages.map((zone, i) => {
              return <p key={"lastWeekZone" + i+1}>Zone{i+1}: {zone} %</p>
            })
          }
        </div>
        <div className={styles.description}>
          {
            thisWeekZonePercentages.map((zone, i) => {
              return <p key={"thisWeekZone" + i+1}>Zone{i+1}: {zone} %</p>
            })
          }
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
              href="http://www.strava.com/oauth/authorize?client_id=100747&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=activity:read_all"
              className={styles.card}
              rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Kirjaudu
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

        </div>
      </main>
    </>
  )
}
