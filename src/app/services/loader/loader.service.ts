import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader: HTMLIonLoadingElement| null = null;

  constructor(private loadingController: LoadingController) {}

  async showLoader() {
    this.loader = await this.loadingController.create({
      spinner: null,
      cssClass: 'global-loader',
      duration:10000000,
      translucent: true,
    });
    await this.loader.present();
  }

  async hideLoader() {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }
}

