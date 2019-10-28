import StatsParent from '../src/StatsParent'
class Sleep extends StatsParent{
  constructor(sleepData, userID) {
    super();
    this.sleepData = sleepData;
    this.userID = userID;
    this.finder = this.findUser(this.sleepData, this.userID)
  }

  returnAvgSleepData(relevantProperty) {
      return Number((this.finder.reduce((totalHours, day) => {
        totalHours += day[relevantProperty];
        return totalHours;
      }, 0) / this.finder.length).toFixed(2));
    }

  returnSleepData(date, relevantProperty) {
    return this.finder.find(day => day.date === date)[relevantProperty];
  }

  returnWeekOfSleepData(week, relevantData) {
    return this.returnWeekOfData(week, this.finder).map(day => day[relevantData]);
  }
}


export default Sleep;
