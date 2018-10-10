import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../model';

@Component({
  selector: 'app-profile-element',
  templateUrl: './profile-element.component.html',
  styleUrls: ['./profile-element.component.scss']
})
export class ProfileElementComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
    // TODO: Use Cloud Functions to set rating for a user
    this.user.rating = 4;
  }

}
