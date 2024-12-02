import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apStatesUrl = `${environment.apiUrl}/Public/GetStates`;

  private apiVerifyNumberUrl = `${environment.apiUrl}/Login/VerifyMobile`;

  private apiVerifyOtpUrl = `${environment.apiUrl}/Login/VerifyOtp`;

  constructor(private http: HttpClient) { }

  getStates(): Observable<any[]> {
    return this.http.get<any[]>(this.apStatesUrl);
  }

  verifyMobile(mobileNumber: string, stateCode: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });

    const body = {
      mobileNumber: mobileNumber,
      stateCode: stateCode
    };
    return this.http.post<any>(this.apiVerifyNumberUrl, body, { headers });
  }

  verifyOtp(stateCode: number, mobileNumber: string, otp: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });

    const body = {
      stateCode: stateCode,
      mobileNumber: mobileNumber,
      otp: otp
    };
    return this.http.post<any>(this.apiVerifyOtpUrl, body, { headers });
  }


  getStoredData():any {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData: User = JSON.parse(storedData);
      console.log('Retrieved data from local storage:', parsedData);
      // You can use `parsedData` as needed
      return storedData;
    }
  }

}