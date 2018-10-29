import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-select-lang',
  templateUrl: './select-lang.page.html',
  styleUrls: ['./select-lang.page.scss'],
})
export class SelectLangPage implements OnInit {

  constructor(private nav: NavController, public translate: TranslateService, private storage: Storage) { }

  ngOnInit() {
  }

  ArButtonClicked() {
    this.useLanguage('ar');
  }

  EnButtonClicked() {
    this.useLanguage('en');
  }

  useLanguage(selectedLanguage: string) {
    this.translate.use(selectedLanguage);
    this.translate.setDefaultLang(selectedLanguage);
    this.storage.set('language', selectedLanguage);

    this.storage.get('first_time').then((val) => {
      if (val !== null) {
        // console.log(`Not first launch.`);
        // go back to settings page after selecting language.
        // window.location.reload(true);
        this.nav.navigateRoot('/');
      } else {
        // console.log('First launch.');

        this.storage.set('first_time', 'done');

        // open wizard after selecting language!
        if (this.translate.currentLang === 'ar') {
          // this.nav.navigateForward('/wizard-ar');
          this.nav.navigateForward('/');
        }
        else if (this.translate.currentLang === 'en') {
          // this.nav.navigateForward('/wizard');
          this.nav.navigateForward('/');

        }
      }
    });

  }
}
