import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowToastService {

  constructor(public toastController: ToastController) { }


  async showToast(message: string, parameter?: string, duration: number = 4000) {

    await this.toastController.dismiss().catch(_ => { });

    let toastOptions: any;

    if (parameter != null) {
      toastOptions = {
        message: `${message} ${parameter}`,
        position: 'bottom',
        duration: duration,
        translucent: false,
        cssClass: 'm7toast',
      };
    }
    else {
      toastOptions = {
        message: message,
        position: 'bottom',
        duration: duration,
        translucent: false,
        cssClass: 'm7toast',
      };
    }

    const toast = await this.toastController.create(toastOptions);

    await toast.present();
  }

  // async dismissToast() {
  //   this.toastController.dismiss();
  // }

}
