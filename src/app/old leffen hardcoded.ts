import { Component } from '@angular/core';
import { SmashggService } from './smashgg.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Slippi Stats Viz';
  setId: string = '7650196'
  setData: object = {};
  stockData: object = {};
  ppuPunishes: Array<object> = []; //id 1012
  lffnPunishes: Array<object> = []; // id 4465 
  lffnHits = 0;
  lffnDamage = 0;
  lffnFrames = 0;
  lffnKills = 0;
  lffnMaxNeutralWinsForKill: Number = 1;
  lffnMinNeutralWinsForKill: Number = 1;

  playerIds = [];

  p1sggId;
  p1Tag;
  p1Punishes: Array<object> = [];
  p1Hits = 0;
  p1Damage = 0;
  p1Frames = 0;
  p1Kills = 0;
  p1MaxNeutralWinsForKill = 1;
  p1MinNeutralWinsForKill = 1;

  p2sggId;
  p2Tag;
  p2Punishes: Array<object> = [];
  p2Hits = 0;
  p2Damage = 0;
  p2Frames = 0;
  p2Kills = 0;
  p2MaxNeutralWinsForKill = 1;
  p2MinNeutralWinsForKill = 1;

  
  constructor(private _smashggService: SmashggService){}

  getSetData() {
    console.log('getting the set ID')
    this._smashggService.retrieveSetData(this.setId)
    .then(data => {
      this.setData = data;
      for (var key in this.setData['summary']) {
        this.playerIds.push(key)
      }
      this.p1sggId = this.playerIds[0]
      this.p1Tag = this.setData['summary'][this.p1sggId]['gamerTag']
      this.p2sggId = this.playerIds[1]
      this.p2Tag = this.setData['summary'][this.p2sggId]['gamerTag']
      console.log(this.p1sggId)
      console.log(this.p1Tag)
      console.log(this.p2sggId)
      console.log(this.p2Tag)

      for (var gameId in this.setData['games']) {
        console.log(gameId)
        for (var i = 0; i < this.setData['games'][gameId]['players'].length; i++){ //each players array of punishes in a game
          // console.log(this.setData['games'][gameId]['players'][i])
          // console.log("this players id is ", this.setData['games'][gameId]['players'][i]['playerId'])
          var MaxNeutralWinsForKill = 0;
          var MinNeutralWinsForKill = 100; // change later 
          for (var j = 0; j < this.setData['games'][gameId]['players'][i]['punishes'].length; j++) {
            // console.log('this is a punish object from smashgg')
            // console.log(this.setData['games'][gameId]['players'][i]['punishes'][j])
            MaxNeutralWinsForKill += 1;
            MinNeutralWinsForKill += 1;

            let punishObj = {}
            punishObj['gameId'] = gameId
            
            if (this.setData['games'][gameId]['players'][i]['playerId'] == '4465') {
              console.log('within the if conditional now!')
              punishObj['damage'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['percentEnd'] - this.setData['games'][gameId]['players'][i]['punishes'][j]['percentStart']
              this.lffnDamage += punishObj['damage']
           
              punishObj['hits'] =  this.setData['games'][gameId]['players'][i]['punishes'][j]['hitCount']
              this.lffnHits += punishObj['hits'] //useless information lol or is it hits / punishes

              punishObj['isKill'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['isKill']
              if (punishObj['isKill']) {
                this.lffnKills += 1

                if (this.lffnMaxNeutralWinsForKill < MaxNeutralWinsForKill) {
                  this.lffnMaxNeutralWinsForKill = MaxNeutralWinsForKill
                }
                if (this.lffnMinNeutralWinsForKill > MinNeutralWinsForKill) {
                  this.lffnMinNeutralWinsForKill = MinNeutralWinsForKill
                }
                var MaxNeutralWinsForKill = 0;
                var MinNeutralWinsForKill = 100; // change later 
              }
              punishObj['time'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameEnd'] - this.setData['games'][gameId]['players'][i]['punishes'][j]['frameStart']
              this.lffnFrames += punishObj['time']
              punishObj['frameStart'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameStart']
              punishObj['frameEnd'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameEnd']

              console.log("this is leffen's punish relevant punish data!", punishObj)
              this.lffnPunishes.push(punishObj)

            // }
          }
        }
      }

      }
    })
    .catch(err => console.log(err))
    }
  }


