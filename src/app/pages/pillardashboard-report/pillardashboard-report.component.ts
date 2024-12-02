import { Component,OnInit,ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PillardashboardService } from '../services/pillardashboard.service';
import { ModalService } from '../services/modal.service';
import { UtilityService } from '../services/utility.service';
import { DynamicModalService } from '../services/dynamic-modal.service';
import { TotalFirService } from '../services/total-fir.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-pillardashboard-report',
  templateUrl: './pillardashboard-report.component.html',
  styleUrl: './pillardashboard-report.component.css'
})
export class PillardashboardReportComponent {
  PillarData:any;
  
  totalProsecutionCount: number = 0;
  totalFSLCount: number = 0;
  totalMLCCount: number = 0;
  totalPMRCount: number = 0;
   ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        psCode: [''],
        FromDate: [''],
        ToDate: ['']
      }
    );
   this.GetPillarDataList();
  
  }
   constructor(private PillardashboardService: PillardashboardService,private cdr: ChangeDetectorRef, private el: ElementRef,private renderer: Renderer2
  ,protected  modalService: ModalService,private utilityService: UtilityService, private formBuilder: FormBuilder, private dynamicModelService: DynamicModalService)
   {
    
  }


    GetPillarDataList():any {
      debugger
    this.PillardashboardService. GetPillarData().subscribe(
      response => {
        if (response.isSuccess) {
          debugger
          this.PillarData =   JSON.parse(response.data); 
           
        }
         
      },
      (error: HttpErrorResponse) => {
        console.error('API error:', error);
      }
    );
  }
 getTotal(column: string): number {
  return this.PillarData.reduce((sum: number, item: any) => sum + (item[column] || 0), 0) || 0;
}
  form:FormGroup = new FormGroup({
    FromDate: new FormControl(''),
    ToDate: new FormControl('')
  });
    onSubmit(): void {
     
       
       
  }
}
