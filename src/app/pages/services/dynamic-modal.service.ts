import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, Type } from '@angular/core';
import { UtilityService } from './utility.service';
import { Subject } from 'rxjs';
import { DynamicModalComponent } from '../_components/dynamic-modal/dynamic-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicModalService {

  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private utilityService: UtilityService
  ) {}
  private modalComponentRef: ComponentRef<any> | null = null;


  loadCaseInformation(cnrNumber: string){
    return this.utilityService.LoadCourtCaseInformation({cnrNumber: cnrNumber});
  }

  loadMedleparInformation(transactionNumber: string){
    return this.utilityService.LoadMedleprInformation({transactionNumber: transactionNumber});
  }

  loadFslInformation(fslId: string){
    return this.utilityService.LoadFslInformation({fslId: fslId});
  }

  loadProsecutionInformation(eProcId: string){
    return this.utilityService.LoadProsecutionInformation({eProcId: eProcId});
  }

  open(componentType: Type<any>, componentData?: any) {
    debugger;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicModalComponent);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    componentRef.instance.componentType = componentType;
    componentRef.instance.componentData = componentData;

    componentRef.instance.loadDynamicComponent(componentData);
    
    componentRef.instance.close = () => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    };
  }

  close() {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null; // Reset after closing
    }
  }
}
