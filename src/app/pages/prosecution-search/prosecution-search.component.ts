import {  ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IcjsSearchService } from '../services/icjs-search.service';
import { HttpErrorResponse } from '@angular/common/http';

import { ModalService } from '../services/modal.service';
import { OtherPillarInformation } from '../models/otherpillarinformation.model';

import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { ProsecutionComponent } from '../_components/prosecution/prosecution.component';

@Component({
  selector: 'app-prosecution-search',
  templateUrl: './prosecution-search.component.html',
  styleUrl: './prosecution-search.component.css'
})
export class ProsecutionSearchComponent {
  otherPillarData? : OtherPillarInformation;
  isLoaded = false;
  isSubmitted = false;
  policestations: any[] = [];
  firdata: any = [];
  
  form: FormGroup = new FormGroup({
    psCode: new FormControl(''),
    firNumber: new FormControl(''),
    year: new FormControl('')
  });

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    var data=this.form.getRawValue();

    this.icjsSearchService.SearchFir(data).subscribe(response => {
      this.isLoaded = true;
      if (response.isSuccess) {
        this.firdata = response.data;
        console.log(response.data);
      } else {
        this.utilityService.ShowErrorPopup(response.message);
      }
    },
    (error: HttpErrorResponse) => {
      console.error('API error:', error);
    });
    
  }


  openOtherPillarsTab(firRegNum:any)
  {
  this.icjsSearchService.LoadOtherPillars({firNumber: firRegNum}).subscribe(resp=>{
    if(resp.isSuccess){
      this.otherPillarData = resp.data;
      if(this.otherPillarData?.prosecutionids.length == 0){
        this.utilityService.ShowErrorPopup("Prosecution request is not submitted yet");
      }
      else{
        debugger;
        
        this.dyanmicModelService.open(ProsecutionComponent, this.otherPillarData?.prosecutionids[0]);
      }
    }
  });
}

  constructor(private utilityService: UtilityService, private formBuilder: FormBuilder, private icjsSearchService: IcjsSearchService, protected  modalService: ModalService,
    private ref: ChangeDetectorRef, private dyanmicModelService: DynamicModalService
  ) {
    this.loadPoliceStations();

  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        psCode: ['', Validators.required],
        firNumber: [
          '',[Validators.required, Validators.pattern(/^[0-9]{1,7}$/)]
        ],
        year: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
      }
    );
  }

  loadPoliceStations(){
    this.utilityService.PoliceStationList("0").subscribe((data: any[]) => {
      this.policestations = data;
    });
  }
  tabCounter = 1;
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;

  addOtherPillarTab(firNumber : string, firRegDate: string, firShortNumber: string, policeCode: string) {
    this.tabContainer.tabs = [];
    const TabTitle = `ICJS Pillars`;
    const TabData = {
      firNumber,
      firRegDate,
      firShortNumber,
      policeCode
    };
    const TabComponent = OtherPillarsComponent;
    this.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.tabCounter++;
  }
}
