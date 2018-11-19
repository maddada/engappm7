import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, SearchFilter } from '../../../model';
import { FilterModalPage } from './filter-modal/filter-modal.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { FirestoreService } from '../../core/firestore.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

  companies: User[];
  companies$: Observable<User[]>;

  filterOptions: SearchFilter;

  unsubscribe$: Subject<any> = new Subject();

  constructor(
    private modal: ModalController,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    public translate: TranslateService) {

  }

  async ngOnInit() {

    const showLoading = await this.loadingCtrl.create({
      translucent: false,
      spinner: "bubbles",
      showBackdrop: true,
      animated: true,
      keyboardClose: true,
      mode: "md",
    });
    await showLoading.present();

    this.filterOptions = {
      searchString: '',
      city: 0,
      tag: '',
    };

    this.companies$ = this.db.col$('users').pipe(takeUntil(this.unsubscribe$));

    this.companies$.subscribe(res => {
      this.companies = res;
      showLoading.dismiss();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async onClickFilterSearch() {
    const modal = await this.modal.create({
      component: FilterModalPage,
      componentProps: { filterOptions: this.filterOptions }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterOptions = data;
      this.startSearch();
    }
  }

  public async startSearch() {

    const showLoading = await this.loadingCtrl.create({
      translucent: false,
      spinner: "bubbles",
      showBackdrop: true,
      animated: true,
      keyboardClose: true,
      mode: "md",
    });
    await showLoading.present();

    // console.log(this.filterOptions);

    if (this.filterOptions.city !== 0) {
      this.companies$ = this.db.col$('users', ref => ref.where('city', '==', this.filterOptions.city));
    } else if (this.filterOptions.city === 0) {
      this.companies$ = this.db.col$('users');
    }

    await this.companies$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res == null) { return; }

      if (res.length > 0) {
        // _: Make sure it only shows companies!
        res = res.filter(element => {
          if (element.tags != null) {
            return element.tags.includes('company');
          }
          else {
            return false;
          }
        });

        // _: Filter according to the search string (name of company)
        if (res.length > 0 && this.filterOptions.searchString != null && this.filterOptions.searchString !== '') {
          res = res.filter(element => {
            if (element.profileName != null) {
              return (element.profileName.includes(this.filterOptions.searchString)
                || element.profileNameAr.includes(this.filterOptions.searchString));
            } else {
              return false;
            }
          });
        }

        // _: Filter according to the tag (tags array contains)
        if (res.length > 0 && this.filterOptions.tag != null && this.filterOptions.tag !== '') {
          if (res.length > 0) {
            res = res.filter(element => {
              if (element.tags != null) {
                return element.tags.includes(this.filterOptions.tag);
              }
              else {
                return false;
              }
            });
          }
        }
      }

      this.companies = res;

      // console.log(this.companies);

    });


    await showLoading.dismiss();


  }

}


