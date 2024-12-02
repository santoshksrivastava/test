import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChitrakhoziService  {

  constructor(private http: HttpClient) { }

  getChitraKhoziWithImage(Image: string): Observable<any> {
       const body = {
        image: Image,
    };
    return this.http.post<any>(`${environment.apiUrl}/Napix/ChitraKhoji`, body);
  }

 getChitraKhoziWithImageCCTNS(Image: string): Observable<any> {
  var api =  "http://10.144.2.82:12124/api/CCTNSKhozi/CCTNSKHOJI";
     const body = {
      base64_image: Image
  };
  return this.http.post<any>(`${api}`, body);
 // return this.http.post<any>(`${environment.apiUrl}/CCTNSKhozi/CCTNSKHOJI`, body);
 }
}
