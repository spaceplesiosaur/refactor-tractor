class StatsParent {
  constructor() {

  }
  //used in sleep, hydration, activity
  findUser(userData) {
    return userData.filter(user => user.userID === this.userID);
  }

  //used in sleep, activity
  returnWeekOfData(numWeeks, userData) {
    return [...userData].splice((-7 * numWeeks), 7);
  }

  //used in sleep, hydration
  returnWeek(numWeeks) {
    var specificUser = this.findUser()
    return [...specificUser].splice(-7 * numWeeks, 7).map(day => day.date);
  }

  //used in sleep, hydration
  returnAvgData(relevantProperty) {
      let specificUser = this.findUser();
      return Number((specificUser.reduce((totalHours, daily) => {
        totalHours += daily[relevantProperty];
        return totalHours;
      }, 0) / specificUser.length).toFixed(2));
    }
    //used in sleep, activity, hydration
  returnUserDataForDay(date, relevantProperty) {
    let specificUser = this.findUser();
    return specificUser.find(day => day.date === date)[relevantProperty];
  }
  //used in sleep, hydration
  returnWeekOfSpecificData(numWeeks, relevantProperty) {
    let specificUser = this.findUser();
    return this.returnWeekOfData(numWeeks, specificUser).map(day => day[relevantProperty]);
  }

  //used in sleepREpo, ActivityREpo
  getAverageFromDataList(dataList, relevantData) {
    return Number((dataList.reduce((totalQuality, eachPerson) => {
      totalQuality += eachPerson[relevantData];
      return totalQuality;
    }, 0) / dataList.length).toFixed(1));
  }

  //used in SleepREpo and Activity
  returnAvgDataPerUser(numWeeks, relevantProperty) {
    let dataByUser = this.returnDataByUser();

    return dataByUser.map(user => [...user].splice(-7 * numWeeks, 7)).map(user => user.reduce((totalAcc, day)  => {
       totalAcc += day[relevantProperty];
      return totalAcc;
    }, 0))
  };

}




export default StatsParent;
