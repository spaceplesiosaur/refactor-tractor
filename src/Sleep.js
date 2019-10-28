import StatsParent from '../src/StatsParent'
class Sleep extends StatsParent{
  constructor(sleepData, userID) {
    super();
    this.sleepData = sleepData;
    this.userID = userID;
  }
}


export default Sleep;
