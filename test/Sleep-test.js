const chai = require('chai');
const expect = chai.expect;

import sleepData from '../data/sleep-test-data';
import userData from '../data/users-test-data';
import allSleepData from '../data/sleep';

import Sleep from '../src/Sleep';
import User from '../src/User';


describe('Sleep', () => {

  let user, sleep, fullSleep;
  beforeEach(() => {
    user = new User(userData[0]);
    sleep = new Sleep(sleepData, user.id);
    fullSleep = new Sleep(allSleepData, user.id);
  })

  it('should be a function', () => {
    expect(Sleep).to.be.a('function');
  });

  it('should be an instance of the class Sleep', () => {
    expect(sleep).to.be.an.instanceOf(Sleep);
  });

  it('should be able to store sleep data as a parameter', () => {
    expect(sleep.sleepData).to.eql(sleepData);
  });

  it('should be able to store user id as a parameter', () => {
    expect(sleep.userID).to.equal(user.id);
  });

  it('should return hours slept each day for week for a specific user', () => {
    expect(fullSleep.returnWeekOfSpecificData(2, allSleepData, user.id, 'hoursSlept')).to.eql([7.3, 5.1, 8.6, 10.5, 9.1, 6.5, 6.8]);
  });

  it('should return hours slept each day for week for a specific user', () => {
    expect(fullSleep.returnWeekOfSpecificData(2, allSleepData, user.id,'sleepQuality')).to.eql([4.8, 4.7, 3.7, 1.8, 1.5, 4.2, 2]);
  });

});
