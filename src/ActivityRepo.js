import StatsParent from "./StatsParent";

class ActivityRepo extends StatsParent {
  constructor(activityData, userData) {
    super();
    this.activityData = activityData;
    this.userData = userData;
  }

  returnAverage(date, relevantProperty) {
    let amountPerDay = this.activityData.filter(day => day.date === date);

    return this.getAverageFromDataList(amountPerDay, relevantProperty)
  }

  returnMostActive() {
    let person = [...this.activityData].sort((a, b) => b.minutesActive - a.minutesActive)[0].userID;
    let minActive = [...this.activityData].sort((a, b) => b.minutesActive - a.minutesActive)[0].minutesActive;
    return [this.userData.find(user => user.id === person).name, minActive];
  }
}

export default ActivityRepo;
