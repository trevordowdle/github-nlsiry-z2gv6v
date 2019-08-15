
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface Race {
  classification: string;
  division: string;
  gender: string;
  name: string;
  year: string;
  'race-data': string;
  orig: boolean;
  omitYear: boolean;
} 

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main {

  raceObj = {
    raceData:'',
    title:'',
    omitYear:null,
    groupD:'',
    currentG:'',
    desc:'',
    orig:null
  };

  genderMap = {
    'collegemale':'Men',
    'collegefemale':'Women',
    'highschoolmale':'Boys',
    'highschoolfemale':'Girls'
  }

  first = true;
  results;
  loading = false;
  running = false;
  clicked = false;

  filters = {
    classification:'',
    gender:'',
    division:'',
    year:''
  }; 

  races$: Observable<Race[]|null> = null;
  yearFilter$: BehaviorSubject<string|null>;
  classificationFilter$: BehaviorSubject<string|null>;
  divisionFilter$: BehaviorSubject<string|null>;
  genderFilter$: BehaviorSubject<string|null>;

  constructor(public db: AngularFirestore) {
    this.filters = {
      classification:localStorage.getItem('EasyXC-classification') || '',
      gender:localStorage.getItem('EasyXC-gender') || '',
      division:localStorage.getItem('EasyXC-division') || '',
      year:localStorage.getItem('EasyXC-year') || ''
    }
  }

  ngOnInit(){

    let reIndex = window.location.href.indexOf('re=');
    let idIndex = window.location.href.indexOf('id=');
    if(idIndex >= 0 || reIndex >=0){
      let ref, ind, original = false;
      if(idIndex >= 0){
        ref = 'races/';
        original = true;
        ind = idIndex;
      } else {
        ind = reIndex;
        ref = 'simulations/'
      }
      this.loading = true;
      let id = window.location.href.substring(ind+3).split('&')[0];
      this.db.doc(ref+id).get()
      .subscribe((result)=>{
        this.loading = true;
        let data = result.data();
        this.raceObj.raceData = data.results || data['race-data'];
        this.raceObj.currentG = data.currentG || "";
        this.raceObj.groupD = data.groupD || "";
        this.raceObj.desc = data.description;
        this.raceObj.orig = original;
        this.raceObj.title = data.title || (data.name + ' ' + data.year);
        this.loading = false;
      });
    }

    this.first = true;
    this.yearFilter$ = new BehaviorSubject(null);
    this.classificationFilter$ = new BehaviorSubject(null);
    this.divisionFilter$ = new BehaviorSubject(null);
    this.genderFilter$ = new BehaviorSubject(null);

    this.races$ =  zip(
      this.yearFilter$,
      this.classificationFilter$,
      this.divisionFilter$,
      this.genderFilter$
    ).pipe(
      switchMap(([year,classification,division,gender]) => {
        if(this.first){
          this.first = false;
          return this.results ? this.results : [];
        } 
        console.warn('running query');
        return this.db.collection('races', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (year) { query = query.where('year', '==', year) };
          if (classification) { query = query.where('classification', '==', classification) };
          if (division) { query = query.where('division', '==', division) };
          if (gender) { query = query.where('gender', '==', gender) };
          this.running = false;
          return query;
        })
        .get();
      }),
      map(res=>{
        if(res['docs']){
          this.results = res['docs'].map(row=>{
            let rowRes = row.data();
            rowRes.id = row.id;
            return rowRes;
          });
          return this.results;
        }
        return this.results;
      })
    );
  }

  go(){
    this.clicked = true;
    this.running = true;
    localStorage.setItem('EasyXC-year',this.filters.year);
    localStorage.setItem('EasyXC-classification',this.filters.classification);
    localStorage.setItem('EasyXC-division',this.filters.division);
    localStorage.setItem('EasyXC-gender',this.filters.gender);
    this.yearFilter$.next(this.filters.year); 
    this.classificationFilter$.next(this.filters.classification); 
    this.divisionFilter$.next(this.filters.division); 
    this.genderFilter$.next(this.filters.gender); 
  }

  setRace(race){
    this.raceObj.omitYear = race.omitYear;
    this.raceObj.title = race.name + ' ' + race.year;
    this.raceObj.raceData = race['race-data'];
    this.raceObj.desc = '';
    this.raceObj.orig = true;
    this.first = true;
    history.pushState({},this.raceObj.title,'/?id='+race.id);
  }

  backToMain(){
    this.raceObj.title = null;
    history.pushState({},this.raceObj.title,'/');
  }

  clearDivision(){
    this.filters.division = '';
  }


  getGenderString(race){
    return this.genderMap[race.classification+race.gender];
  }

  upperFirst(text){
    return text[0].toUpperCase()+text.substring(1);
  }

}