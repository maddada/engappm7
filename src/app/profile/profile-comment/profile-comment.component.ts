import { Component, OnInit, Input } from '@angular/core';
import { ProfileComment } from '../../../model';

@Component({
  selector: 'app-profile-comment',
  templateUrl: './profile-comment.component.html',
  styleUrls: ['./profile-comment.component.scss']
})
export class ProfileCommentComponent implements OnInit {

  @Input() comment: ProfileComment;
  public publishedDate: Date;

  constructor() { }

  ngOnInit() {
    this.publishedDate = this.comment.createdAt.toDate();
  }

}
