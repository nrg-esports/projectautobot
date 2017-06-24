import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { isEmpty } from 'lodash';
import { Apollo } from 'apollo-angular';

import { AppState, Player, Heroes } from './models';
import { getPlayerData, searchGamerTag } from './reducers';
import { OverwatchHeroDataService } from './services';

import '../style/app.scss';
import { gamerTagSearchQuery, heroSearchQuery } from './queries';

interface GamerTagSearchResponse {
  searchGamerTag: Player[];
  loading: boolean;
}

interface HeroesSearchResponse {
  heroes: Heroes[];
  loading: boolean;
}

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sub: Subscription;
  players: Observable<Player[]>;
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;

  constructor(private store: Store<AppState>, private apollo: Apollo, private owHeroData: OverwatchHeroDataService) {

    this.$state = this.store.select(s => s);

    this.players = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(players => !isEmpty(players));

    this.sub = store.let(searchGamerTag)
      .filter(tag => Boolean(tag))
      .do(() => this.searchResults.next([]))
      .mergeMap((tag) => this.find(tag))
      .map(players => Object.values(players))
      .subscribe(this.searchResults);

    this.getHeroes();

    this.owHeroData.load();
  }

  onSearch(action) {
    this.isResultsOpen = !!action.payload;
    this.store.dispatch(action);
  }

  find(tag) {
    return this.apollo.query<GamerTagSearchResponse>({ query: gamerTagSearchQuery, variables: { tag: tag } })
      .map(({data}) => data.searchGamerTag)
      .filter(data => data.length > 0)
      .switchMap((playerData) => Observable.forkJoin([Observable.of(playerData), this.owHeroData.data$ ]))
      .map(([_playerdata, owHeroData]) => {
        return _playerdata.map(player => Object.assign({}, player, {
          snapshotStatistics: player.snapshotStatistics
          .map(this.addHeroDataToSnapshot(owHeroData))
        }));
      })
      .map((playersData) => playersData.reduce((acc, player) => Object.assign(acc, {[player.region + player.platform]: player}), {}))
      .do((players) => this.store.dispatch({ type: 'ADD_PLAYER', payload: players }));
  }

  getHeroes() {
    return this.apollo.query<HeroesSearchResponse>({ query: heroSearchQuery })
      .filter(s => !!s.data.heroes)
      .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addHeroesToHeroSnapshot(heroes) {
    return function(heroSnapshot) {
      return Object.assign({}, heroSnapshot, { hero: heroes.heroes.find( ({code}) => code === heroSnapshot.hero.code ) } );
    };
  }

  addHeroDataToSnapshot(heroes) {
    return (snapshot) => {
      return Object.assign({}, snapshot, {
        heroSnapshotStatistics: snapshot.heroSnapshotStatistics.map(this.addHeroesToHeroSnapshot(heroes))
      });
    };
  }

}
