import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IodashboardService {
 private esakshyaApiUrl = 'http://10.194.163.69/NyaaySetuWrapperApi/api/Napix/GetEsakshyaSeizures';
  private nyaayShurutiApiUrl = 'http://10.194.163.69/NyaaySetuWrapperApi/api/Napix/NyaayShurutiVcList';
  //  private DashBoardCountApiUrl = 'http://10.194.163.69/NyaaySetuWrapperApi/api/AssignIO/Assigned_FIR';
   private DashBoardCountApiUrl = 'http://10.144.2.82:12124/api/FIR/TotalFirCounts';
 private DetailsApiUrl: string = 'http://10.194.163.69/NyaaySetuWrapperApi/api/AssignIO/Time_Pendancy?type=';
 private GetDistrictsApiUrl: string = 'http://10.144.2.82:12124/api/Public/GetDistricts';
//  private GetPoliceStationApiUrl: string = 'http://10.144.2.82:12124/api/Public/GetPoliceStationList';

  // private GetPoliceStationApiUrl: string = `${environment.apiUrl}/Public/GetPoliceStationList`;
  private GetPoliceStationApiUrl: string = `http://10.144.2.82:12124/api/Public/GetPoliceStationList`;
 
   constructor(private http: HttpClient) { }
    getDataForCount(): Observable<any> {
    return this.http.post<any>(this.DashBoardCountApiUrl,{});
  }
    getDataTotalDetails(Total: string): Observable<any> {
      // let params: HttpParams;
      // if (Total === "Total") {
      //   params = new HttpParams().set('Total', Total); 
      // } 
      // else if (Total === "Heinous")
      // {
      //    params = new HttpParams().set('Heinous', Total); 
      // }
      // else {
      //  params = new HttpParams().set('Others', Total); 
      // }
    return this.http.get<any>(this.DetailsApiUrl + Total);
  }
    getDistrictsCount(): Observable<any> {
    return this.http.get<any>(this.GetDistrictsApiUrl,{});
  }

  // getPoliceStation(distcode?: string): Observable<any[]> {
  //   debugger;
  //   if (distcode) {
  //     return this.http.get<any[]>(`${this.GetPoliceStationApiUrl}/?distcode=${distcode}`);
  //   } 
  //   else {
  //     return this.http.get<any[]>(`${this.GetPoliceStationApiUrl}`);
  //   }
  // }
 getPoliceStation(distcodes: number[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.GetPoliceStationApiUrl}`, distcodes);
  }
   getDataForCount1(distcodes: string,psCode: string,FromDate: string, ToDate: string): Observable<any[]> {
     debugger
     const params = {
        distcodes: distcodes,
        psCode: psCode,
        FromDate: FromDate,
        ToDate: ToDate
    };
    return this.http.post<any[]>(`${this.GetPoliceStationApiUrl}`, { params });
  }
}
