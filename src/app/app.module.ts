
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FooterComponent } from './pages/theme/footer/footer.component';
import { CommonModule, DatePipe } from '@angular/common';
import { IcjsDashboardComponent } from './pages/icjs-dashboard/icjs-dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from  '@angular/forms';
import { IcjsSearchComponent } from './pages/icjssearch/icjs-search.component'; // <-- Import FormsModule
import { jwtInterceptor } from './pages/_helpers/jwt.interceptor';
import { ModalComponent } from './pages/_components/modal/modal.component';
import { CourtComponent } from './pages/_components/court/court.component';
import { DynamicTabDirective } from './pages/_components/tabs/dynamic-tab.directive';
import { TabContainerComponent } from './pages/_components/tabs/tab-container.component';
import { OtherPillarsComponent } from './pages/_components/otherpillars/other-pillars.component';
import { ForensicComponent } from './pages/_components/forensic/forensic.component';
import { ProsecutionComponent } from './pages/_components/prosecution/prosecution.component';
import { LoaderComponent } from './pages/_components/loader/loader.component';
import { FslReportComponent } from './pages/fsl-report/fsl-report.component';
import { PageNotFoundComponent } from './pages/theme/page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './pages/theme/access-denied/access-denied.component';
import { PrisonComponent } from './pages/_components/prison/prison.component';
import { DynamicModalComponent } from './pages/_components/dynamic-modal/dynamic-modal.component';
import { ExampleOneComponent } from './pages/services/example-one/example-one.component';
import { ExampleTwoComponent } from './pages/services/example-two/example-two.component'; // <-- Import FormsModule
import { SearchcaseComponent } from './pages/searchcase/searchcase.component';
import { ChitrakhoziComponent } from './pages/chitrakhozi/chitrakhozi.component';
import { MiniStatementComponent } from './pages/_components/mini-statement/mini-statement.component';
import { MedleprComponent } from './pages/_components/medlepr/medlepr.component';
import { MedleparComponent } from './pages/medlepar/medlepar.component';
import { ProsecutionSearchComponent } from './pages/prosecution-search/prosecution-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { LayoutComponent } from './pages/theme/layout/layout.component';
import { IOdashboardComponent } from './pages/iodashboard/iodashboard.component';
import { TotalFirComponent } from './pages/total-fir/total-fir.component';
import { PillardashboardReportComponent } from './pages/pillardashboard-report/pillardashboard-report.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {CalendarModule} from 'primeng/calendar';
import { RoleAssignComponent } from './pages/role-assign/role-assign.component';
import { CctnsChitrakhoziComponent } from './pages/cctns-chitrakhozi/cctns-chitrakhozi.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    FooterComponent,
    IcjsDashboardComponent,
    IcjsSearchComponent,
    ModalComponent,
    TabContainerComponent,
    CourtComponent,
    DynamicTabDirective,
    OtherPillarsComponent,
    ForensicComponent,
    ProsecutionComponent,
    LoaderComponent,
    FslReportComponent,
    PageNotFoundComponent,
    AccessDeniedComponent,
    PrisonComponent,
    DynamicModalComponent,
    ExampleOneComponent,
    ExampleTwoComponent,
    ChitrakhoziComponent,
    SearchcaseComponent,
    MiniStatementComponent,
    MedleprComponent,
    MedleparComponent,
    ProsecutionSearchComponent,
    LayoutComponent,
    IOdashboardComponent,
    TotalFirComponent,
    PillardashboardReportComponent,
    RoleAssignComponent,
    CctnsChitrakhoziComponent,
  ],
  imports: [
     NgMultiSelectDropDownModule.forRoot(),
     CalendarModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    ButtonModule, 
    TableModule,
    
    PaginatorModule,
    DropdownModule ,
     
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [LayoutComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptor, multi: true },
    provideClientHydration(),
    DatePipe
    
  ],
  bootstrap: [AppComponent],
  // register the dynamic components here
  //entryComponents: [TabComponent]
})
export class AppModule { 


  
}
