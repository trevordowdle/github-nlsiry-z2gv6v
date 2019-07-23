export class RaceData {
  buildResults(raceData,omitYear){
    let initialResults = raceData.split('||');
    return initialResults.reduce((output,result,i)=>{
      let info = result.split("-*-");
      output.push({
        NAME:info[1],
        YR:omitYear ? '' : info[2],
        TEAM:info[3],
        TIME:info[5]
      });
      return output;
    },[]);
  }
}
