 export class RaceLogic {
  groupingData:any = {};
  currentGroups:any = {};
  hasGroupings:boolean = false;
  checkHasGroupings(){
    this.hasGroupings = Object.keys(this.currentGroups).length > 0;
  }
  handleUngrouping(result){
    if(result.selectedTeams.length !== result.groupTeams.length){
      result.selectedTeams.filter(team=>{
        return result.groupTeams.indexOf(team) === -1;
      })
      .map(removedTeam=>{
        delete this.groupingData[removedTeam];
      });
      if(result.groupTeams.length === 0){
        delete this.currentGroups[result.team];
      }
      else {
        this.currentGroups[result.team] = result.groupTeams;
      }
    }
    this.checkHasGroupings();
  }
  handleGrouping(result){
    this.groupingData[result.team] = result.grouping;
    if(!this.currentGroups[result.grouping]){
      this.currentGroups[result.grouping] = [];
    }
    this.currentGroups[result.grouping].push(result.team);
    this.checkHasGroupings();
  }
  buildResults(startResults){
    //get Scoring info
    let scoringInfo = this.buildScoringInfo(startResults);

    //get Scoring filters
    let scoringFilters = this.buildScoringFilters(scoringInfo);
    //Bottom info detail
    //calculate runners scores
    let results = this.calculateScores(startResults,scoringFilters);
    // TOP info detail //
    //get scoring totals by team
    let scoreTotals = this.getScoringTotals(results);
    //populate score, avg time, spread
    let raceInfo = this.populateRaceInfo(scoringInfo,scoreTotals);
    //get scoring keys in order by place
    let scoringKeys = this.getScoringKeys(raceInfo); 
    return {raceInfo:raceInfo,scoringKeys:scoringKeys,results:results};
  }
  //order,totaltime,scoringTimes
  buildScoringInfo(results){
    return results.reduce((sInfo,result,i)=>{
      let team = result['TEAM'];
      if(this.groupingData[team]){
        team = this.groupingData[team];
      }

      if(!sInfo[team]){
        sInfo[team] = {
          count:0,
          SCORE:0,
          order:[],
          totalTime:new Date('1/1/1'),
          scoringTimes:[]
        };
      }
      let infoRef = sInfo[team];
      console.log(result['TIME']);
      if(infoRef.count < 5 && result['TIME'] !== 'DNF'){
        infoRef.count += 1;
        //infoRef.score += result['PL']; // may not be needed could be processed on the fly
        infoRef.order.push(result['PL']);
        this.addTime(result['TIME'],infoRef.totalTime); // may not be needed could be processed on the fly
        infoRef.scoringTimes.push(result['TIME']);
      }
      return sInfo;
    },{});
  }
  //order,totaltime,scoringTimes
  addTime(time:string,elapsedTime:Date,subtract?:boolean){
    let timeInfo = time.split(':');
    let minutes = parseInt(timeInfo[0]),
        seconds = parseFloat(timeInfo[1]),
        milliseconds = (seconds%1)*1000;
    seconds = Math.floor(seconds);

    if(subtract){
      minutes*=-1;
      seconds*=-1;
      milliseconds*=-1;
    }

    elapsedTime.setMinutes(elapsedTime.getMinutes()+minutes);
    elapsedTime.setSeconds(elapsedTime.getSeconds()+seconds);
    elapsedTime.setMilliseconds(elapsedTime.getMilliseconds()+milliseconds);
  }
  //scoring filters teams under 5 participants and populate average and spread
  buildScoringFilters(scoringInfo){
    return Object.keys(scoringInfo).reduce((scoringFilters,team)=>{
      if(scoringInfo[team].count < 5){
        scoringFilters.push(team);
      }
      return scoringFilters;
    },[]);
  }
  //Determine runners scores
  calculateScores(passedInResults,scoringFilters){
    let results = JSON.parse(JSON.stringify(passedInResults));
    let teamCount = {};
    results.filter((result,index)=>{
      let team = result['TEAM'];
      if(this.groupingData[team]){
        team = this.groupingData[team];
      }
      result['PL'] = index+1;
      if(!teamCount[team]){
        teamCount[team] = 0;
      }
      teamCount[team] += 1;
      return scoringFilters.indexOf(team) === -1 && teamCount[team] <= 7 /*&& (team === 'BYU' ||team === "Oregon")*/; //duel meet calculations
    })
    .reduce((teamObj,result,i)=>{
      let team = result['TEAM'];
      if(this.groupingData[team]){
        team = this.groupingData[team];
      }
      if(!teamObj[team]){
        teamObj[team] = 0;
      }
      teamObj[team] += 1;
      if(teamObj[team] <= 5){
        result['SCORE'] = i+1;
      }
      return teamObj;
    },{});
    return results;
  }
  getScoringTotals(results){
    return results.reduce((scoreObj,result)=>{
      let team = result['TEAM'];
      if(this.groupingData[team]){
        team = this.groupingData[team];
      }
      if(!scoreObj[team]){
        scoreObj[team] = {
          score:0,
          count:0
        }
      }
      let infoRef = scoreObj[team];
      infoRef.count += 1;
      if(infoRef.count <= 5){
        infoRef.score += result['SCORE'];
      }
      return scoreObj
    },{});
  }
  populateRaceInfo(info,scoreTotals){
    let scoringInfo = JSON.parse(JSON.stringify(info));
    Object.keys(scoreTotals).map(key=>{
      scoringInfo[key].score = scoreTotals[key].score;
      scoringInfo[key].spread = this.getSpread(scoringInfo[key].scoringTimes);
      scoringInfo[key].average = this.getAverage(scoringInfo[key].scoringTimes);
    });  
    return scoringInfo;
  }
  getSpread(scoringTimes){
    let a = new Date('1/1/1');
    if(scoringTimes.length && scoringTimes.length > 1){
      this.addTime(scoringTimes[scoringTimes.length-1],a);
      this.addTime(scoringTimes[0],a,true); 
      return a;
    }
  }
  getAverage(scoringTimes){
    let average = 0,
    a;
    if(!scoringTimes.length){
      return '';
    }
    scoringTimes.map((time,i)=>{
      a = new Date('1/1/1');
      this.addTime(scoringTimes[i],a);
      average += a.getTime();
    });
    average = average/scoringTimes.length;
    a.setTime(average);
    return a;
  }
  getScoringKeys(raceInfo){
    return Object.keys(raceInfo)
    .filter(key=>{
      return raceInfo[key].count >= 5;
    })
    .sort(function(a,b){
      return raceInfo[a].score < raceInfo[b].score ? -1 : 1;
    });
  }
}
