import { Component, OnChanges } from '@angular/core';
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

  isDataAvailable = false;


  playerIds = [];

  p1sggId;
  p1Tag;
  p1Punishes: Array<object> = [];
  p1Hits = 0;
  p1Damage = 0;
  p1Frames = 0;
  p1Kills = 0;


  p2sggId;
  p2Tag;
  p2Punishes: Array<object> = [];
  p2Hits = 0;
  p2Damage = 0;
  p2Frames = 0;
  p2Kills = 0;
  doughnutChartData: number[]
  doughnutChartLabels: string[] = [this.p1Tag, this.p2Tag]
  doughtnutChartType: string

  barChartLabels: string[] = ['Average Punishes to Kill', 'Average Damage Per Punish', 'Average Hits Per Punish', ]
  barChartType:string =  'bar'
  barChartLegend:boolean = true;
  barChartData:any[] = [
    {data: [this.p1Punishes.length / this.p1Kills, this.p1Damage / this.p1Punishes.length, this.p1Hits / this.p1Punishes.length], label: 'Player 1'},
    {data: [this.p2Punishes.length / this.p2Kills, this.p2Damage / this.p2Punishes.length, this.p2Hits / this.p2Punishes.length], label: 'Player 2'},

  ]

  ngOnChanges() {
    this.getSetData()
  }






  
  constructor(private _smashggService: SmashggService){
  }

    createPunishObject(gameId, i, j) {
      let punishObj = {};
      punishObj['gameId'] = gameId
      punishObj['damage'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['percentEnd'] - this.setData['games'][gameId]['players'][i]['punishes'][j]['percentStart']
      punishObj['hits'] =  this.setData['games'][gameId]['players'][i]['punishes'][j]['hitCount']
      punishObj['isKill'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['isKill']
      punishObj['time'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameEnd'] - this.setData['games'][gameId]['players'][i]['punishes'][j]['frameStart']
      punishObj['frameStart'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameStart']
      punishObj['frameEnd'] = this.setData['games'][gameId]['players'][i]['punishes'][j]['frameEnd']
      return punishObj;
    }
    resetGlobals() {
      this.playerIds = [];

      this.p1sggId;
      this.p1Tag;
      this.p1Punishes = [];
      this.p1Hits = 0;
      this.p1Damage = 0;
      this.p1Frames = 0;
      this.p1Kills = 0;


      this.p2sggId;
      this.p2Tag;
      this.p2Punishes = [];
      this.p2Hits = 0;
      this.p2Damage = 0;
      this.p2Frames = 0;
      this.p2Kills = 0;

    }
    // for each game in the set
    // for each player in a game
    // if the player['playerId'] matches the sggPlayerId parameter.
    //
    // push to player one stuff
    // else push to player 2 stuff
    // can write goal == player dict or goal == player2 dict from our globall wooo

    
  

  getSetData() {
    console.log('getting the set ID')
    this._smashggService.retrieveSetData(this.setId)
    .then(data => {
      this.resetGlobals()
      this.doughnutChartLabels = ['','']
      this.setData = data;

      for (var key in this.setData['summary']) {
        this.playerIds.push(key)
      }
      console.log(data)
      this.p1sggId = this.playerIds[0]
      console.log(this.playerIds)
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
          for (var j = 0; j < this.setData['games'][gameId]['players'][i]['punishes'].length; j++) {

            if (this.setData['games'][gameId]['players'][i]['playerId'] == this.p1sggId) {
              let punishObj = this.createPunishObject(gameId, i, j)
              this.p1Damage += punishObj['damage']
              this.p1Hits += punishObj['hits'] //useless information lol or is it hits / punishes
              if (punishObj['isKill']) {
                this.p1Kills += 1
              }
              this.p1Frames += punishObj['time']
              this.p1Punishes.push(punishObj)
            }
            else {
              console.log('within the else conditional now!')
              let punishObj = this.createPunishObject(gameId, i, j)
              this.p2Damage += punishObj['damage']
              this.p2Hits += punishObj['hits'] //useless information lol or is it hits / punishes
              if (punishObj['isKill']) {
                this.p2Kills += 1
              }
              this.p2Frames += punishObj['time']
              this.p2Punishes.push(punishObj)
            }
          }
        }
      }
        this.doughnutChartData = [this.p1Punishes.length , this.p2Punishes.length ];
        this.doughnutChartLabels = [this.p1Tag, this.p2Tag]
        console.log(this.p1Tag, this.p2Tag)
        this.doughtnutChartType = 'doughnut'
        this.barChartData = [
          {data: [this.p1Punishes.length / this.p1Kills, this.p1Damage / this.p1Punishes.length, this.p1Hits / this.p1Punishes.length], label: this.p1Tag},
          {data: [this.p2Punishes.length / this.p2Kills, this.p2Damage / this.p2Punishes.length, this.p2Hits / this.p2Punishes.length], label: this.p2Tag},
        ]

        this.isDataAvailable = true;
    })
    .catch(err => console.log(err))
    }


  }


