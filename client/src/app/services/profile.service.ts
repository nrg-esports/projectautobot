import { equals, propEq, merge, head, clone } from 'ramda';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';

import { Player } from '../models';

import { GamerTagService, GamerTagFetchResponse } from './gamer-tag.service';
import { SocketService } from './socket.service';
import { OverwatchHeroDataService } from './owherodata.service';
import { OverwatchStaticData } from '../models';
import { gamerTagFetchQuery, playerStatsChangeQuery } from './queries';

const GAMER_TAG_CHANNEL = 'gamer_tag:lobby';

interface Statistic {
  allHeroesSnapshotStatistic: {
    gameHistoryStatistic: {
      gamesWon: number;
      gamesPlayed: number;
      winPercentage: number;
    };
  };
}

interface StatChangeResponse {
  gamerTag: {
    currentStatistics: Statistic[];
    pastStatistics: Statistic[];
  };
}

@Injectable()
export class ProfileService {
  constructor(
    private router: Router,
    private gamerTagService: GamerTagService,
    private socketService: SocketService,
    private owHeroData: OverwatchHeroDataService,
    private apollo: Apollo
  ) { }

  goto(player: Player) {
    const tag = player.tag.replace('#', '-');

    if (player.region) {
      this.router.navigate(['./profile', player.platform, player.region, tag]);
    } else {
      this.router.navigate(['./profile', player.platform, tag]);
    }
  }

  findPlayer(tag, platform, region) {
    const variables = { tag, platform, region, snapshotLast: 2 };

    return this.apollo.query<GamerTagFetchResponse>({ query: gamerTagFetchQuery, variables })
      .map(({ data }) => clone(data.gamerTag));
  }

  latestStatsSet(player: Player) {
    return {
      competitive: this.getLatestSnapshot(player, true),
      quickPlay: this.getLatestSnapshot(player, false)
    };
  }

  observeChanges(playerId: number) {
    return this.socketService.join(GAMER_TAG_CHANNEL)
      .let(this.socketService.filterEvent('change'))
      .map(({ gamerTags }) => head<number>(gamerTags))
      .filter(equals(playerId))
      .switchMap((id) => this.gamerTagService.getGamerTagStats(id));
  }

  leaveChangesChannel() {
    return this.socketService.leave(GAMER_TAG_CHANNEL);
  }

  addOwData(gamerTag) {
    if (gamerTag.snapshotStatistics) {
      return Observable.forkJoin([Observable.of(gamerTag), this.owHeroData.data$])
        .map(([playerTag, owHeroData]: [Player, OverwatchStaticData]) => {
          return merge(playerTag, {
            snapshotStatistics: playerTag.snapshotStatistics
              .map(this.addHeroDataToSnapshot(owHeroData))
          });
        });
    } else {
      return Observable.of(gamerTag);
    }
  }

  getOverviewStatChanges(player: Player) {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const variables = { id: player.id, since };
    return this.apollo.query<StatChangeResponse>({ query: playerStatsChangeQuery, variables })
      .map((response) => {
        const { pastStatistics, currentStatistics } = response.data.gamerTag;
        const current = currentStatistics[0].allHeroesSnapshotStatistic.gameHistoryStatistic;
        const past = pastStatistics[0].allHeroesSnapshotStatistic.gameHistoryStatistic;

        const pastWinPercentage = past.gamesWon / past.gamesPlayed;
        const currentWinPercentage = current.gamesWon / current.gamesPlayed;

        return {
          winPercentage: (currentWinPercentage / pastWinPercentage) - 1
        };
      });
  }

  private addHeroesToHeroSnapshot(heroes) {
    return function(heroSnapshot) {
      return Object.assign({}, heroSnapshot, { hero: heroes.heroes.find(({ code }) => code === heroSnapshot.hero.code) });
    };
  }

  private addHeroDataToSnapshot(heroes) {
    return (snapshot) => {
      return Object.assign({}, snapshot, {
        heroSnapshotStatistics: snapshot.heroSnapshotStatistics.map(this.addHeroesToHeroSnapshot(heroes))
      });
    };
  }

  private getLatestSnapshot(player: Player, isCompetitive: boolean) {
    if (!player.snapshotStatistics) {
      return null;
    } else {
      const [snapshotStatistic] = player.snapshotStatistics
        .filter(propEq('isCompetitive', isCompetitive))
        .reverse();

      return snapshotStatistic || null;
    }
  }
}
