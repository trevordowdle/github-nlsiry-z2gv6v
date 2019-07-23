
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

export interface DialogData {
  description: string;
}

@Component({
  selector: 'show-url-dialog',
  templateUrl: 'showURLDialog.html',
  styleUrls: ['showURLDialog.css']
})
export class ShowURLDialog {
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ShowURLDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(){}

  copyLinkClick(): void {
    navigator.clipboard.writeText(this.data.url);
    this._snackBar.open('Copied',null,{
      duration: 2000
    });
  }


}