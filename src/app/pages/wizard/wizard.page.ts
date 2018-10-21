import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Slides, NavController, MenuController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.page.html',
    styleUrls: ['./wizard.page.scss']
})
export class WizardPage implements OnInit {
    constructor(private storage: Storage, private nav: NavController, private menu: MenuController, private platform: Platform) { }

    showSkip = true;

    @ViewChild('slides') slides: Slides;

    ngOnInit() {
        this.platform.ready().then(() => {
            this.menu.swipeEnable(false);
        });
    }

    // ionViewWillEnter() {

    // }

    ionViewDidLeave() {
        // enable swiping the root left menu when leaving the tutorial page
        this.menu.swipeEnable(true);
    }

    onSlideChangeStart(event) {
        event.target.isEnd().then(isEnd => {
            this.showSkip = !isEnd;
        });
    }

    async finish() {
        await this.storage.set('tutorialComplete', true);
        this.nav.navigateForward('/');
    }

    next() {
        this.slides.slideNext(500, false);
    }
}
