import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
export class DropLogic {
  drop(componentThis:any, event: CdkDragDrop<string[]>) {
    moveItemInArray(componentThis.startResults, event.previousIndex, event.currentIndex);
    if(event.previousIndex !== event.currentIndex){
      this.adjustTime(componentThis, event.currentIndex === componentThis.startResults.length-1,event.currentIndex);
      componentThis.buildResults(componentThis.startResults);
      componentThis.resultsModified = true;
      componentThis._snackBar.open('Updated',null,{
        duration: 1000
      });
    }
  }
  adjustTime(componentThis:any,last,currentIndex){
    let ref = last ? -1 : 1;
    componentThis.startResults[currentIndex]['TIME'] = componentThis.startResults[currentIndex+ref]['TIME'];
  }
}
