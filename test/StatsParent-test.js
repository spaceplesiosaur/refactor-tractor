const chai = require('chai');
const expect = chai.expect;

import activityData from '../data/activity-test-data';
import hydrationData from '../data/hydration-test-data';
import sleepData from '../data/sleep-test-data';
import userData from '../data/users-test-data';
import allSleepData from '../data/sleep';

import StatsParent from '../src/StatsParent';
import Activity from '../src/Activity';
import ActivityRepo from '../src/ActivityRepo';
import Hydration from '../src/Hydration';
import Sleep from '../src/Sleep';
import SleepRepo from '../src/SleepRepo';
import User from '../src/User';

describe('Stats Parent Class', () => {
  let statsParent;
  let hydration;
  let sleep;
  let user;

  beforeEach(() => {

    statsParent = new StatsParent()
    user = new User(userData[0])
    // hydration = new Hydration(hydrationData, user.id)
  });

  it('should return the dates for the last week', () => {
    expect(statsParent.returnWeek(1, hydrationData, user.id)).to.eql(
      [
        "2019/06/16",
        "2019/06/17",
        "2019/06/18",
        "2019/06/19",
        "2019/06/20",
        "2019/06/21",
        "2019/06/22"
      ])
    expect(statsParent.returnWeek(1, sleepData, user.id)).to.eql(
      [
        "2019/06/19",
        "2019/06/20",
        "2019/06/21",
        "2019/06/22",
        "2019/06/23",
        "2019/06/24",
        "2019/06/25",
      ]);
  });
  it('should return the average data over all time for a single user', () => {
    expect(statsParent.returnAvgData(sleepData, user.id, 'sleepQuality')).to.equal(2.53);
    expect(statsParent.returnAvgData(sleepData, user.id,'hoursSlept')).to.equal(7.66);
    expect(statsParent.returnAvgData(hydrationData, user.id,'numOunces')).to.equal(62.13);
  });

  it('should return data each day for week for a specific user', () => {
    expect(statsParent.returnWeekOfSpecificData(2, allSleepData, user.id, 'hoursSlept')).to.eql([7.3, 5.1, 8.6, 10.5, 9.1, 6.5, 6.8]);
  });

  it('should return user data for a specific day', () => {
    expect(statsParent.returnUserDataForDay(sleepData, user.id, '2019/06/15', 'hoursSlept')).to.equal(6.1);
    expect(statsParent.returnUserDataForDay(sleepData, user.id, '2019/06/15', 'sleepQuality')).to.equal(2.2);
    expect(statsParent.returnUserDataForDay(activityData, user.id, '2019/06/17', 'numSteps')).to.equal(14329);
    expect(statsParent.returnUserDataForDay(activityData, user.id, '2019/06/17', 'flightsOfStairs')).to.equal(18);
    expect(statsParent.returnUserDataForDay(activityData, user.id, '2019/06/26', 'minutesActive')).to.equal(219);
  });

  it('should return data each day for week for a specific user', () => {
    expect(statsParent.returnWeekOfSpecificData(2, allSleepData, user.id, 'hoursSlept')).to.eql([7.3, 5.1, 8.6, 10.5, 9.1, 6.5, 6.8]);
    expect(statsParent.returnWeekOfSpecificData(2, allSleepData, user.id, 'sleepQuality')).to.eql([4.8, 4.7, 3.7, 1.8, 1.5, 4.2, 2]);
    expect(statsParent.returnWeekOfSpecificData(1, hydrationData, user.id, 'numOunces')).to.eql([69, 96, 61, 91, 50, 50, 43]);
  });

})
