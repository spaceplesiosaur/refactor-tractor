class StatsParent {
  constructor() {

  }
  //used in sleep, hydration, activity
  findUser(userData, id) {
    return userData.filter(user => user.userID === id);
  }

  //used in sleep, activity
  returnWeekOfData(numWeeks, userData) {
    return [...userData].splice((-7 * numWeeks), 7);
  }

  //used in sleep, hydration
  returnWeek(numWeeks, userData, id) {
    var specificUser = this.findUser(userData, id)
    return [...specificUser].splice(-7 * numWeeks, 7).map(day => day.date);
  }
  //used in sleepREpo, ActivityREpo
  getAverageFromDataList(dataList, relevantProperty) {
    return Number((dataList.reduce((totalQuality, eachPerson) => {
      totalQuality += eachPerson[relevantProperty];
      return totalQuality;
    }, 0) / dataList.length).toFixed(2));
  }
  //used in sleep, hydration
  returnAvgData(userData, id, relevantProperty) {
      let specificUser = this.findUser(userData, id);
      return this.getAverageFromDataList(specificUser, relevantProperty)
    }
    //used in sleep, activity, hydration
  returnUserDataForDay(userData, id, date, relevantProperty) {
    let specificUser = this.findUser(userData, id);
    return specificUser.find(day => day.date === date)[relevantProperty];
  }
  //used in sleep, hydration
  returnWeekOfSpecificData(numWeeks, userData, id, relevantProperty) {
    let specificUser = this.findUser(userData, id);
    return this.returnWeekOfData(numWeeks, specificUser).map(day => day[relevantProperty]);
  }

}


export default StatsParent;
