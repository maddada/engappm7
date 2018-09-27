import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../core/firestore.service';
import { Tender } from '../../../model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-tender',
  templateUrl: './view-tender.page.html',
  styleUrls: ['./view-tender.page.scss'],
})
export class ViewTenderPage implements OnInit {

  currentTender: Observable<Tender>;

  constructor(
    private route: ActivatedRoute,
    private fb: FirestoreService,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    // this.currentTender = this.fb.doc$(`tenders/${id}`);
    this.currentTender = this.fb.doc$(`tenders/${id}`);
  }

}
