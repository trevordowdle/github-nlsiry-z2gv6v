import { Component, Input, Inject } from '@angular/core';
import { MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/firestore';
import { GroupingDialog } from './groupingDialog/groupingDialog';
import { AddDialog } from './addRunnerDialog/addDialog';
import { ModifyDialog } from './modifyRunnerDialog/modifyDialog';
import { UrlDialog } from './createURLDialog/urlDialog';
import { ShowURLDialog } from './showURLDialog/showURLDialog';
import { RaceLogic } from "./script/RaceLogic";
import { DropLogic } from "./script/DropLogic";
import { RaceData } from "./script/RaceData";
import { FormatingUtil } from "./script/FormatingUtil";

@Component({
  selector: 'race-type1',
  templateUrl: './race-type1.html',
  styleUrls: ['./race-type1.css']
})
export class RaceType1 {

title:'';
desc:'';
raceInfo:object;
scoringKeys:object;
results:any;
originalResults:any;
startResults:any;
resultKeys:Array<string> = ["PL","NAME","YR","TEAM","TIME","SCORE"];
resultsModified:boolean = false;
raceLogic:any;
dropLogic:any;
formatingUtil:any;
headerInfoExpanded:boolean = false;
highlightedTeam:'';

@Input() raceObj:any = {};

  constructor(public dialog: MatDialog, public db: AngularFirestore, private _snackBar: MatSnackBar){}

  ngOnInit(){
    this.formatingUtil = new FormatingUtil();
    this.raceLogic = new RaceLogic();
    this.dropLogic = new DropLogic();
    let raceDataInf = new RaceData();
    if(!this.raceObj.orig){
      this.raceLogic.groupingData = JSON.parse(this.raceObj.groupD);
      this.raceLogic.currentGroups = JSON.parse(this.raceObj.currentG);
      this.originalResults = JSON.parse(this.raceObj.raceData);
      this.startResults = JSON.parse(this.raceObj.raceData); 
    }
    else {
      let initialResults = raceDataInf.buildResults(this.raceObj.raceData,this.raceObj.omitYear);
      this.originalResults = JSON.parse(JSON.stringify(initialResults));
      this.startResults = initialResults;
    }
    this.title = this.raceObj.title;
    this.desc = this.raceObj.desc;
    this.buildResults(this.startResults);
  };

  closeHeaderInfo(){
    this.headerInfoExpanded = false;
  }

  buildResults(startResults){
    let info = this.raceLogic.buildResults(startResults);
    this.raceInfo = info.raceInfo;
    this.scoringKeys = info.scoringKeys;
    this.results = info.results;
  }

  openModifyDialog(index): void {

    let entry = this.startResults[index];
    let timeInfo = this.breakDownTime(entry.TIME);
    //minutes
    //seconds
    const dialogRef = this.dialog.open(ModifyDialog, {
      width: '320px',
      height: '400px',
      data: {
        minutes:timeInfo['minutes'],
        seconds:timeInfo['seconds'],
        team:entry.TEAM,
        name:entry.NAME
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        if ( result.remove ) {
          this.startResults.splice(index,1)[0];
          this.buildResults(this.startResults);
          this.resultsModified = true;
        }
        else if (
          result.minutes !== timeInfo['minutes'] || result.seconds !== timeInfo['seconds']
          || result.team !== entry.TEAM
        ) {
          let removedEntry = this.startResults.splice(index,1)[0];
          removedEntry.TEAM = result.team;
          removedEntry.TIME = result.minutes+':'+result.seconds;
          let insIndex = this.startResults.findIndex(entry=>{
            let entryTimeInfo = this.breakDownTime(entry.TIME);
            if(result.minutes <= entryTimeInfo['minutes'] && result.seconds <= entryTimeInfo['seconds']){
              return true;
            }
          });
          this.startResults.splice(insIndex,0,removedEntry);
          this.buildResults(this.startResults);
          this.resultsModified = true;
        }
      }
    });
  }

  buildDesc(){
    let descArr = Object.keys(this.scoringKeys).map(key=>{
      return this.scoringKeys[key] + ' ' + this.raceInfo[this.scoringKeys[key]].score;
    });
    let desc = descArr.join(', ');
    if(desc.length > 99){
      return desc.substring(0,96)+'...';
    }
    return desc;
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

  openGroupDialog(team): void {
    let groupTeams = this.raceLogic.currentGroups[team];
    //check for grouping here
    const dialogRef = this.dialog.open(GroupingDialog, {
      width: '300px',
      height: '270px',
      data: {groupTeams:groupTeams,team:team}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.grouped){
          this.raceLogic.handleUngrouping(result);
        }
        else {
          this.raceLogic.handleGrouping(result);
        }
        this.buildResults(this.startResults);
        this._snackBar.open('Updated',null,{
          duration: 1000
        });
      }
    });
  }

  openAddDialog(team): void {
    //check for grouping here
    const dialogRef = this.dialog.open(AddDialog, {
      width: '300px',
      height: '420px',
      data: {
        results:this.startResults
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let ref = result['results'][result['place']-1];
        if(!ref){
          ref = result['results'][result['results'].length-1];
        }
        let addedEntry = JSON.parse(JSON.stringify(ref));
        addedEntry.NAME = result.name;
        addedEntry.TEAM = result.team;
        this.startResults.splice(result.place-1, 0,addedEntry);
        this.buildResults(this.startResults);
        this.resultsModified = true;
      }
    });
  }

  showGroupingModal(team){
    this.openGroupDialog(team);
  }

  showAddModal(team){
    setTimeout(()=>{
      this.openAddDialog(team);
    },100);
  }

  showModifyModal(index){
    this.openModifyDialog(index);
  }

  openUrlDialog(): void {
    //check for grouping here
    const dialogRef = this.dialog.open(UrlDialog, {
      width: '220px',
      height: '300px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let ref = this.db.collection('simulations');
        ref.add({
          results:JSON.stringify(this.startResults),
          groupD:JSON.stringify(this.raceLogic.groupingData),
          currentG:JSON.stringify(this.raceLogic.currentGroups),
          description:result.description,
          title:this.title
        })
        .then((res)=>{
          this.openShowUrlDialog(window.location.href+'?re='+res.id);
        });
      }
    });
  }

  openShowUrlDialog(url): void {
      const dialogRef = this.dialog.open(ShowURLDialog, {
        width: '400px',
        height: '170px',
        data: {
          url:url
        }
    });
  }

  undoChanges(){
    this.startResults = JSON.parse(JSON.stringify(this.originalResults));
    this.buildResults(this.startResults);
    this.resultsModified = false;
  }

  undoGroupings(){
    this.raceLogic.groupingData = {};
    this.raceLogic.currentGroups = {};
    this.buildResults(this.startResults);
    this.raceLogic.hasGroupings = false;
  }

  saveChanges(){
    this.openUrlDialog();
  }

  highlightTeam(team,ev){
    //event.stopPropagation();
    alert('highlight team ' + team);
  }

  stopPropagation(){
    event.stopPropagation();
  }

}


