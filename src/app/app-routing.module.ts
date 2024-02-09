import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {ParticularPredictionResultPage} from "./pages/particular-prediction-result/particular-prediction-result.page";

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
    redirectTo: 'history',
    pathMatch: 'full'
  },
  {
    path: 'prediction-result',
    loadChildren: () => import('./pages/prediction-result/prediction-result.module').then(m => m.PredictionResultPageModule)
  },
  {
    path: 'particular-prediction-result',
    loadChildren: () => import('./pages/particular-prediction-result/particular-prediction-result.module').then(m => m.ParticularPredictionResultPageModule),
    // data: { predictionResult: "" }
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
