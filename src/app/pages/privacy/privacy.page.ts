import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.page.html',
    styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

    constructor(
        private modal: ModalController,
        protected router: Router,
        private nav: NavController
    ) { }

    ngOnInit() {
    }

    onClickDismiss() {
        if (this.router.url.includes("privacy")) {
            this.nav.navigateBack('/');
        }
        else {
            this.modal.dismiss();
        }
    }
}
