import { Injectable } from '@angular/core';
import { ToastOptions } from '../../../node_modules/@ionic/core';
import { ToastController } from '../../../node_modules/@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowToastService {

  constructor(private toastController: ToastController) { }


  async showToast(message: string, parameter?: string, duration: number = 5000) {

    let toastOptions: ToastOptions;

    if (parameter) {
      toastOptions = {
        message: `${message}: ${parameter}`,
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

    toast.present();
  }
}
