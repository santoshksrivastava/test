import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IcjsDashboardComponent } from './pages/icjs-dashboard/icjs-dashboard.component';
import { IcjsSearchComponent } from './pages/icjssearch/icjs-search.component';
import { PageNotFoundComponent } from './pages/theme/page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './pages/theme/access-denied/access-denied.component';
import { FslReportComponent } from './pages/fsl-report/fsl-report.component';
import { authGuard } from './pages/auth/auth.guard';
import { ChitrakhoziComponent } from './pages/chitrakhozi/chitrakhozi.component';
import { SearchcaseComponent } from './pages/searchcase/searchcase.component';
import { MedleparComponent } from './pages/medlepar/medlepar.component';
import { ProsecutionSearchComponent } from './pages/prosecution-search/prosecution-search.component';
import { IOdashboardComponent } from './pages/iodashboard/iodashboard.component';
import { TotalFirComponent } from './pages/total-fir/total-fir.component';
import { PillardashboardReportComponent } from './pages/pillardashboard-report/pillardashboard-report.component';
import { RoleAssignComponent } from './pages/role-assign/role-assign.component';
import { CctnsChitrakhoziComponent } from './pages/cctns-chitrakhozi/cctns-chitrakhozi.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route for HomeComponent
  { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard] }, 
  { path: 'court-case-search', component: IcjsDashboardComponent, canActivate: [authGuard] }, 
  { path: 'icjs-search', component: IcjsSearchComponent , canActivate: [authGuard] }, 
  { path: 'fsl-reports', component: FslReportComponent , canActivate: [authGuard]}, 
  { path: 'chitrakhozi', component:ChitrakhoziComponent , canActivate: [authGuard]},
  { path: 'Medleapr', component:MedleparComponent , canActivate: [authGuard]},
  { path: 'prosecution', component:ProsecutionSearchComponent , canActivate: [authGuard]},
  { path: 'total-fir', component:TotalFirComponent},
  { path: 'io-dashboard', component:IOdashboardComponent},
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'pillardashboard-report', component:PillardashboardReportComponent},
  {path : 'searchcase' , component:SearchcaseComponent},
  {path : 'role-assign' , component:RoleAssignComponent},
  {path : 'cctns-chitrakhozi' , component:CctnsChitrakhoziComponent},
  { path: '**', component: PageNotFoundComponent },
 
  // Default route for HomeComponent
  // Add other routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
