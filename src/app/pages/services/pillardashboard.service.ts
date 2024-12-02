import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PillardashboardService {
   private ApipillardashboarUrl = `${environment.apiUrl}/CourtCases/GetpillardashboardData`;
  constructor(private http: HttpClient) { }
    GetPillarData(): Observable<any> {
    const body = {
      startDate: "",
      endDate:""
    };
    return this.http.post<any>(this.ApipillardashboarUrl, body);
  }
}

