import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.page.html',
    styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

    protected showBack = true;

    constructor(private modal: ModalController, protected router: Router) { }

    ngOnInit() {
        if (this.router.url.includes("privacy")) {
            this.showBack = false;
        }
    }

    onClickDismiss() {
        this.modal.dismiss();
    }
}
