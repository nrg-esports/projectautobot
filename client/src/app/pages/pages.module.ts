import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';

import { SecondsToHours, AverageMatchLength, SecondsToMinutes, ParsePercent, KillDeathAverage } from '../pipes';

import { MdInputModule,
         MdButtonModule,
         MdCardModule,
         MdSnackBarModule,
         MdTabsModule,
         MdIconModule,
         MdListModule,
         MdSelectModule,
         MdProgressSpinnerModule,
         MdChipsModule,
         MdSlideToggleModule,
         MdTooltipModule,
         MdToolbarModule,
         MdTableModule,
         MdRadioModule,
         MdButtonToggleModule,
         MdCheckboxModule,
         MdProgressBarModule,
         MdExpansionModule,
         MdGridListModule } from '@angular/material';

import {
  HomeComponent,
  FollowingComponent,
  FollowedUserComponent,
  GamerTagCardComponent,
  LeaderboardComponent,
  HeroesComponent,
  HeroComponent,
  HeroHeaderComponent,
  ESportsComponent,
  LiveComponent,
  NewsComponent,
  PostComponent,
  FriendsComponent,
  ProfileComponent,
  LifetimeStatsComponent,
  ProfileCareerComponent,
  MostPlayedComponent,
  HeroSkillsComponent,
  HeroPageTabsComponent,
  HeroCareerComponent,
  ProfileOverviewComponent,
  HeroWallCatalogComponent,
  CompareComponent,
  ComparedProfilesComponent,
  StatCategoryBlockComponent,
  HeroesHeaderComponent,
  HeroesTableComponent,
  PageNotFoundComponent,
  LoginComponent,
  NewsPageFiltersComponent,
  PostEntryComponent,
  UserRegistrationComponent,
  AccountSettingsComponent,
  ListOfCompareableHeroesComponent,
  SkillRatingTrendComponent,
  LeaderboardHeaderComponent,
  LeaderboardTableComponent,
  LeaderboardChartComponent,
  HeroesChartComponent,
  RecentlyPlayedComponent,
  OverallPerformanceComponent,
  RolePerformanceComponent,
  RecentSessionComponent,
  SnapshotsHistoryComponent,
  MatchSnapshotComponent,
  MatchDetailsComponent,
  ProfileHeroesComponent,
  ProfileHeroesTableComponent
} from './index';

@NgModule({
  imports: [
    RouterModule,
    NgbModule.forRoot(),
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpModule,
    NgxDatatableModule,
    InfiniteScrollModule,
    FlexLayoutModule,
    MdInputModule,
    MdButtonModule,
    MdCardModule,
    MdSnackBarModule,
    MdTabsModule,
    MdIconModule,
    MdListModule,
    MdSelectModule,
    MdProgressSpinnerModule,
    MomentModule,
    MdChipsModule,
    MdSlideToggleModule,
    MdTooltipModule,
    MdToolbarModule,
    MdTableModule,
    MdRadioModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdProgressBarModule,
    MdExpansionModule,
    MdGridListModule
  ],
  declarations: [
    HomeComponent,
    SecondsToHours,
    AverageMatchLength,
    ParsePercent,
    KillDeathAverage,
    SecondsToMinutes,
    FollowingComponent,
    FollowedUserComponent,
    GamerTagCardComponent,
    LeaderboardComponent,
    HeroesComponent,
    HeroComponent,
    HeroHeaderComponent,
    ESportsComponent,
    LiveComponent,
    NewsComponent,
    PostComponent,
    FriendsComponent,
    ProfileComponent,
    LifetimeStatsComponent,
    ProfileCareerComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    ProfileOverviewComponent,
    HeroWallCatalogComponent,
    CompareComponent,
    ComparedProfilesComponent,
    StatCategoryBlockComponent,
    HeroesHeaderComponent,
    HeroesTableComponent,
    PageNotFoundComponent,
    LoginComponent,
    NewsPageFiltersComponent,
    PostEntryComponent,
    UserRegistrationComponent,
    AccountSettingsComponent,
    ListOfCompareableHeroesComponent,
    SkillRatingTrendComponent,
    LeaderboardHeaderComponent,
    LeaderboardTableComponent,
    LeaderboardChartComponent,
    HeroesChartComponent,
    RecentlyPlayedComponent,
    OverallPerformanceComponent,
    RolePerformanceComponent,
    RecentSessionComponent,
    SnapshotsHistoryComponent,
    MatchSnapshotComponent,
    MatchDetailsComponent,
    ProfileHeroesComponent,
    ProfileHeroesTableComponent
  ],
  exports: [
    HomeComponent,
    FollowingComponent,
    FollowedUserComponent,
    GamerTagCardComponent,
    LeaderboardComponent,
    HeroesComponent,
    HeroComponent,
    HeroHeaderComponent,
    ESportsComponent,
    LiveComponent,
    NewsComponent,
    PostComponent,
    FriendsComponent,
    ProfileComponent,
    LifetimeStatsComponent,
    ProfileCareerComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    LoginComponent,
    UserRegistrationComponent,
    AccountSettingsComponent,
    LeaderboardHeaderComponent,
    LeaderboardTableComponent,
    LeaderboardChartComponent,
    HeroesChartComponent,
    OverallPerformanceComponent,
    RolePerformanceComponent,
    RecentSessionComponent,
    SnapshotsHistoryComponent,
    MatchSnapshotComponent,
    MatchDetailsComponent,
    ProfileHeroesComponent,
    ProfileHeroesTableComponent
  ]
})

export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
