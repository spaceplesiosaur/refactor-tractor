import $ from 'jquery';

import UserRepo from "./UserRepo";
import User from "./User";
import Hydration from "./Hydration";
import Sleep from "./Sleep";
import SleepRepo from "./SleepRepo";
import Activity from "./Activity";
import ActivityRepo from "./ActivityRepo";

import activityData from "../data/activity";
import allSleepData from "../data/sleep";

let userData;
let userRepo;
let user;
const uniqueUserIndex = Math.floor(Math.random() * (50 - 1 + 1)) + 1;

fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
.then(response => response.json())
.then(data => userData = data.userData)
.then(() => {
userRepo = new UserRepo(userData);
user = new User(userData[uniqueUserIndex]);
})
.then(() => all())


//Generate random user


//Repo variables


let hydrationData;
let hydration;



// An example of how you tell webpack to use a CSS (SCSS) file
import './css/normalize.css';
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
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


function all() {
const sleepRepo = new SleepRepo(allSleepData);
const activityRepo = new ActivityRepo(activityData, userData);

//Individual Class Repos


const sleep = new Sleep(allSleepData, user.id);
const activity = new Activity(activityData, user);

//Date
const date = activityData.reverse()[0].date;
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
$(document).ready(function () {

  //Packery Items
  // let $grid = $('.grid').packery({
  //   itemSelector: '.grid-item',
  //   columnWidth: 30,
  //   rowHeight: 30,
  //   gutter: 4,
  // });

  // let $draggable = $('.draggable').draggabilly({
  //   containment: true
  // });

  // $grid.find('.grid-item').each(function (i, gridItem) {
  //   let draggie = new Draggabilly(gridItem)
  //   $grid.packery('bindDraggabillyEvents', draggie)
  // });


  // Function to find user name
  function findUserName(id) {
    return userData.find(user => user.id === id).name;
  }

  //User Section
  $('.username').text(`${user.returnUserName()}`)

  //Date Section
  $('.date').text(`${formattedDate}`);

  //Hydration

  function hydrationDOM() {
  $('.water-consumed').text(`${hydration.returnDailyFluidOunces(date)} ounces \n\n`);

  const weeklyOuncesChart = new Chart(document.getElementById('water-consumed-week').getContext('2d'), {
    type: 'horizontalBar',
    data: {
      labels: dropYear(hydration.returnWeek()),
      datasets: [{
        data: hydration.returnWeeklyNumOunces(),
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
  //Sleep
  $('.hours-slept-day').text(`${sleep.returnSleepData(date, 'hoursSlept')} hours | ${sleep.returnSleepData(date, 'sleepQuality')} quality`);

  const weeklySleepChart = new Chart(document.getElementById('sleep-week').getContext('2d'), {
    type: 'line',
    data: {
      labels: dropYear(sleep.returnWeek(1)),
      datasets: [{
        data: sleep.returnWeekOfSleepData(1, 'hoursSlept'),
        label: "Sleep Hours",
        borderColor: "rgba(92, 117, 218, 0.6)",
        fill: false,
        lineTension: 0.1
      },
      {
        data: Array(7).fill(sleep.returnAvgSleepData('hoursSlept')),
        label: "Average Hours of Sleep",
        borderColor: "rgba(92, 117, 218, 0.6)",
        fill: false,
        borderDash: [10, 5]
      },
      {
        data: sleep.returnWeekOfSleepData(1, 'sleepQuality'),
        label: "Quality of Sleep",
        borderColor: "rgba(242, 188, 51, 0.6)",
        fill: false,
        lineTension: 0.1
      },
      {
        data: Array(7).fill(sleep.returnAvgSleepData('sleepQuality')),
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

  //Activity Section

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

  // Friends

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

  // Challenges

  function insertStepStreak() {
    let list = `<ul class="steps_ul">`
    activity.returnThreeDayStepStreak().forEach(day => {
      list += `<li class="date_li">
             <p class="dates"> ${day}`
    })
    list += `</ul>`;
    return list;
  }

  $('.increasing-steps').html(`${insertStepStreak()}`);

  function insertStairStreak() {
    let list = `<ul class="stairs_ul">`
    activity.returnTwoDayStairStreak().forEach(day => {
      list += `<li class="date_li">
             <p class="dates"> ${day}`
    })
    list += `</ul>`;
    return list;
  }

  $('.increasing-stairs').html(`${insertStairStreak()}`);

})

function dataSlashFormat() {
    let formDate = $('#date-form').val();
    let formDateSlash = formDate.replace('-','/');
    return formDateSlash.replace('-','/')
  }

$('#form').click((event) => {
  if (event.target.id === 'log-button') {
      $('#log-buttons').toggle()
  }

  if (event.target.id === 'log-sleep') {
    $('#log-form').html(
    `<form action="" target="_blank" data-category="sleep">
        Date:<br>
        <input id="date-form" type="date" name="date">
        <br>
        Hours Slept:<br>
        <input id="hours-slept-form" type="number" name="hours-slept" value="">
        <br>Sleep Quality:<br>
        <input id="sleep-quality-form" type="number" name="sleep-quality" value="">
        <br><br>
        <input id="submit-form" type="submit" value="Submit">
      </form>`)
  }

  if (event.target.id === 'log-activity') {
    $('#log-form').html(`<form action="" target="_blank">
        Date:<br>
        <input id="date-form" type="date" name="date">
        <br>
        Number of Steps:<br>
        <input id="number-steps-form" type="number" name="numbers-of-steps" value="">
        <br>Minutes Active:<br>
        <input id="minutes-active-form" type="number" name="minutes-active" value="">
        <br>FLights of Stairs:<br>
        <input id="flights-stairs-form" type="number" name="minutes-active" value="">
        <br><br>
        <input id="submit-form" type="submit" value="Submit">
      </form>`)
  }

  if (event.target.id === 'log-hydration') {
    $('#log-form').html(`<form action="" target="_blank">
        Date:<br>
        <input id="date-form" type="date" name="date">
        <br>
        Number of Ounces:<br>
        <input id="ounces-form" type="number" name="ounces">
        <br><br>
        <input id="submit-form" type="submit" value="Submit">
      </form>`)
  }

  if (event.target.id === 'submit-form' && $('#hours-slept-form').length > 0){
    event.preventDefault();



    fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', {
method: 'POST',
headers: {
'Content-Type': "application/json"
},
body: JSON.stringify({userID: user.id, date: dataSlashFormat(), hoursSlept: $('#hours-slept-form').val(), sleepQuality: $('#sleep-quality-form').val()})
})
  }


if (event.target.id === 'submit-form' && $('number-steps-form').length > 0){
  event.preventDefault();
  $.post()
}


if (event.target.id === 'submit-form' && $('ounces-form').length > 0){
  event.preventDefault();
  $.post()
}


})
}
