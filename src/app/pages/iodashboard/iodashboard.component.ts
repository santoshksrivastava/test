import { Component, Renderer2, Inject, ElementRef, ViewChild, OnInit , ChangeDetectorRef} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IodashboardService } from '../services/iodashboard.service';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, format } from 'date-fns';
export interface DropdownOption {
  value: number;
  text: string;
}

interface PsCodeOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-iodashboard',
  templateUrl: './iodashboard.component.html',
  styleUrl: './iodashboard.component.css'
})
export class IOdashboardComponent implements OnInit{
 isLoaded = false;
  isSubmitted = false;
  showEsakshyaGrid = false;
  showNyaayShurutiGrid = false;
  isEsakshyaDataLoaded = false;
  isNyaayShurutiDataLoaded = false;
    isTotaldetails: boolean = false;
     Districts: any[] = [];
  @ViewChild('multiSelect') gridContainer!: ElementRef;
 
  EsakshyaRowData: any[] = [];
  nyaayShurutiRowData: any[] = [];
  CountListRowData:any;

  ListDistict:any[]=[];
  detailsListRowData:any;
  EsakshyaFilterData: any[] = [];
  nyaayShurutiFilterData: any[] = [];
  errorMessage: string = '';
  TotalPendingFIR = 0;
  TotalType:string='';
   HeinousType: string = '';
  OtherType: string = '';
    
  lablename0:any;
  Cnt0:any;
 lablename1:any;
  Cnt1:any;
  lablename2:any;
  Cnt2:any;
  lablename3:any;
  Cnt3:any;
  lablename4:any;
  Cnt4:any;
  lablename5:any;
  Cnt5:any;
   policestations: any[] = [];

   data: DropdownOption[] = [];
 selectedItems: DropdownOption[] = [];
  settings = {};
 dateValue: any;
   minDateValue: any;
  maxDateValue: any;
    minDateValue2: any;
 maxDateValue2: any;



  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private IodashboardService: IodashboardService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,private fb: FormBuilder
  ) {

 

  }
    ngOnInit(): void {
       this.loadDataForCount();
      this.DistrictsCount();
            this.settings = {
              singleSelection: false,
              idField: 'value',
              textField: 'text',
              enableCheckAll: true,
              allowSearchFilter: true,
              limitSelection: -1,
              clearSearchFilter: true,
              maxHeight: 197,
              itemsShowLimit: 3,
              searchPlaceholderText: 'Search',
              closeDropDownOnSelection: false,
              showSelectedItemsAtTop: false,
              defaultOpen: false,
            }; 
      this.form = this.formBuilder.group(
      {
         psCode: [''], 
        FromDate: [''],
        ToDate: [''],
        districtCodes:['']
      });
    this.renderer.removeAttribute(this.document.body, 'class');
    this.district();
  }

  onDistrictDropdownChange(event:any){
    var formValues = this.form.getRawValue();
    var districtCodes = formValues.districtCodes.map((item: { value: any; }) => parseInt(item.value));

    this.IodashboardService.getPoliceStation(districtCodes).subscribe((data: any) => {
      if(data.isSuccess){
        this.policestations = data.data;
      }
    });
  }

 

   onDistrictChange(value: any): void {
    const selectedDistrict = value
    if (selectedDistrict) {
       this.IodashboardService.getPoliceStation(selectedDistrict).subscribe((data: any[]) => {
      this.policestations = data;
    });
    }  
    else {
    this.form.controls["psCode"].setValue('');
     this.form.controls["FromDate"].setValue('');
      this.form.controls["ToDate"].setValue('');
      this.policestations = [];
    }
  }
        
 district(){
    this.utilityService.Districts().subscribe((data: any[]) => {
      this.Districts = data;
    });
  }
 form:FormGroup = new FormGroup({
   
  });
   onSubmit(): void {
   
  }
    onSearch(){
      debugger
      const fromDate = this.form.controls["FromDate"].value;
      const toDate = this.form.controls["ToDate"].value;
      const districtCodes: PsCodeOption[] = this.form.controls["districtCodes"].value;
      const DistrictCodes = districtCodes.map((item: PsCodeOption) => item.value);
      const psCodeArray: PsCodeOption[] = this.form.controls["psCode"].value;
      const psCodeValues = psCodeArray.map((item: PsCodeOption) => item.value);
      const searchValues = [DistrictCodes,psCodeValues, fromDate, toDate];
      this.BindList(searchValues);
   }
   BindList(searchValues: string[]){
    debugger
    const DistrictCodes = searchValues[0];
    const psCode = searchValues[1];
    const fromDate = searchValues[2];
    const toDate = searchValues[3];

      this.IodashboardService.getDataForCount1(DistrictCodes, psCode, fromDate, toDate).subscribe({
       next: (response) => {
        //  if (response.isSuccess && response.data && response.data.length > 0) {
        //    debugger
        //       //  this.CountListRowData =  JSON.parse(response.data);
        //  }
        //  else {
          
        //  }
       },
        });
  }
     onDateChange(selectedDate: Date): void {
       debugger
       this.maxDateValue2 = new Date(selectedDate);
      this.minDateValue2=new Date(this.maxDateValue2);
      const daysToAdd = this.CountListRowData.MaxDateRange;
      this.maxDateValue2.setDate(this.maxDateValue2.getDate() + daysToAdd);
    }
  DistrictsCount(): void {
    
    this.IodashboardService.getDistrictsCount().subscribe({
      next: (response) => {
           if (response.isSuccess && response.data && response.data.length > 0) {
          debugger;
           this.ListDistict =   response.data;
           var item = {
              text : "A",
              value:1
           };
           this.ListDistict.push(item)
          this.errorMessage = '';
        } 
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
           this.ListDistict = [];
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
         this.ListDistict = [];
      },
    });
  }


  loadDataForCount(): void {
    debugger
    this.IodashboardService.getDataForCount().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          debugger
          this.CountListRowData =  JSON.parse(response.data);
              this.TotalPendingFIR = this.CountListRowData.Total_Pending_FIR;  
              let HeinousNo = this.CountListRowData.Heinous_No; 
              let HeinousYes = this.CountListRowData.Heinous_Yes;
              this.TotalType=this.CountListRowData.TotalType; 
              this.HeinousType=this.CountListRowData.HeinousType; 
              this.OtherType=this.CountListRowData.OtherType; 


              

            this.renderer.setProperty(this.el.nativeElement.querySelector('#TotalCount'), 'textContent', this.TotalPendingFIR);
            this.renderer.setProperty(this.el.nativeElement.querySelector('#HeinousNo'), 'textContent', HeinousNo);
           this.renderer.setProperty(this.el.nativeElement.querySelector('#HeinousYes'), 'textContent', HeinousYes);
          this.errorMessage = '';
        } 
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.CountListRowData = "";
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.CountListRowData = "";
      },
    });
  }
  GetTotalCount(event: MouseEvent,Type:string) {
  debugger
    event.preventDefault(); 
    var a= this.TotalType;
    this.IodashboardService.getDataTotalDetails(Type).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data && response.data.length > 0) {
          debugger
           this.isTotaldetails = true;
           this.detailsListRowData =  JSON.parse(response.data);
            this.lablename0= this.detailsListRowData[0].Label
             this.Cnt0= this.detailsListRowData[0].Cnt           
             this.lablename1= this.detailsListRowData[1].Label
             this.Cnt1= this.detailsListRowData[1].Cnt
             this.lablename2= this.detailsListRowData[2].Label
             this.Cnt2= this.detailsListRowData[2].Cnt
             this.lablename3= this.detailsListRowData[3].Label
             this.Cnt3= this.detailsListRowData[3].Cnt
             this.lablename4= this.detailsListRowData[4].Label
             this.Cnt4= this.detailsListRowData[4].Cnt
             this.lablename5= this.detailsListRowData[5].Label
             this.Cnt5= this.detailsListRowData[5].Cnt

            
                const container = this.el.nativeElement.querySelector('#container');
                for (let i = 0; i < this.detailsListRowData.length; i++) {
                    const item = this.detailsListRowData[i];
                    const div = this.renderer.createElement('div');
                    this.renderer.addClass(div, 'col-sm-4');
                    const anchor = this.renderer.createElement('a');
                    this.renderer.setAttribute(anchor, 'href', 'javascript:void(0)');
                    this.renderer.addClass(anchor, 'card');
                    this.renderer.addClass(anchor, 'text-center');
                    this.renderer.addClass(anchor, 'p-4');
                    this.renderer.addClass(anchor, 'com-red-clr');
                    this.renderer.setAttribute(anchor, 'data-type', 'TotalCount');

                    const h4 = this.renderer.createElement('h4');
                    const h4Text = this.renderer.createText(item.Label);
                    this.renderer.appendChild(h4, h4Text);

                    const span = this.renderer.createElement('span');
                    const spanText = this.renderer.createText(item.Cnt);
                    this.renderer.appendChild(span, spanText);

                    this.renderer.appendChild(anchor, h4);
                    this.renderer.appendChild(anchor, span);
                    this.renderer.appendChild(div, anchor);
                    this.renderer.appendChild(container, div);
                  }
                  this.detailsListRowData ="";
                 this.errorMessage = '';
         
           
        } 
        else {
          this.errorMessage = 'No data available for Nyaay Shuruti.';
          this.detailsListRowData ="";
        }
      },
      error: (err) => {
        console.error('Error fetching Nyaay Shuruti data:', err);
        this.errorMessage = 'Failed to load data from the server. Please try again later.';
        this.detailsListRowData = "";
      },
    });
  }
}
