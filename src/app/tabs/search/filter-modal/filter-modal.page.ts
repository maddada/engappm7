import { Component, OnInit } from '@angular/core';
import { SearchFilter } from '../../../../model';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  selectedCityNumber: number;
  selectedCityString: string;

  filterOptions: SearchFilter;

  constructor(private navParams: NavParams,
    private modal: ModalController) { }

  ngOnInit() {
    this.filterOptions = this.navParams.data.filterOptions;
    this.selectedCityString = '' + this.filterOptions.city;
  }

  public onSelectCity($event) {
    this.filterOptions.city = Number(this.selectedCityString);
  }

  onClickSearch() {
    this.modal.dismiss(this.filterOptions);
  }

}
