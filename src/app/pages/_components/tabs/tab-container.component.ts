import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild } from '@angular/core';
import { DynamicTabDirective } from './dynamic-tab.directive';
import { CourtComponent } from '../court/court.component';
import { OtherPillarInformation } from '../../models/otherpillarinformation.model';
import { IcjsSearchService } from '../../services/icjs-search.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilityService } from '../../services/utility.service';

interface Tab {
  title: string;
  component: Type<any>;
  data: any;
}

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrl: './tab-container.component.css'
})

export class TabContainerComponent {
  @ViewChild(DynamicTabDirective, { static: true }) dynamicTab!: DynamicTabDirective;
  selectedTabIndex = 0;
  otherPillarData? : OtherPillarInformation;
  courtCaseInfos: any[] = [];
  fslInfos: any[] = [];
  prosecutionInfos: any[] = [];
  prisonerInfos: any[] = [];
  miniStatements: any[] = [];
  medlePrs: any[] = [];
  refreshTabs? : boolean = true;
  tabs: Tab[] = [
  ];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,  private ref: ChangeDetectorRef, private icjsSearchService: IcjsSearchService, private utilityService: UtilityService) {}

  ngOnInit() {
    this.loadComponent(0);
  }

  selectTab(index: number) {
      this.selectedTabIndex = index;
      this.loadComponent(index);
  }

  loadComponent(index: number) {
    const tab = this.tabs[index];
    if (tab.component.name == "_OtherPillarsComponent"){
      if(this.otherPillarData === undefined || this.otherPillarData.firregnum != tab.data.firNumber){
        this.loadOtherPillarData(tab.data).subscribe(response => {
          if (response.isSuccess) {
            this.otherPillarData = response.data;
            this.loadDynamicComponent(index, this.otherPillarData);
          } else {
            this.otherPillarData = undefined;
            this.loadDynamicComponent(index, this.otherPillarData);
            Swal.fire({
              position: 'top-end', // Or 'center-end' for center-right position
              title: response.message,
              showConfirmButton: false,
              timer: 2000,
              customClass: {
                popup: 'custom-failure-alert',
                title: 'custom-title',
              },
              background: '#ff0000', // Red background
            });
            console.log('API false response:', response);
          }
          
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
          this.otherPillarData = undefined;
          this.loadDynamicComponent(index, this.otherPillarData);
        });
      }
      else{
        this.loadDynamicComponent(index, this.otherPillarData);
      }
    }
    else if(tab.component.name == "_CourtComponent"){
      const cnrInfo = this.courtCaseInfos.find(item => item.cino === tab.title);
      if(cnrInfo){
        this.loadDynamicComponent(index, cnrInfo);
      }
      else{
        this.loadCaseInformation(tab.data).subscribe(response=>{
          if(response.isSuccess){
            const data = JSON.parse(response.data);
            this.courtCaseInfos.push(data);
            this.loadDynamicComponent(index, data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
    else if(tab.component.name == "_ForensicComponent"){
      const fslInfo = this.fslInfos.find(item => item.fslid === tab.title);
      if(fslInfo){
        this.loadDynamicComponent(index, fslInfo);
      }
      else{
        this.loadFslInformation(tab.data).subscribe(response=>{
          if(response.isSuccess){
            const data = JSON.parse(response.data);
            this.fslInfos.push(data);
            this.loadDynamicComponent(index, data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
    else if(tab.component.name == "_ProsecutionComponent"){
      const prosecutionInfo = this.prosecutionInfos.find(item => item.eprocid === tab.title);
      if(prosecutionInfo){
        this.loadDynamicComponent(index, prosecutionInfo);
      }
      else{
        this.loadProsecutionInformation(tab.data).subscribe(response=>{
          if(response.isSuccess){
            const data = JSON.parse(response.data);
            this.prosecutionInfos.push(data.data);
            this.loadDynamicComponent(index, data.data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
    else if(tab.component.name == "_PrisonComponent"){
      const prsionerInfo = this.prisonerInfos.find(item => item.prisonerId === tab.title);
      if(prsionerInfo){
        this.loadDynamicComponent(index, prsionerInfo);
      }
      else{
        this.loadPrisonInformation(tab.data).subscribe(response=>{
          if(response.isSuccess){
            const data = JSON.parse(response.data);
            this.prisonerInfos.push(data);
            this.loadDynamicComponent(index, data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
    else if(tab.component.name == "_MiniStatementComponent"){
      const miniStatement = this.miniStatements.find(item => item === tab.title);
      if(miniStatement){
        this.loadDynamicComponent(index, miniStatement);
      }
      else{
        this.loadMiniStatement(tab.data).subscribe(response=>{
          if(response.isSuccess){
            const data = JSON.parse(response.data);
            this.miniStatements.push(data);
            this.loadDynamicComponent(index, data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
    else if(tab.component.name == "_MedleprComponent"){
      const medleprInfo = this.medlePrs.find(item => item === tab.title);
      if(medleprInfo){
        this.loadDynamicComponent(index, medleprInfo);
      }
      else{
        this.loadMedleprInformation(tab.data).subscribe(response=>{
          if(response.isSuccess){
            debugger;
            const data = JSON.parse(response.data);
            this.medlePrs.push(tab.data);
            this.loadDynamicComponent(index, data);
          }
          else{
            this.utilityService.ShowErrorPopup(response.message);
          }
        });
      }
    }
  }

  loadDynamicComponent(index: number, componentData : any){
    const tab = this.tabs[index];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.component);
    const viewContainerRef = this.dynamicTab.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.title = tab.title;
    if(tab.component.name == "_OtherPillarsComponent"){
      componentRef.instance.loadPillarData(componentData);
    }
    else if(tab.component.name == "_CourtComponent"){
      componentRef.instance.loadCaseinformation(componentData);
    }

    else if(tab.component.name == "_ForensicComponent"){
      componentRef.instance.loadFslInfo(componentData);
    }
    else if(tab.component.name == "_ProsecutionComponent"){
      componentRef.instance.loadProsecutionInfo(componentData);
    }
    else if(tab.component.name == "_PrisonComponent"){
      componentRef.instance.loadPrisonInfo(componentData);
    }
    else if(tab.component.name == "_MiniStatementComponent"){
      componentRef.instance.loadHtml(componentData);
    }
    else if(tab.component.name == "_MedleprComponent"){
      componentRef.instance.loadMedleprInfo(componentData);
    }
  }

  loadOtherPillarData(data: any)  {
    return this.icjsSearchService.LoadOtherPillars(data);
  }

  loadCaseInformation(cnrNumber: string){
    return this.utilityService.LoadCourtCaseInformation({cnrNumber: cnrNumber});
  }

  loadFslInformation(fslId: string){
    return this.utilityService.LoadFslInformation({fslId: fslId});
  }

  loadPrisonInformation(data:any){
    return this.utilityService.LoadPrisonerInformation(data);
  }

  loadMiniStatement(data:any){
    return this.utilityService.LoadMiniStatement({firNumber: data});
  }

  loadProsecutionInformation(eProcId: string){
    return this.utilityService.LoadProsecutionInformation({eProcId: eProcId});
  }
  loadMedleprInformation(transactionNumber: string){
    return this.utilityService.LoadMedleprInformation({transactionNumber: transactionNumber});
  }


  closeTab(index: number, event: MouseEvent) {
    event.stopPropagation();

    this.tabs.splice(index, 1);

    if (this.selectedTabIndex === index && this.tabs.length > 0) {
      this.selectedTabIndex = index === 0 ? 0 : index - 1;
    } else if (this.tabs.length === 0) {
      this.selectedTabIndex = -1;
    }

    if (this.tabs.length > 0) {
      this.loadComponent(this.selectedTabIndex);
    } else {
      this.dynamicTab.viewContainerRef.clear();
    }
  }

  addTab(title: string, component: Type<any>, data: any) {
    const foundElement = this.tabs.find(item => item.title === title);
    if(foundElement){
      const foundIndex = this.tabs.findIndex(item => item.title === title);
      this.selectTab(foundIndex);
    }
    else{
      
      const newTab = { title, component, data };
      this.tabs.push(newTab);
      this.selectTab(this.tabs.length - 1);
    }
    this.ref.detectChanges();
  }

}
