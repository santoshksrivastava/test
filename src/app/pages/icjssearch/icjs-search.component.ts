import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IcjsSearchService } from '../services/icjs-search.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ModalService } from '../services/modal.service';
import { OtherPillarInformation } from '../models/otherpillarinformation.model';
import { CourtComponent } from '../_components/court/court.component';
import { TabContainerComponent } from '../_components/tabs/tab-container.component';
import { OtherPillarsComponent } from '../_components/otherpillars/other-pillars.component';

@Component({
  selector: 'app-icjs-search',
  templateUrl: './icjs-search.component.html',
  styleUrl: './icjs-search.component.css'
})
export class IcjsSearchComponent    {
  isLoaded = false;
  isSubmitted = false;
  policestations: any[] = [];
  firdata: any = [];

  loadPillarData(firNumber: string, firRegDate: string, firShortNumber: string, policeCode: string) {
    this.addOtherPillarTab(firNumber, firRegDate, firShortNumber, policeCode);
    
  }
  columns: any[] = [
    { field: 'firRegNum', header: 'Fir Number' },
    { field: 'firRegDate', header: 'FIR Registration Date & Time' },
    { field: 'firStatus', header: 'Status' }
  ];

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

  constructor(private utilityService: UtilityService, private formBuilder: FormBuilder, private icjsSearchService: IcjsSearchService, protected  modalService: ModalService,
    private ref: ChangeDetectorRef
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
