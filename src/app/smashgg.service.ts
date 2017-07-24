import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class SmashggService {

  constructor(private _http: Http) { }
  retrieveSetData(setId) {
    return this._http.get(`https://api.smash.gg/slippi/getBySet/${setId}`).map(data=>data.json()).toPromise();
  }

}
