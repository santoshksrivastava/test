import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { OtherPillarInformation } from '../../models/otherpillarinformation.model';
import { IcjsSearchService } from '../../services/icjs-search.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '../../services/modal.service';
import { TabContainerComponent } from '../tabs/tab-container.component';
import { CourtComponent } from '../court/court.component';
import { IcjsSearchComponent } from '../../icjssearch/icjs-search.component';
import { ForensicComponent } from '../forensic/forensic.component';
import { ProsecutionComponent } from '../prosecution/prosecution.component';
import { PrisonComponent } from '../prison/prison.component';
import { MiniStatementComponent } from '../mini-statement/mini-statement.component';
import { MedleprComponent } from '../medlepr/medlepr.component';

@Component({
  selector: 'app-other-pillars',
  templateUrl: './other-pillars.component.html',
  styleUrl: './other-pillars.component.css'
})
export class OtherPillarsComponent {
  tabCounter = 1;
  componentName = '_OtherPillarsComponent';
  @ViewChild(TabContainerComponent) tabContainer!: TabContainerComponent;
  @Input() data: string = '';
  otherPillarData? : OtherPillarInformation;
  constructor(private icjsSearchService: IcjsSearchService, 
    private ref: ChangeDetectorRef,
    protected  modalService: ModalService,
    private icjsSearchComponent: IcjsSearchComponent
  ) {
  }

  loadPillarData(data: any) {
    this.otherPillarData = data;
    this.ref.detectChanges();
    this.modalService.open("modal-othterpillerdata");
  }

  loadCaseInformation(cnrNumber : string){
    const TabTitle = cnrNumber;
    const TabData = cnrNumber;
    const TabComponent = CourtComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }

  loadFslInformation(fslid: string){
    const TabTitle = fslid;
    const TabData = fslid;
    const TabComponent = ForensicComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }

  loadProsecutionInformation(eProcId: string){
    const TabTitle = eProcId;
    const TabData = eProcId;
    const TabComponent = ProsecutionComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }

  loadPrisonerInfo(prionserId: string, stateCode: string){
    const TabTitle = prionserId;
    const TabData = {stateCode,prionserId};
    const TabComponent = PrisonComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }

  loadMiniStatement(firNumber: string){
    const TabTitle = firNumber;
    const TabData = firNumber;
    const TabComponent = MiniStatementComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }

  loadMedleprInfo(transactionNumber: string){
    const TabTitle = transactionNumber;
    const TabData = transactionNumber;
    const TabComponent = MedleprComponent;
    this.icjsSearchComponent.tabContainer.addTab(TabTitle, TabComponent, TabData);
    this.icjsSearchComponent.tabCounter++;
  }
 
}
