import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'wiki',
    loadChildren: () => import('./pages/wiki/wiki.module').then(m => m.WikiPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: '',
    redirectTo: 'wiki',
    pathMatch: 'full'
  },
  {
    path: 'prediction-result',
    loadChildren: () => import('./pages/prediction-result/prediction-result.module').then(m => m.PredictionResultPageModule)
  },
  {
    path: 'particular-prediction-result/:id',
    loadChildren: () => import('./pages/particular-prediction-result/particular-prediction-result.module').then(m => m.ParticularPredictionResultPageModule),
  },
  {
    path: 'disease-info/:id',
    loadChildren: () => import('./pages/disease-info/disease-info.module').then( m => m.DiseaseInfoPageModule)
  },
  {
    path: 'history-day/:year/:month/:day',
    loadChildren: () => import('./pages/history-day/history-day.module').then( m => m.HistoryDayPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
