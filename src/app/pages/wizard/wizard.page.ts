import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Slides, NavController, MenuController } from '@ionic/angular';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.page.html',
    styleUrls: ['./wizard.page.scss']
})
export class WizardPage implements OnInit {
    constructor(private storage: Storage, private nav: NavController, private menu: MenuController) { }

    @ViewChild(Slides)
    slides: Slides;

    ngOnInit() {
        this.menu.swipeEnable(false);
    }

    async finish() {
        await this.storage.set('tutorialComplete', true);
        this.nav.navigateForward('/');
    }

    next() {
        this.slides.slideNext(500, false);
    }
}
