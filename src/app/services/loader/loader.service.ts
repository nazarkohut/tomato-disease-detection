import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader: HTMLIonLoadingElement| null = null;

  constructor(private loadingController: LoadingController) {}

  async showLoader(loadingMessage: string = "Loading...") {
    this.loader = await this.loadingController.create({
      message: loadingMessage,
      // translucent: true,
      // spinner: null, // Set to null to hide default spinner
      // translucent: true,
      // cssClass: 'custom-loader', // Add a custom CSS class for styling
      // component: CustomSpinnerComponent, // Use your custom spinner component
    });
    await this.loader.present();
  }

  async hideLoader() {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }
}

