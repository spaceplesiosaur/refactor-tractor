import StatsParent from "./StatsParent";

class Activity extends StatsParent {
  constructor(activityData, user) {
    super();
    this.activityData = activityData;
    this.user = user;
  }

  returnMilesWalked(id) {
    let specificUser = this.findUser(this.activityData, id);
    return Number((this.user.strideLength * specificUser[specificUser.length - 1].numSteps / 5280).toFixed(2))
  }

  returnAverageDataForWeek(week, relevantProperty, id) {
    let specificUser = this.findUser(this.activityData, id)
    let weekOfData = this.returnWeekOfData(week, specificUser);
    return this.getAverageFromDataList(weekOfData, relevantProperty)
  }

  metStepGoal(date, id) {
    let specificUser = this.findUser(this.activityData, id)
    let numSteps = specificUser.find(day => day.date === date).numSteps
    return numSteps >= this.user.dailyStepGoal
  }

  returnAllStepGoalDays(id) {
    let specificUser = this.findUser(this.activityData, id)
    let stepGoal = this.user.dailyStepGoal;
    return specificUser.filter(day => day.numSteps >= stepGoal).map(day => day.date);
  }

  returnStepRecord(id) {
    let specificUser = this.findUser(this.activityData, id)
    return [...specificUser].sort((a, b) => b.flightsOfStairs - a.flightsOfStairs)[0].flightsOfStairs
  }

  returnFriendsStepCount() {
    let friends = this.user.friends.map(friend => this.activityData.filter(el => el.userID === friend));
    let friendDataForDates = friends.map(friend => [...friend].splice(-7));
    let totalStepsPerFriend = friendDataForDates.map(friend => friend.reduce((totalSteps, day) => {
      totalSteps += day.numSteps
      return totalSteps
    }, 0));
    var stepObj = this.user.friends.reduce((friendSteps, friend, index) => {
      friendSteps[friend] = totalStepsPerFriend[index];
      return friendSteps
    }, {})
    return [stepObj, this.user.friends[totalStepsPerFriend.indexOf(Math.max(...totalStepsPerFriend))]]
  }

  returnThreeDayStepStreak(id) {
    let specificUser = this.findUser(this.activityData, id).reverse();
    let dates = [];
    specificUser.some((user, i, specificUser) => {
      if (specificUser[i].numSteps < specificUser[i + 1].numSteps && specificUser[i + 1].numSteps < specificUser[i + 2].numSteps) {
        dates.push(specificUser[i].date);
        dates.push(specificUser[i + 1].date);
        dates.push(specificUser[i + 2].date);
      }
      return dates.length === 3;
    });

    return dates;
  }

  returnTwoDayStairStreak(id) {
    let specificUser = this.findUser(this.activityData, id).reverse();
    let dates = [];
    specificUser.some((user, i, specificUser) => {
      if (specificUser[i].flightsOfStairs > specificUser[i + 1].flightsOfStairs) {
        dates.push(specificUser[i].date);
        dates.push(specificUser[i + 1].date);
      }
      return dates.length === 2;
    });

    return dates;
  }
}

export default Activity;
