import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-lang',
  templateUrl: './select-lang.page.html',
  styleUrls: ['./select-lang.page.scss'],
})
export class SelectLangPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // TODO: Make each one set different language and change app direction.
  ArabicButtonClicked() {
    this.router.navigate(['/home']);
  }

  EnglishButtonClicked() {
    this.router.navigate(['/home']);
  }
}
