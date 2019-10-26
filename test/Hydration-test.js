const chai = require('chai');
const expect = chai.expect;

import hydrationData from '../data/hydration-test-data';
import userData from '../data/users-test-data';

import Hydration from '../src/Hydration';
import User from '../src/User';


describe('Hydration', () => {
  let hydration;
  let user;

  beforeEach(() => {
    user = new User(userData[0])
    hydration = new Hydration(hydrationData, user.id)
  });

  it('should be a function', () => {
    expect(Hydration).to.be.a('function');
  });

  it('should be an instance of the class Hydration', () => {
    expect(hydration).to.be.an.instanceOf(Hydration);
  });

  it('should hold hydration data', () => {
    expect(hydration.hydrationData).to.eql(hydrationData);
  });

  it('should contain userID', () => {
    expect(hydration.userID).to.equal(user.id);
  });

  it('should return the dates for the last week', () => {
    expect(hydration.returnHydrationWeek(1,hydrationData, 2)).to.eql(
      [
        "2019/06/16",
        "2019/06/17",
        "2019/06/18",
        "2019/06/19",
        "2019/06/20",
        "2019/06/21",
        "2019/06/22"
      ])
  });

  it('should return the average fluid ounces for a user for all time', () => {
    expect(hydration.returnAverageFluidOunces(hydrationData, 2)).to.equal('70.50');
  });

  it('should return the amount of fluid ounces consumed on a specific date for a specific person', () => {
    expect(hydration.returnDailyFluidOunces(hydrationData, 2, '2019/06/20', 'numOunces')).to.equal(71);
  });

  it('should return the amount of ounces consumed for one person over a week', () => {
    expect(hydration.returnWeeklyNumOunces(1, hydrationData, 2, 'numOunces')).to.eql([91, 96, 70, 76, 71, 27, 58]);
  });
})