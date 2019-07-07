import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { User, SearchFilter } from '../../../model';
import { FilterModalPage } from './filter-modal/filter-modal.page';
import { ModalController, LoadingController, IonFab } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { FirestoreService } from '../../core/firestore.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { ShowToastService } from "../../core/show-toast.service";

enum SelectedCategory {
    NONE = 0,
    CONSULTANT = 1,
    CONTRACTOR = 2,
    SUPPLIER = 3,
    ALL = 4,
}

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {

    public selectedCategoryEnum = SelectedCategory; // passing enum to the view

    companies: User[];
    currentSelectedCategory: number = SelectedCategory.NONE;
    currentSelectedSupplierCategory: string = '-';
    searchAction: boolean = false;
    companies$: Observable<User[]>;

    filterOptions: SearchFilter;

    protected dir: string = 'rtl';

    unsubscribe$: Subject<any> = new Subject();

    protected loadingSearch: boolean = false;

    @ViewChild('scroll_top') scroll_top: ElementRef;

    constructor(
        private modal: ModalController,
        private db: FirestoreService,
        private loadingCtrl: LoadingController,
        private toast: ShowToastService,
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

        this.translate.get('dir').pipe(take(1)).subscribe(res => {
            //this.dir = res;
            this.dir = res;
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
            this.currentSelectedCategory = SelectedCategory.ALL;
            this.startSearch();
        }
    }

    //! Opening Search Filtering Popup
    public async startSearch() {

        this.loadingSearch = true;
        this.toast.toastController.dismiss().catch(_ => { });
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
                        let includesStr = false;

                        if (element.profileName != null) { //if has english name
                            includesStr = element.profileName.includes(this.filterOptions.searchString);
                        }

                        //if has arabic name and didn't match in english, check in arabic:
                        if (element.profileNameAr != null && includesStr === false) {
                            includesStr = element.profileNameAr.includes(this.filterOptions.searchString);
                        }

                        return includesStr;
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

            if (res.length > 0) {
                this.companies = res;
            } else {

                if (this.currentSelectedCategory !== SelectedCategory.SUPPLIER) {
                    //! make it show all companies
                    this.filterOptions = {
                        searchString: '',
                        city: 0,
                        tag: '',
                    };

                    this.currentSelectedCategory = SelectedCategory.ALL;
                    this.currentSelectedSupplierCategory = '-';

                    if (this.translate.currentLang === 'en') {
                        this.toast.showToast("Didn't find any companies that match your search");
                    }

                    if (this.translate.currentLang === 'ar') {
                        this.toast.showToast("لم يتم العثور على أية شركات");
                    }
                } else {
                    // if supplier category selection
                    this.currentSelectedCategory = SelectedCategory.SUPPLIER;
                    this.currentSelectedSupplierCategory = '-';

                    if (this.translate.currentLang === 'en') {
                        this.toast.showToast("Didn't find any suppliers in this category.");
                    }

                    if (this.translate.currentLang === 'ar') {
                        this.toast.showToast("لم يتم العثور على أية موردين في هذا التصنيف.");
                    }
                }


            }

            this.loadingSearch = false;

            this.scroll_top.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

            // console.log(this.companies);

        });

        await showLoading.dismiss();
    }

    protected getDirection(): Object {

        return { 'direction': this.dir };
    }

    //! Selecting Category (Consultant,Contractor,Supplier)
    protected selectCategory(selected: SelectedCategory) {
        this.searchAction = false; //reset
        switch (selected) {
            case SelectedCategory.NONE:
                this.currentSelectedCategory = SelectedCategory.NONE;
                this.filterOptions.tag = '';
                this.startSearch();
                break;

            case SelectedCategory.CONSULTANT:
                this.currentSelectedCategory = SelectedCategory.CONSULTANT;
                this.filterOptions.tag = 'company_consultant';
                this.startSearch();
                break;

            case SelectedCategory.CONTRACTOR:
                this.currentSelectedCategory = SelectedCategory.CONTRACTOR;
                this.filterOptions.tag = 'company_contractor';
                this.startSearch();
                break;

            case SelectedCategory.SUPPLIER:
                this.currentSelectedCategory = SelectedCategory.SUPPLIER;
                this.currentSelectedSupplierCategory = '-';
                this.filterOptions.tag = '';
                break;

            case SelectedCategory.ALL:
                this.currentSelectedCategory = SelectedCategory.ALL;
                this.filterOptions.tag = '';
                break;

            default:
                break;
        }
    }

    protected scroll(el: HTMLElement) {
        el.scrollIntoView();
    }

    protected setSelectedSupplierCategory(category?: string) {
        this.searchAction = false; //reset
        if (category === 'all') {
            this.currentSelectedSupplierCategory = 'company_supplier';
        }
        else {
            this.currentSelectedSupplierCategory = category;
        }

        this.filterOptions.tag = this.currentSelectedSupplierCategory;
        this.startSearch();
    }

    protected goBackCat() {
        // if a suppleir cat was selected go back to supplier selection
        if (this.currentSelectedCategory === SelectedCategory.SUPPLIER && this.currentSelectedSupplierCategory !== '-') {
            this.currentSelectedSupplierCategory = '-';
        }
        // else just clear filter options
        else
        {
            this.clearFilterOptions();
        }
    }

    protected clearFilterOptions() {
        this.filterOptions = {
            searchString: '',
            city: 0,
            tag: '',
        };

        this.currentSelectedCategory = 0;
        this.currentSelectedSupplierCategory = '-';

        this.startSearch();
    }
}


