import {Component, OnInit, ViewChild} from '@angular/core';
import {ApisService} from './core/services/apis.service';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('checked') checked;
  @ViewChild('modalClose', {static: true}) modalClose;
  storeList: Array<any>;
  storeListTemp: Array<any>;
  locationListArray: Array<any>;
  addressData: Array<any>;
  addressCoordinate: any;
  totalPage: number;
  isShow: boolean;
  pageNumber: number;
  pageSize: number;
  locationInput: any;
  isDisabled: boolean;
  showCreateShopForm: boolean;
  isNearByEnabled: boolean;
  inputValue: string;

  constructor( private apiService: ApisService) {}

  ngOnInit(): void {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.storeList = [];
    this.storeListTemp = [];
    this.addressData = [];
    this.getAllStores();
    this.locationInput = '';
    this.isDisabled = true;
    this.isNearByEnabled = false;
  }



  getAllStores(): void {
    const dataPayload = {
      latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
        longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: this.locationInput || ''
    };
    /**
     * Set pagination
     */
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
      this.totalPage = res.totalPages;
    });
  }
  /**
   * get previousPageious page data
   */
  previousPage(): void {
    const dataPayload = {
        latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
        longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: this.locationInput || ''
    };
    this.pageNumber -= 1;
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
    });
  }

  previousPageForNearBy(): void {
    const dataPayload = {
      latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
      longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: ''
    };
    this.pageNumber -= 1;
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
    });
  }
  /**
   * get nextPage page data
   */
  nextPage(): void {
    const dataPayload = {
        latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
        longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: this.locationInput || ''
    };
    this.pageNumber += 1;
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
    });
  }

  nextPageForNearBy(): void {
    const dataPayload = {
      latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
      longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: ''
    };
    this.pageNumber += 1;
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
    });
  }

  searchStores(searchUserInput): void {
    this.pageNumber = 0;
    this.pageSize = 10;
    const dataPayload = {
        latitude: this.addressCoordinate && this.addressCoordinate.lat ?  this.addressCoordinate.lat : 0,
        longitude: this.addressCoordinate && this.addressCoordinate.lng ?  this.addressCoordinate.lng : 0,
      name: searchUserInput.value || ''
    };
    this.apiService.getstoreDetails(dataPayload, this.pageNumber, this.pageSize).subscribe((res) => {
      this.storeListTemp = res.content;
      this.totalPage = res.totalPages;
    });
  }

  searchstores(event): void {
    const userInput = event.target.value;
    this.locationInput = userInput;
    this.apiService.getGeoLocationData(userInput).subscribe((res) => {
        this.locationListArray = res.results[0].address_components;
        this.addressData = res.results[0].formatted_address;
        this.addressCoordinate = res.results[0].geometry.location;
      },
      (err) => {
        this.addressData = [];
        this.locationListArray = [];
      });
  }

  disableButton(searchUserInput): void {
    if (searchUserInput.value === '') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
  resetSearch(searchUserInput, inputNearByValue): void {
    this.pageSize = 10;
    this.pageNumber = 0;
    this.addressCoordinate = null;
    this.locationInput = '';
    searchUserInput.value = '';
    inputNearByValue.value = '';
    this.inputValue = '';
    this.isShow = false;
    this.checked.nativeElement.checked = false;
    this.getAllStores();
  }

  selectAddress(addressData, inputNearByValue): void{
    inputNearByValue.value = addressData;
    this.getFiltered()
    this.addressData = [];
  }

  toggleInput(event): void {
    this.isShow = !!event.target.checked;
    this.isNearByEnabled = event.target.checked ? true : false;
  }

  createStoreEmit(newstore): void {
    this.pageSize = 10;
    this.pageNumber = 0;
    this.addressCoordinate = null;
    this.locationInput = '';
    this.getAllStores();
  }
  getFiltered(): void {
    const payload = {
      latitude: this.addressCoordinate.lat,
      longitude: this.addressCoordinate.lng,
      name: ''
    }
    this.apiService.getstoreDetails(payload,0,10).subscribe((res) => {
        this.storeListTemp = res.content;
        this.totalPage = res.totalPages;
      },
      (err) => {
      });
  }

  showShopForm(value): void{
      this.showCreateShopForm = value;
  }

  closeDialog(): void {
    this.modalClose.nativeElement.click();
  }



}
