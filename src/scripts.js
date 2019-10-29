import $ from 'jquery';
import 'whatwg-fetch';
//https://github.com/github/fetch
import 'promise-polyfill/src/polyfill';
//https://github.com/taylorhakes/promise-polyfill

import UserRepo from "./UserRepo";
import User from "./User";
import Hydration from "./Hydration";
import Sleep from "./Sleep";
import SleepRepo from "./SleepRepo";
import Activity from "./Activity";
import ActivityRepo from "./ActivityRepo";

import './css/normalize.css';
import './css/styles.scss';

import './images/appointment.svg'
import './images/drop.svg'
import './images/footsteps-silhouette-variant.svg'
import './images/goal.svg'
import './images/logo.png'
import './images/moon.svg'
import './images/road.svg'
import './images/screencapture.png'
import './images/stopwatch.svg'
import './images/trophy.svg'

const uniqueUserIndex = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

const userFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
  .then(response => response.json())
  .then(data => {
    return data.userData
  })
  .catch(data => console.log('Fetch error - user data. User may not be defined.', data))

const activityFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
  .then(response => response.json())
  .then(data => {
    return data.activityData
  })
  .catch(data => console.log('Fetch error - activity data. Date may not be defined.', data))


Promise.all([userFetch, activityFetch]).then((requiredData) => {
  const userData = requiredData[0];
  const userRepo = new UserRepo(userData);
  const user = new User(userData[uniqueUserIndex]);
  const activityData = requiredData[1];
  const activity = new Activity(activityData, user);
  const activityRepo = new ActivityRepo(activityData, userData);
  const date = activityData.sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })[0].date
  if (new Date(date) > new Date('2020/01/22')) {
    date = '2020/01/22';
  }
  all(userData, userRepo, user, activityData, activity, activityRepo, date);
})

let hydrationData;
let hydration;
let sleep;
let sleepRepo;
let allSleepData;

function all(userData, userRepo, user, activityData, activity, activityRepo, date) {

  const dateObject = new Date(date);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = dateObject.toLocaleString('en', options)

  function dropYear(dates) {
    const reformattedDates = dates.map(date => {
      const splitDate = date.split('/');
      return [splitDate[1], splitDate[2]].join('/');
    })
    return reformattedDates
  }
  $(document).ready(function() {

    function findUserName(id) {
      return userData.find(user => user.id === id).name;
    }

    $('.username').text(`${user.returnUserName()}!`)

    $('.date').text(`${formattedDate}`);

    function hydrationDOM() {
      $('.water-consumed').text(`${hydration.returnDailyFluidOunces(hydrationData, user.id, date, 'numOunces')} ounces \n\n`);

      const weeklyOuncesChart = new Chart(document.getElementById('water-consumed-week').getContext('2d'), {
        type: 'horizontalBar',
        data: {
          labels: dropYear(hydration.returnHydrationWeek(1, hydrationData, user.id)),
          datasets: [{
            data: hydration.returnWeeklyNumOunces(1, hydrationData, user.id, 'numOunces'),
            backgroundColor: [
              'rgba(92, 117, 218, 0.6)',
              'rgba(242, 188, 51, 0.6)',
              'rgba(126, 221, 255, 0.6)',
              'rgba(92, 117, 218, 0.6)',
              'rgba(242, 188, 51, 0.6)',
              'rgba(126, 221, 255, 0.6)',
              'rgba(92, 117, 218, 0.6)'
            ],
          }]
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: '# of Ounces'
              }
            }]
          }
        }
      })
    };

    fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
      .then(response => response.json())
      .then(data => hydrationData = data.hydrationData)
      .then(() => hydration = new Hydration(hydrationData, user.id))
      .then(() => hydrationDOM())

    fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
      .then(response => response.json())
      .then(data => allSleepData = data.sleepData)
      .then(() => {
        sleep = new Sleep(allSleepData, user.id)
        sleepRepo = new SleepRepo(allSleepData)
      })
      .then(() => sleepDOM())

    function sleepDOM() {
      $('.hours-slept-day').text(`${sleep.returnUserDataForDay(allSleepData, user.id, date, 'hoursSlept')} hours | ${sleep.returnUserDataForDay(allSleepData, user.id, date, 'sleepQuality')} quality`);
      const weeklySleepChart = new Chart(document.getElementById('sleep-week').getContext('2d'), {
        type: 'line',
        data: {
          labels: dropYear(sleep.returnWeek(1, allSleepData, user.id)),
          datasets: [{
              data: sleep.returnWeekOfSpecificData(1, allSleepData, user.id,'hoursSlept'),
              label: "Sleep Hours",
              borderColor: "rgba(92, 117, 218, 0.6)",
              fill: false,
              lineTension: 0.1
            },
            {
              data: Array(7).fill(sleep.getAverageFromDataList(allSleepData,'hoursSlept')),
              label: "Average Hours of Sleep",
              borderColor: "rgba(92, 117, 218, 0.6)",
              fill: false,
              borderDash: [10, 5]
            },
            {
              data: sleep.returnWeekOfSpecificData(1, allSleepData, user.id,'sleepQuality'),
              label: "Quality of Sleep",
              borderColor: "rgba(242, 188, 51, 0.6)",
              fill: false,
              lineTension: 0.1
            },
            {
              data: Array(7).fill(sleep.getAverageFromDataList(allSleepData,'sleepQuality')),
              label: "Average Quality of Sleep",
              borderColor: "rgba(242, 188, 51, 0.6)",
              fill: false,
              borderDash: [10, 5]
            }
          ]

        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: "rgba(92, 117, 218, 0.6)"
              },
              scaleLabel: {
                display: true,
                labelString: 'hours'
              },

            }, {
              id: 'Quality of Sleep',
              type: 'linear',
              position: 'right',
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 10,
                fontColor: "rgba(242, 188, 51, 0.6)"
              },
              scaleLabel: {
                display: true,
                labelString: 'quality'
              }
            }]
          }
        }
      });
    $('.longest-sleepers').text(`${findUserName(sleepRepo.returnWeeklyLongestSleepers(1)[1])}: ${sleepRepo.returnWeeklyLongestSleepers(1)[0]} hours`);
    }

    var bar = new ProgressBar.Circle('.number-of-steps-day', {
      color: '#aaa',
      svgStyle: {
        display: 'block',
        width: '100%'
      },
      strokeWidth: 5,
      trailWidth: 2,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: true
      },
      from: {
        color: '#fff940',
        width: 2
      },
      to: {
        color: '#f2bc33',
        width: 5
      },

      step(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = circle.value();
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(`${activity.returnUserDataForDay(activityData, user.id, date, 'numSteps')} steps`);
        }

      }
    });

    let percentSteps = activity.returnUserDataForDay(activityData, user.id, date, 'numSteps') / user.dailyStepGoal;
    bar.animate(percentSteps > 1 ? percentSteps = 1 : percentSteps); // Number from 0.0 to 1.0

    $('.number-of-steps-goal').text(`Step Goal: ${user.dailyStepGoal}`);
    $('.avg-number-of-steps-goal').text(`Average Step Goal: ${userRepo.returnAverageStepGoal()}`);
    $('.number-of-minutes-active-day').text(`${activity.returnUserDataForDay(activityData, user.id, date, 'minutesActive')}`);
    $('.average-minutes-active').text(`${activityRepo.returnAverage(date, 'minutesActive')}`)
    $('.distance').text(`${activity.returnUserDataForDay(activityData, user.id, date, 'numSteps')}`);
    $('.average-distance').text(`${activityRepo.returnAverage(date, 'numSteps')}`)
    $('.stairs').text(`${activity.returnUserDataForDay(activityData, user.id, date, 'flightsOfStairs')}`);
    $('.average-stairs').text(`${activityRepo.returnAverage(date, 'flightsOfStairs')}`)
    $('.distance-in-miles').text(`${activity.returnMilesWalked(user.id)} Miles`);
    $('.most-active').text(`${activityRepo.returnMostActive()[0]}: ${activityRepo.returnMostActive()[1]} minutes`);
    $('.week-review-minutes').text(`${activity.returnAverageDataForWeek(1, 'minutesActive', user.id)} minutes active`);
    $('.week-review-steps').text(`${activity.returnAverageDataForWeek(1, 'numSteps', user.id)} steps taken`);
    $('.week-review-stairs').text(`${activity.returnAverageDataForWeek(1, 'flightsOfStairs', user.id)} flights of stairs`);


    let userIDs = Object.keys(activity.returnFriendsStepCount()[0]);

    function insertFriendSteps() {
      let list = `<ul class="friends_ul">`
      userIDs.forEach(userID => {
        let userName = findUserName(Number(userID));
        list += `<li class="friends_li">
             <p class="friends--steps"><b>${userName}</b>:</p>
             <p>${activity.returnFriendsStepCount()[0][userID]} steps</p>`;
      });
      list += `</ul>`;
      return list;
    }

    $('.friends-step').html(`${insertFriendSteps()}`);


    function insertStepStreak(id) {
      let list = `<ul class="steps_ul">`
      activity.returnThreeDayStepStreak(id).forEach(day => {
        list += `<li class="date_li">
             <p class="dates"> ${day}`
      })
      list += `</ul>`;
      return list;
    }

    $('.increasing-steps').html(`${insertStepStreak(user.id)}`);

    function insertStairStreak(id) {
      let list = `<ul class="stairs_ul">`
      activity.returnTwoDayStairStreak(id).forEach(day => {
        list += `<li class="date_li">
             <p class="dates"> ${day}`
      })
      list += `</ul>`;
      return list;
    }

    $('.increasing-stairs').html(`${insertStairStreak(user.id)}`);
  })


  function dataSlashFormat() {
    let formDate = $('#date-form').val();
    let formDateSlash = formDate.replace('-', '/');
    return formDateSlash.replace('-', '/')
  }

  $('#form').click((event) => {
    if (event.target.id === 'log-button') {
      $('#log-buttons').toggle()
    }

    if (event.target.id === 'log-sleep') {
      $('#log-form').html(
        `<form action="" target="_blank" data-category="sleep">
        <section class="label-input-box">
          <label for="date" class="label" tabindex="0">Date:</label>
          <input id="date-form" type="date" name="date" tabindex="0">
        </section>
        <section class="label-input-box">
          <label for="hours-slept" tabindex="0">Hours Slept:</label>
          <input id="hours-slept-form" type="number" name="hours-slept" value="" tabindex="0">
        </section>
        <section class="label-input-box" tabindex="0">
          <label for-"sleep-quality">Sleep Quality:</label>
          <input id="sleep-quality-form" type="number" name="sleep-quality" value="" tabindex="0">
        </section>
        <br>
        <input id="submit-form" type="submit" value="Submit" tabindex="0">
      </form>`)
    }

    if (event.target.id === 'log-activity') {
      $('#log-form').html(
        `<form action="" target="_blank" data-category="activity">
        <section class="label-input-box">
          <label for="date" class="label" tabindex="0">Date:</label>
          <input id="date-form" type="date" name="date" tabindex="0">
        </section>
        <section class="label-input-box">
          <label for="numbers-of-steps" tabindex="0">Number of Steps:</label>
          <input id="number-steps-form" type="number" name="numbers-of-steps" value="" tabindex="0">
        </section>
        <section class="label-input-box" tabindex="0">
          <label for-"minutes-active">Minutes Active:</label>
          <input id="minutes-active-form" type="number" name="minutes-active" value="" tabindex="0">
        </section>
        <section class="label-input-box" tabindex="0">
          <label for-"flights-of-stairs">Flights of Stairs:</label>
          <input id="flights-stairs-form" type="number" name="flights-of-stairs" value="" tabindex="0">
        </section>
        <br>
        <input id="submit-form" type="submit" value="Submit" tabindex="0">
      </form>`)
    }

    if (event.target.id === 'log-hydration') {
      $('#log-form').html(
        `<form action="" target="_blank" data-category="hydration">
        <section class="label-input-box">
          <label for="date" class="label" tabindex="0">Date:</label>
          <input id="date-form" type="date" name="date" tabindex="0">
        </section>
        <section class="label-input-box">
          <label for="ounces" tabindex="0">Number of Ounces:</label>
          <input id="ounces-form" type="number" name="ounces" value="" tabindex="0">
        </section>
        <br>
        <input id="submit-form" type="submit" value="Submit" tabindex="0">
      </form>`)
    }

    if (event.target.id === 'submit-form' && $('#hours-slept-form').length > 0) {
      event.preventDefault();
      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          userID: user.id,
          date: dataSlashFormat(),
          hoursSlept: $('#hours-slept-form').val(),
          sleepQuality: $('#sleep-quality-form').val()
        })
      }).catch(error => console.log('There was an error submitting your sleep data', error))
    }

    if (event.target.id === 'submit-form' && $('#number-steps-form').length > 0) {
      event.preventDefault();
      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          userID: user.id,
          date: dataSlashFormat(),
          numSteps: $('#number-steps-form').val(),
          minutesActive: $('#minutes-active-form').val(),
          flightsOfStairs: $('#flights-stairs-form').val(),
        })
      }).catch(error => console.log('There was an error submitting your activity data', error))
    }


    if (event.target.id === 'submit-form' && $('#ounces-form').length > 0) {
      event.preventDefault();

      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          userID: user.id,
          date: dataSlashFormat(),
          numOunces: $('#ounces-form').val()
        })
      }).catch(error => console.log('There was an error submitting your hydration data', error))
    }
  })
}
