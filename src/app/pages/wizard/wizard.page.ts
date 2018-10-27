import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Slides, NavController, MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.page.html',
    styleUrls: ['./wizard.page.scss']
})
export class WizardPage implements OnInit {
    constructor(private storage: Storage, private nav: NavController, private menu: MenuController, private platform: Platform) { }

    showSkip = true;

    @ViewChild('slides') slides: Slides;

    i;

    ngOnInit() {
        this.platform.ready().then(() => {
            // temp fix for ionic beta zone.js error:
            this.menu.swipeEnable(false).catch(_ => { });
        });
    }

    ionViewDidLeave() {
        // enable swiping menu when leaving the tutorial page
        this.menu.swipeEnable(true).catch(_ => { });
    }

    onSlideChangeStart(event) {
        event.target.isEnd().then(isEnd => {
            this.showSkip = !isEnd;
        });
    }

    async finish() {
        await this.storage.set('tutorialComplete', true);
        this.slides.slideTo(0).then(_ => {
            this.nav.navigateForward('/');
        });
        // window.location.reload(true);
    }

    ionViewWillLeave() {
        // window.location.reload(true);
    }

    next() {
        this.slides.slideNext(500, false);
    }
}
