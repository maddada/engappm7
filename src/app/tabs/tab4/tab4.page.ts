import { Component, OnInit, ViewChild, } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ProfileComment, User, M7LoadingOptions } from '../../../model';
import { Observable, of } from 'rxjs';
import { FirestoreService } from '../../core/firestore.service';
import { switchMap } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ProfileElementComponent } from '../../profile/profile-element/profile-element.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  @ViewChild(ProfileElementComponent)
  public profileElement: ProfileElementComponent;

  public showNotLoggedIn: boolean = false;
  public showComments: boolean = false;
  public logo: string = 'assets/images/logo/Thuraya.png';
  public comments$: Observable<ProfileComment[]>;
  public comments: ProfileComment[];
  public user: User;
  public editMode: boolean;
  public l: string;
  constructor(public auth: AuthService, private loadingCtrl: LoadingController, private db: FirestoreService,
    public translate: TranslateService) { }

  async  ngOnInit() {

    this.editMode = false;



    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    this.comments$ = this.auth.user$.pipe(
      switchMap(res => {
        if (res) {
          return this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', res.uid));
        } else {
          return of(null);
        }
      }));

    this.auth.user$.subscribe(res => {
      this.user = res;
      this.showNotLoggedIn = true;
      showLoading.dismiss();
    });

    this.comments$.subscribe(res => {
      this.comments = res;
      this.showComments = true;
    });

  }

  toggleEditOn() {
    this.editMode = true;
    this.profileElement.toggleEditOn();
  }

  cancle() {
    this.editMode = false;
    this.profileElement.cancle();
  }

  saveUpdate() {
    this.editMode = false;
    this.profileElement.saveUpdate();
  }

}





