import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IcjsDeshboardService {
 private apiCaseUrl = `${environment.apiUrl}/CourtCases`;
 private apiCourtCasesDetailsUrl = `${environment.apiUrl}/CourtCases/CourtCesesDetails`;
 
  constructor(private http: HttpClient) { }

   getCourtCases(policestation: string, fromDate: string, toDate: string): Observable<any> {
    const body = {
      policeStationCode: policestation,
      startDate: fromDate,
      endDate:toDate
    };

    // Make the GET request
    return this.http.post<any>(this.apiCaseUrl, body);
  }

   getCourtCasesDetails(policestation: string, fromDate: string, toDate: string, type: string, policestationcode: string, pageNumber: number, pageSize: number, searchTerm: string): Observable<any> {
    const body = {
      policestation: policestation,
      FromDate: fromDate,
      ToDate: toDate,
      type:type,
      policestationcode:policestationcode,
     pageNumber: pageNumber, 
     pageSize: pageSize,
    searchTerm: searchTerm
    };

    // Make the GET request
    return this.http.post<any>(this.apiCourtCasesDetailsUrl, body);
  }

}