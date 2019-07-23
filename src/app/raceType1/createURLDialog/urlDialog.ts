
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  description: string;
}

@Component({
  selector: 'url-dialog',
  templateUrl: 'urlDialog.html',
  styleUrls: ['urlDialog.css']
})
export class UrlDialog {
  constructor(
    public dialogRef: MatDialogRef<UrlDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  errMessage: string = '';

  ngOnInit(){
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getLinkClick() {
    this.errMessage = '';
    if(!this.data.description){
      this.errMessage = 'Desc required';
      return false;
    }
    if(!(this.data.description.length > 2)){
      this.errMessage = 'Desc too short';
      return false;
    }
    this.dialogRef.close(this.data);
  }

}