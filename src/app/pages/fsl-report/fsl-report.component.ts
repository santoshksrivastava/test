import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { FslReportServiceService } from '../services/fsl-report-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventService } from '../services/global-event.service';
import { Subscription } from 'rxjs';
import { ForensicComponent } from '../_components/forensic/forensic.component';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-fsl-report',
  templateUrl: './fsl-report.component.html',
  styleUrls: ['./fsl-report.component.css']
})
export class FslReportComponent implements  OnInit {
  columns = [
    { field: 'RowNum', header: 'S.No' },
    { field: 'stateDesc', header: 'State' },
    { field: 'distDesc', header: 'District' },
    { field: 'enteredon', header: 'Entered On' },
    { field: 'firno', header: 'FIR No.' },
    { field: 'PsDesc', header: 'Police Station' },
    { field: 'fulldispno', header: 'Full Dispatch No.' },
    { field: 'exmreportdate', header: 'Exam Report Date' }
  ];
  
  loading: boolean = false;
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;
  private clickFSlSubscription!: Subscription;
  @ViewChild('content') content!: TemplateRef<any>;
  Total: number = 0;
  ReportsGenerated: number = 0;
  ReportsNotGenerated: number = 0;
  fromDate: string = '';
  toDate: string = '';
  pageSize: number = 10;
  selectedFullDispNo: string = '';
  FSLData: any[] = [];
  showResults: boolean = false;

  // Properties for paginator
  currentFirst: number = 1; // First record number on the current page
  currentLast: number = 10; // Last record number on the current page
  searchValue : string = '';
  FilteredRecordsCount:number = 0;

  constructor(
    private fslReportService: FslReportServiceService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private globalEventService: GlobalEventService, private componentFactoryResolver: ComponentFactoryResolver, private utilityService: UtilityService,
    private dyanmicModelService: DynamicModalService
  ) {}

  ngOnInit(): void {
    this.Total = 0;
    this.ReportsGenerated = 0;
    this.ReportsNotGenerated = 0;
    this.searchValue = '';
  }

  onSearch() {
    this.searchValue = ''; 

    if (!this.fromDate || !this.toDate) {
      return;
    }
    const requestPayload = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      pageNumber: 1,
      pageSize: this.pageSize,
      searchTerm: this.searchValue
    };

    this.fslReportService.getFslReports(requestPayload).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.FSLData = response.data.records;
          this.Total = response.data.totalRecords;
          this.ReportsGenerated = response.data.totalReportGenerated;
          this.ReportsNotGenerated = response.data.totalReportNotGenerated;
          this.FilteredRecordsCount =  response.data.filteredRecordsCount;
          this.updatePageInfo(); // Update page info after search
          this.showResults = true; // Show results on successful search
          this.cdr.detectChanges();
        }
      }
    );
  }

  onReset() {
    this.fromDate = '';
    this.toDate = '';
    this.FSLData = [];
    this.showResults = false; // Hide results when reset
    this.cdr.detectChanges();
  }

  loadFslReports(event: TableLazyLoadEvent) {
    this.loading = true;

    const pageSize = event.rows ?? 10;  
    const first = event.first ?? 0;    
    const pageNumber = Math.floor(first / pageSize) + 1; 

    const requestPayload = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchTerm: this.searchValue
    };

    // Update the paginator info
    this.currentFirst = first + 1;
    this.currentLast = first + pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : first + pageSize;

    this.fslReportService.getFslReports(requestPayload).subscribe(
      (response: any) => {

        if (response.isSuccess) {
          this.FSLData = response.data.records;
          this.Total = response.data.totalRecords;
          this.ReportsGenerated = response.data.totalReportGenerated;
          this.ReportsNotGenerated = response.data.totalReportNotGenerated;
          this.FilteredRecordsCount =  response.data.filteredRecordsCount;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      () => (this.loading = false)
    );
  }

  updatePageInfo() {
    this.currentFirst = 1;
    this.currentLast = this.pageSize > this.FilteredRecordsCount ? this.FilteredRecordsCount : this.pageSize;
  }

  open(content: any, fulldispno: string): void {
    this.selectedFullDispNo = fulldispno;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openModalWithDispNo(content: any, fulldispno: string): void {
   // this.selectedFullDispNo = fulldispno;
   // this.open(content, this.selectedFullDispNo);
   this.dyanmicModelService.open(ForensicComponent,fulldispno);
  }

  onQuickFilter(event: any) {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue.length >= 3) {
      this.searchValue = filterValue;
      this.loadFslReports({ first: 0, rows: this.pageSize });
    } else if(filterValue == '') {
      this.searchValue = '';
      this.loadFslReports({ first: 0, rows: this.pageSize });
    }
  }

  private componentRef!: ComponentRef<ForensicComponent>;
  loadOtherComponent(fslId: any): void {
    this.utilityService.LoadFslInformation({fslId: fslId}).subscribe((response)=>{
      if(response.isSuccess){
        const data = JSON.parse(response.data);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ForensicComponent);
        this.dynamicContainer.remove();
        this.dynamicContainer.clear();
        this.componentRef = this.dynamicContainer.createComponent(componentFactory);
        // Pass the parameter to the dynamically loaded component
        this.componentRef.instance.loadFslInfo(data);
        this.modalService.open("content", { ariaLabelledBy: 'modal-basic-title' });
      }
      else{
        this.utilityService.ShowErrorPopup(response.message);
      }
    });
  }
}










