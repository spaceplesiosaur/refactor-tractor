class Sleep {
  constructor(sleepData, userID) {
    this.sleepData = sleepData;
    this.userID = userID;
  }

  findUser() {
    return this.sleepData.filter(user => user.userID === this.userID);
  }

  returnWeekOfData(week, userData) {
    return [...userData].splice((-7 * week), 7);
  }

  returnWeek(week) {
    var specificUser = this.findUser()
    return [...specificUser].splice(-7 * week, 7).map(day => day.date);
  }

  returnAvgSleepData(relevantProperty) {
      let specificUser = this.findUser();
      return Number((specificUser.reduce((totalHours, day) => {
        totalHours += day[relevantProperty];
        return totalHours;
      }, 0) / specificUser.length).toFixed(2));
    }

  returnsleepData(date, relevantProperty) {
    let specificUser = this.findUser();
    return specificUser.find(day => day.date === date)[relevantProperty];
  }

  returnWeekOfSleepData(week, relevantData) {
    let specificUser = this.findUser();
    return this.returnWeekOfData(week, specificUser).map(day => day[relevantData]);
  }
}


export default Sleep;
