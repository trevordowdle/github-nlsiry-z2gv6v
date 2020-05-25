export class RaceData {
  buildResults(raceData,omitYear){
    let initialResults = raceData.split('||');
    return initialResults.reduce((output,result,i)=>{
      let info = result.split("-*-");
      output.push({
        NAME:info[0],
        YR:omitYear ? '' : info[1],
        TEAM:info[2],
        TIME:info[3],
        TAG:info[4]
      });
      return output;
    },[]);
  }
}
