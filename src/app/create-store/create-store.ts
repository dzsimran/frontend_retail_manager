import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EventEmitter } from '@angular/core';
import {ApisService} from '../core/services/apis.service';


@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent implements OnInit {
  @Output() createStoreDetailEmitter = new EventEmitter<string>();
  @Output() getfilteredDetailsEmitter = new EventEmitter<string>();
  @Output() toggleEmitter = new EventEmitter<boolean>();
  @ViewChild('boxDialog', {static: true}) boxDialog;
  createStoreForm: FormGroup;
  locationListArray: Array<any>;
  addressCoordinate: any;
  addressData: Array<any>;
  city: any;
  addressInfo: any;
  state: any;
  country: any;
  selectedAddress: any;
  success: boolean;
  message: any;
  isToast: boolean;

  constructor(private fb: FormBuilder, private apiService: ApisService) { }

  ngOnInit(): void {
    this.addressData = [];
    this.locationListArray = [];
    this.initialisecreateStoreForm();
  }

  closeModalBox(): void {
    this.toggleEmitter.emit(false);
    this.createStoreForm.reset();
    this.boxDialog.nativeElement.click();
  }

  /**
   * Create Form for add new store Data
   */
  initialisecreateStoreForm(): any {
    this.createStoreForm = this.fb.group({
      storeName: ['', [Validators.required]],
      ownerName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  get storeName(): any {return this.createStoreForm.get('storeName'); }
  get ownerName(): any {return this.createStoreForm.get('ownerName'); }
  get category(): any {return this.createStoreForm.get('category'); }
  get address(): any {return this.createStoreForm.get('address'); }

  createStore(): void {
    const dataPayload = {
      address: {
        address: this.selectedAddress ,
        city: this.city ? this.city : 'N/A',
        //country: this.country,
        latitude: this.addressCoordinate.lat,
        longitude: this.addressCoordinate.lng,
        state: this.state
      },
      category: this.createStoreForm.get('category').value,
      ownerName: this.createStoreForm.get('ownerName').value,
      name: this.createStoreForm.get('storeName').value
    };

    this.apiService.createStoreDetail(dataPayload).subscribe((res) => {
      this.isToast = true;
      this.createStoreDetailEmitter.emit(res);
      this.success = true;
      this.message = 'Successfully created.';
      setTimeout(() => {
        this.closeModalBox();
        this.isToast = false;
      }, 1500);
    });
  }

  /**
   * Call GEOLOCATION APIs for get address list
   * @type {get}
   */
  getlocationListArray(event): any{
    const userInput = event.target.value;
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

  /**
    This method loops over the address array based on their types and assigns them to appropriate variables
   */
  selectAddress(addressData): void{
    this.locationListArray.forEach((data) => {
      if (data.types[0] === 'locality'){
        this.city = data.long_name;
      }
      if (data.types[0] === 'administrative_area_level_1'){
        this.state = data.long_name;
      }
      if (data.types[0] === 'country'){
        this.country = data.long_name;
      }

      if (data.types[0] === 'political'){
        this.country = data.addressInfo;
      }
    });
    this.createStoreForm.patchValue({address: this.addressData});
    this.selectedAddress = this.addressData;
    this.addressData = [];
  }



  // hide the toaster message dialog
  closeToast(): void {
    this.isToast = false;
  }

}
