
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  grouping: string;
  groupTeams?: Array<string>;
  selectedTeams?: Array<string>;
  grouped?: boolean;
}

@Component({
  selector: 'grouping-dialog',
  templateUrl: 'groupingDialog.html',
})
export class GroupingDialog {
  constructor(
    public dialogRef: MatDialogRef<GroupingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(){
    if(this.data.groupTeams){
      this.data.selectedTeams = this.data.groupTeams;
      this.data.grouping = this.data.team;
      this.data.grouped = true;
    }
    else {
      this.data.grouping = '';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}