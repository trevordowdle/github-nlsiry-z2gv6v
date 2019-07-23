import { NgModule } from '@angular/core';
import { LongPressDirective } from './longpress.directive';
import { MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatToolbarModule, MatExpansionModule, MatListModule, MatSnackBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { RaceType1 } from './raceType1/race-type1';
import { Main } from './main/main';
import { GroupingDialog } from './raceType1/groupingDialog/groupingDialog';
import { AddDialog } from './raceType1/addRunnerDialog/addDialog';
import { ModifyDialog } from './raceType1/modifyRunnerDialog/modifyDialog';
import { UrlDialog } from './raceType1/createURLDialog/urlDialog';
import { ShowURLDialog } from './raceType1/showURLDialog/showURLDialog';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

const config = {
  apiKey: "AIzaSyC_DXHG7rYxY_npJ54Y7_PPXStQ5FJs3S0",
  authDomain: "cc-ease.firebaseapp.com",
  databaseURL: "https://cc-ease.firebaseio.com",
  projectId: "cc-ease",
  storageBucket: "",
  messagingSenderId: "453211459832",
  appId: "1:453211459832:web:7cb7ef6886b2b942"
};

@NgModule({
  imports: [ 
    BrowserModule, BrowserAnimationsModule, FormsModule, DragDropModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatToolbarModule, MatExpansionModule, MatListModule, MatSnackBarModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule 
  ],
  entryComponents: [GroupingDialog, AddDialog, ModifyDialog, UrlDialog, ShowURLDialog],
  declarations: [ Main, RaceType1, GroupingDialog, AddDialog, ModifyDialog, UrlDialog, ShowURLDialog, LongPressDirective],
  bootstrap:    [ Main ]
})
export class AppModule { }
