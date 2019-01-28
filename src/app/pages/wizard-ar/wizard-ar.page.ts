import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, MenuController, Platform, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-wizard-ar',
  templateUrl: './wizard-ar.page.html',
  styleUrls: ['./wizard-ar.page.scss'],
})
export class WizardArPage implements OnInit {

  constructor(private storage: Storage, private nav: NavController, private menu: MenuController, private platform: Platform) { }

  showSkip = true;

  @ViewChild('slides') slides: IonSlides;

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
  }

  ionViewWillLeave() {
    // window.location.reload(true);
  }

  next() {
    this.slides.slideNext(500, false);
  }
}
