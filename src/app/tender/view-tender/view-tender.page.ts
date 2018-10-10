import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../core/firestore.service';
import { Tender, User } from '../../../model';
import { Observable, of } from 'rxjs';
import { finalize, take, flatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NavController, LoadingController } from '@ionic/angular';
import { ShowLoadingService } from '../../core/show-loading.service';
import { PreviousRouteService } from '../../core/previous-route.service';

@Component({
  selector: 'app-view-tender',
  templateUrl: './view-tender.page.html',
  styleUrls: ['./view-tender.page.scss'],
})
export class ViewTenderPage implements OnInit {

  tender$: Observable<Tender>;
  company$: Observable<User>;
  notFoundString: string = "";

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private nav: NavController,
    private loading: ShowLoadingService,
    private prevRoute: PreviousRouteService,
  ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.db.inspectDoc(`tenders/${id}`);

    this.tender$ = this.db.doc$<Tender>(`tenders/${id}`)
      .pipe(take(1));

    this.company$ = this.tender$.pipe(
      take(1),
      switchMap(tender => {
        // subs to tender$ and gets values from it, uses data to create another obs
        if (tender) { // if tender exists
          // then it returns the new observable
          return this.db.doc$<User>(`users/${tender.uid}`);
        } else {
          // return null so nothing appears
          return of(null); //return obs containing null only
        }
      })
    );

    /*
        subscribe(res => {
          if (res) {
            console.log('here 1', res);
            this.tender = res;
            this.company$ = this.db.doc$(`users/${res.uid}`);
            this.company$.subscribe(res2 => {
              console.log('here 3');
              this.company = res2;
            });
          } else {
            console.log('here 2');
            this.tender = null;
            this.company$ = of(null);
          }
        });
     */
    this.loading.delay(2000).then(() => {
      this.notFoundString = "Tender Not Found!";
    });

  }

  //tested and working perfectly
  goBack() {
    let prevRouterString = this.prevRoute.getPreviousUrl();
    // console.log(prevRouterString);
    if (prevRouterString.includes('/create-tender')) {
      this.nav.navigateBack('/');
    }
    else {
      this.nav.goBack();
    }
  }

}
