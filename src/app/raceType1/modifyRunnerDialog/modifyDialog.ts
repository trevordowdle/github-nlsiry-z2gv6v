
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  name: string;
  tag: string;
  minutes: number;
  seconds: number;
  remove: boolean;
}

@Component({
  selector: 'modify-dialog',
  templateUrl: 'modifyDialog.html',
  styleUrls: ['modifyDialog.css']
})
export class ModifyDialog {
  constructor(
    public dialogRef: MatDialogRef<ModifyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  errMessage: string = '';

  ngOnInit(){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateClick() {
    this.errMessage = '';
    if(!this.data.name){
      this.errMessage = 'Name required';
    }
    else if(!this.data.team){
      this.errMessage = 'Team required';
    }
    if(this.errMessage){
      return false;
    }
    this.dialogRef.close(this.data);
  }

  removeClick(){
    this.data.remove = true;
    this.dialogRef.close(this.data);
  }

}