export class FormatingUtil {
  formatTime(time,mili?){
    if(!time){
      time = '';
    }
    let miliCompare = 0;
    let divide = 1000;
    if(mili){
      miliCompare = 9;
      divide = 100;
    }
    if(typeof time === "string"){
      time = new Date(time);
    }
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let milliseconds = parseInt((time.getMilliseconds()/divide).toFixed(0));
    let miliString = '';
    if(mili){
      if(milliseconds < 10){
        miliString = '.'+milliseconds;
      }
      else{
        miliString = '.0';
      }
      //miliString = '.'+time.getMilliseconds();
    }
    if(milliseconds > miliCompare){
      seconds += 1;
      if(seconds > 59){
        seconds = '00';
        minutes += 1;
        if(minutes > 59){
          minutes = '00';
          hours += 1;
        }
      }
    }
    if(minutes < 10 && !(minutes.length === 2)){
      minutes = '0'+minutes;
    }
    if(seconds < 10 && !(seconds.length === 2)){
      seconds = '0'+seconds;
    }
    let hoursString = '';
    if(hours !== 0){
      hoursString = hours+':';
    }
    return hoursString+minutes+':'+seconds+miliString;
    return time; 
  }
}
