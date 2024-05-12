import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HeaderMenuComponent } from "./header-menu.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      // Tab routes
      {
        path: 'wiki',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/wiki/wiki.module').then(m => m.WikiPageModule),
        data: {title: "Tomato Ailments", showLogo: true}
      },
      {
        path: 'history',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/history/history.module').then(m => m.HistoryPageModule),
        data: {title: "History", showLogo: true}
      },
      {
        path: 'prediction-result',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/prediction-result/prediction-result.module').then(m => m.PredictionResultPageModule),
        data: {title: "Take a picture", showLogo: true}
      },
      // Routes inside tabs and other routes
      {
        path: 'particular-prediction-result/:id',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/particular-prediction-result/particular-prediction-result.module').then(m => m.ParticularPredictionResultPageModule),
        data: {title: "Disease prediction", showLogo: true}
      },
      {
        path: 'wiki/disease-info/:disease-name',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/disease-info/disease-info.module').then( m => m.DiseaseInfoPageModule),
        data: {title: "Tomato Ailments", showLogo: false}
      },
      {
        path: 'history/history-day/:year/:month/:day',
        component: HeaderMenuComponent,
        loadChildren: () => import('../../pages/history-day/history-day.module').then( m => m.HistoryDayPageModule),
        data: {title: "History for ", showLogo: false}
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class HeaderMenuRoutingModule { }
