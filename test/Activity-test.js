const chai = require('chai');
const expect = chai.expect;

import activityData from '../data/activity-test-data';
import userData from '../data/users-test-data';

import Activity from '../src/Activity';
import User from '../src/User';
import StatsParent from '../src/StatsParent';


describe('Activity', () => {
  let user;
  let activity;
  let statsParent;

  beforeEach(() => {
    statsParent = new StatsParent();
    user = new User(userData[0]);
    activity = new Activity(activityData, user);
  });

  it('should be a function', () => {
    expect(Activity).to.be.a('function');
  });

  it('should have access to userData', () => {
    expect(activity.user).to.eql(userData[0]);
  });

  it('should have access to activityData', () => {
    expect(activity.activityData).to.eql(activityData);
  });


  it('should return the miles walked by a specific user for a specific day', () => {
    expect(activity.returnMilesWalked(user.id)).to.equal(6.60);
  });

  it('should return the average minutes active for a week', () => {
    expect(activity.returnAverageDataForWeek(1, 'minutesActive', user.id)).to.equal(148.71);
  });

  it('should return the average steps for a week', () => {
    expect(activity.returnAverageDataForWeek(1, 'numSteps', user.id)).to.equal(7908.71);
  });

  it('should return the average stairs for a week', () => {
    expect(activity.returnAverageDataForWeek(1, 'flightsOfStairs', user.id)).to.equal(19.57);
  });

  it('should return false if they did not meet their step goal for a date', () => {
    expect(activity.metStepGoal('2019/06/15', user.id)).to.equal(false);
  });

  it('should return true if they did  meet their step goal for a date', () => {
    expect(activity.metStepGoal("2019/06/17", user.id)).to.equal(true);
  });

  it('should return all days where exceeded step goal ', () => {
    expect(activity.returnAllStepGoalDays(user.id)).to.eql(['2019/06/17', '2019/06/22', '2019/06/23']);
  });

  it('should return all time stair climbing record ', () => {
    expect(activity.returnStepRecord(user.id)).to.equal(36);
  });

  it('should return all friends\' step count for the week ', () => {
    expect(activity.returnFriendsStepCount()[0]).to.eql({
      '2': 56526,
      '3': 46615,
      '4': 63243
    });
  });

  it('should return friend with most steps ', () => {
    expect(activity.returnFriendsStepCount()[1]).to.equal(4);
  });

  it('should return back the dates of what days had increasing steps for 3 or more days', () => {
    expect(activity.returnThreeDayStepStreak(user.id)).to.eql(['2019/06/25', '2019/06/24', '2019/06/23']);
  });

  it('should return back the dates of what days had increasing floors climbed for 2 or more days', () => {
    expect(activity.returnTwoDayStairStreak(user.id)).to.eql(['2019/06/26', '2019/06/25']);
  });

});
