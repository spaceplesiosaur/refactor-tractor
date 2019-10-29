class SleepRepo {
  constructor(sleepData) {
    this.sleepData = sleepData;
  }

  returnDataByUser() {
    return this.sleepData.reduce((arr, user) => {
      if (!arr[user.userID - 1]) {
        arr[user.userID - 1] = [user];
      } else {
        arr[user.userID - 1].push(user);
      }
      return arr;
    }, []);
  }

  returnAvgSleepDataPerUser(week, relevantProperty) {
    let dataByUser = this.returnDataByUser();
    return dataByUser.map(user => [...user].splice(-7 * week, 7)).map(user => user.reduce((totalAcc, day)  => {
       totalAcc += parseFloat(day[relevantProperty]);
      return totalAcc;
    }, 0))
  };

  returnAboveAverageSleepers(week) {
    let dataByUser = this.returnDataByUser();

    let avgSleepQualityPerUser = this.returnAvgSleepDataPerUser(1, 'sleepQuality').map(user => Number((user / 7).toFixed(2)));

    let goodSleepers = [];
    avgSleepQualityPerUser.forEach((user, index) => {
      if (user >= 3) {
        goodSleepers.push(index + 1);
      }
    });
    return goodSleepers;
  }

  returnLongestSleepers(date) {
    var dateData = this.sleepData.filter(day => day.date === date);
    var sortedSleepers = [...dateData].sort((a, b) => b.hoursSlept - a.hoursSlept);
    return sortedSleepers.filter(day => day.hoursSlept === sortedSleepers[0].hoursSlept).map(user => user.userID);
  }

  returnWeeklyLongestSleepers(week) {
    let dataByUser = this.returnDataByUser();
    let avgSleepHoursPerUser = this.returnAvgSleepDataPerUser(week, 'hoursSlept')
    return [Math.max(...avgSleepHoursPerUser), avgSleepHoursPerUser.indexOf(Math.max(...avgSleepHoursPerUser)) + 1];
  }
}



export default SleepRepo;
