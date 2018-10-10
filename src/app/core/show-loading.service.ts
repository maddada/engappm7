import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowLoadingService {

  private loading;

  constructor(public loadingController: LoadingController) { }

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      // duration: 200,
      translucent: false,
      spinner: 'bubbles',
      showBackdrop: true,
      animated: true,
      mode: 'md',
      keyboardClose: true,
      // message: '',
      // cssClass: 'custom-class custom-loading'
    });

    return await this.loading.present();
  }

  async presentLoadingDismissAfter(dismissAfter: number) {
    this.loading = await this.loadingController.create({
      duration: dismissAfter,
      translucent: false,
      spinner: 'bubbles',
      showBackdrop: true,
      animated: true,
      mode: 'md',
      keyboardClose: true,
      // message: '',
      // cssClass: 'custom-class custom-loading'
    });

    return await this.loading.present();
  }

  dismiss() {
    this.loadingController.dismiss();
  }

  async delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
