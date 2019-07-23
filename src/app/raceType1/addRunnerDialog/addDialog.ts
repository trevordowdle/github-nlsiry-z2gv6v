
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  name: string;
  place: number;
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
    else if(!this.data.place){
      this.errMessage = 'Place required';
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

}