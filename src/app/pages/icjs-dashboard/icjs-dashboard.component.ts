import { Component ,OnInit,ChangeDetectorRef, ElementRef, Renderer2} from '@angular/core';
import { IcjsDeshboardService } from '../services/icjs-deshboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourtComponent } from '../_components/court/court.component';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-icjs-dashboard',
  templateUrl: './icjs-dashboard.component.html',
  styleUrl: './icjs-dashboard.component.css'
})
export class IcjsDashboardComponent implements OnInit {
  policestation: string =""; 
  lbltype: string = ''; 
  fromDate: string = '';
  toDate: string =""; 
  type: string = '';
  policestationcode: string='';
  pageNumber: number = 0; 
  pageSize: number = 0; 
  searchTerm: string='';
  isCourtCaseListTable: boolean = true;
  isCourtCaseDetailTable: boolean = false;
  policestations: any[] = [];
  Districts: any[] = [];
  isSubmitted = false;
  BackPage: boolean = false;
  loading: boolean = false;
  currentFirst: number = 1; // First record number on the current page
  currentLast: number = 10;
  FilteredRecordsCount:number = 0;
  DetailscourtCasesTotal: number = 0;
openCourtComponent(cino: string) {
    this.dynamicModelService.open(CourtComponent, cino);
  }

  courtCasesData:any;
  DetailscourtCasesData:any;

  constructor(private icjsDeshboardService: IcjsDeshboardService,private cdr: ChangeDetectorRef, private el: ElementRef,private renderer: Renderer2
  ,protected  modalService: ModalService,private utilityService: UtilityService, private formBuilder: FormBuilder, private dynamicModelService: DynamicModalService) {
     this.loadPoliceStations()
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        district: [''], 
        psCode: [''],
        FromDate: [''],
        ToDate: ['']
      }
    );

    this.district();
    this.loadCounts();
  }

loadCounts(){
     this.setValueCase(this.form.controls["psCode"].value,this.form.controls["FromDate"].value,this.form.controls["ToDate"].value);
  }
CourtCasesDetails(ongoing: string,pscode:any): any {
    const policestation = "";
    const fromDate = "";
    const toDate = "";  
    const type = ongoing; 
    const policestationcode = pscode.toString();
    const pageNumber = this.currentFirst;  
    const pageSize = this.currentLast;  
    const searchTerm = ""; 
    this.icjsDeshboardService.getCourtCasesDetails(policestation, fromDate, toDate, type, policestationcode,pageNumber,pageSize, searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
             this.FilteredRecordsCount =  response.data.filteredRecordsCount;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.cdr.detectChanges();
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
}


  setValueCase(psCode: string, fromDate: string, toDate: string):any {
    const pageNumber = this.currentFirst;  
    const pageSize = this.currentLast;  
    const searchTerm = "";
    const type = ""; 
    const policestationcode = "";
    this.icjsDeshboardService.getCourtCases(psCode, fromDate, toDate).subscribe(
      response => {
        if (response.isSuccess) {
          this.courtCasesData = response.data;
           var totalongoing = 0;
           var totalDisposed = 0;
           var totalToday = 0;
           var totalThisWeek = 0; 
            response.data.forEach((item: any) => {
                  totalongoing +=  item.ongoing;
                  totalDisposed +=  item.disposed;
                  totalToday +=  item.today;
                  totalThisWeek +=  item.next7days;
            });
        
          this.renderer.setProperty(this.el.nativeElement.querySelector('#totalOnGoing'), 'textContent', totalongoing);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedToday'), 'textContent', totalToday);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#listedThisWeek'), 'textContent', totalThisWeek);
          this.renderer.setProperty(this.el.nativeElement.querySelector('#totalDisposed'), 'textContent', totalDisposed);
         
        }
         else {
          console.log('API false response1:', response);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);
      }
    );
  }

  onGridReady(params:any) {
   
  }

  onQuickFilter(event: any) {
    
  }
   lnkbackClick() {
     this.isCourtCaseListTable = true;
     this.isCourtCaseDetailTable = false;
     this.BackPage = false;
    this.cdr.detectChanges();
  }
  loadPoliceStations(){
    this.utilityService.PoliceStationList().subscribe((data: any[]) => {
      this.policestations = data;
    });
  }
   district(){
    this.utilityService.Districts().subscribe((data: any[]) => {
      this.Districts = data;
    });
  }
   onDistrictChange(event: any): void {
    const selectedDistrict = event.target.value;
    if (selectedDistrict) {
       this.utilityService.PoliceStationList(selectedDistrict).subscribe((data: any[]) => {
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
   get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
    form:FormGroup = new FormGroup({
   
  });
  
   onSubmit(): void {
     this.isCourtCaseListTable = true;
     this.isCourtCaseDetailTable = false;
     this.BackPage = false;
   // if (this.form.invalid) {
     // return;
    //}
     this.isSubmitted = true;
       this.loadCounts();
    //

  }

totalDetails(event: MouseEvent, type: string) {
    event.preventDefault();  
     
    switch (type) {
      case 'ongoing':
        if (this.form.controls["psCode"].value === '') {
            this.CourtCasesDetails("ongoing","")
        }
        else {
          this.CourtCasesDetails("ongoing", this.form.controls["psCode"].value);
          }
        break;
      case 'today':
        if (this.form.controls["psCode"].value === '') {
                    this.CourtCasesDetails("today","")
        }
        else {
          this.CourtCasesDetails("today", this.form.controls["psCode"].value);
          }
        break;
      case 'nextsevendays':
      if (this.form.controls["psCode"].value === '') {
                 this.CourtCasesDetails("nextsevendays","")
        }
        else {
          this.CourtCasesDetails("nextsevendays", this.form.controls["psCode"].value);
          }
         
        break;
      case 'disposed':
      if (this.form.controls["psCode"].value === '') {
                  this.CourtCasesDetails("disposed","")
        }
        else {
          this.CourtCasesDetails("disposed", this.form.controls["psCode"].value);
          }
        break;
      default:
        console.log('Unknown type clicked!');
        break;
    }
  }

    loadCourtCasesReports(event: TableLazyLoadEvent) {
    this.loading = true;
    const pageSize = event.rows ?? 10;  
    const first = event.first ?? 0;    
    const pageNumber = Math.floor(first / pageSize) + 1; 
    const psCOde = this.form.controls["psCode"].value;
    const FromDate = this.form.controls["FromDate"].value;
    const  ToDate   = this.form.controls["ToDate"].value;
    this.currentFirst = first + 1;
    this.currentLast = first + pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : first + pageSize;
     this.icjsDeshboardService.getCourtCasesDetails(psCOde, FromDate, ToDate, this.type, psCOde,pageNumber,pageSize, this.searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.cdr.detectChanges();
             this.FilteredRecordsCount =  response.data.total;
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
  }

 onQuickFilterCaseDetails(event: any) {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue.length >= 3) {
    this.searchTerm = filterValue;
    const policestation = "";
    const fromDate = "";
    const toDate = "";  
    const type = "ongoing"; 
    const policestationcode = '';
    const pageNumber = 1;  
    const pageSize = 10;  
    const searchTerm = ""; 
    this.icjsDeshboardService.getCourtCasesDetails(policestation, fromDate, toDate, type, policestationcode,pageNumber,pageSize, this.searchTerm)
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
             this.FilteredRecordsCount =  response.data.filteredRecordsCount;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.cdr.detectChanges();
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    } else if(filterValue == '') {
      this.searchTerm = '';
      const policestation = "";
    const fromDate = "";
    const toDate = "";  
    const type = "ongoing"; 
    const policestationcode ='';
    const pageNumber =1;  
    const pageSize = 10;  
    const searchTerm = ""; 
    this.icjsDeshboardService.getCourtCasesDetails(policestation, fromDate, toDate, type, policestationcode,pageNumber,pageSize, this.searchTerm )
      .subscribe(
        response => {
          if (response.isSuccess) {
            this.DetailscourtCasesData = response.data.records;
            this.DetailscourtCasesTotal = response.data.totalRecords;
            this.FilteredRecordsCount =  response.data.filteredRecordsCount;
            this.isCourtCaseListTable = false;
            this.isCourtCaseDetailTable = true;
             this.BackPage = true;
             this.lbltype = response.data.records[0].PoliceStnName;
             this.cdr.detectChanges();
          }
           else 
           {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    }
  }




}
  
  

 