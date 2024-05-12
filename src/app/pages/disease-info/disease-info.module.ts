import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiseaseInfoPageRoutingModule } from './disease-info-routing.module';

import { DiseaseInfoPage } from './disease-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiseaseInfoPageRoutingModule,
  ],
  declarations: [DiseaseInfoPage]
})
export class DiseaseInfoPageModule {}
