import StatsParent from "./StatsParent";

class Hydration extends StatsParent {
  constructor(hydrationData, userID) {
    super()
    this.hydrationData = hydrationData;
    this.userID = userID;
  }

  // findUser() {
  //   return this.hydrationData.filter(user => user.userID === this.userID);
  // }

  returnHydrationWeek(weekNum, data, id) {
    return this.returnWeek(weekNum, data, id)
  }

  returnAverageFluidOunces(userData, id) {
    return this.returnAvgData(userData, id, 'numOunces').toFixed(2)
  }

  returnDailyFluidOunces(userData, id, date, relevantProperty) {
    return this.returnUserDataForDay(userData, id, date, relevantProperty)
  }

  returnWeeklyNumOunces(numWeeks, userData, id, relevantProperty) {
    return this.returnWeekOfSpecificData(numWeeks, userData, id, relevantProperty)
  }

}


export default Hydration;