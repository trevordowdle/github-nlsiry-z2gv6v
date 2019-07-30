
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  name: string;
  place: number;
  minutes: number;
  seconds: number;
  year: string;
}

@Component({
  selector: 'add-dialog',
  templateUrl: 'addDialog.html',
  styleUrls: ['addDialog.css']
})
export class AddDialog {
  constructor(
    public dialogRef: MatDialogRef<AddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  errMessage: string = '';

  ngOnInit(){
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addClick() {
    this.errMessage = '';
    if(!this.data.name){
      this.errMessage = 'Name required';
    }
    else if(!this.data.team){
      this.errMessage = 'Team required';
    }
    else if(!this.data.minutes){
      this.errMessage = 'Time required';
    }
    if(this.errMessage){
      return false;
    }
    this.dialogRef.close(this.data);
  }

  updateTime(val){
    let ref = this.data['results'][this.data['place']-1];
    if(!ref){
      ref = this.data['results'][this.data['results'].length-1];
    }
    this.data['time'] = ref.TIME;
  }

  updatePlace(val){
    if(!this.data.minutes){
      this.data.place = null;
      return false;
    }
    let insIndex = this.data['results'].findIndex(entry=>{
      let entryTimeInfo = this.breakDownTime(entry.TIME);
      if(this.data.minutes <= entryTimeInfo['minutes'] && this.data.seconds <= entryTimeInfo['seconds']){
        return true;
      }
    });
    if(insIndex === -1){
      insIndex = this.data['results'].length;
    }
    this.data.place = insIndex+1;
  }

  breakDownTime(time): object {
    time = time.split(':');
    let minutes,
      seconds;
    if(isNaN(time[0])){
      minutes = 0;
      seconds = 0;
    }
    else {
      minutes = time[0];
      seconds = time[1];
    }
    return {minutes,seconds};
  }

}