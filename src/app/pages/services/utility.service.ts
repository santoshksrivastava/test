import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UtilityService {

  constructor(private http: HttpClient) { }

  PoliceStationList(distcode?: string): Observable<any[]> {
    if (distcode) {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetPoliceStations?distcode=${distcode}`);
    } else {
      return this.http.get<any[]>(`${environment.apiUrl}/Public/GetPoliceStations`);
    }
  }

  Districts(){
    return this.http.get<any>(`${environment.apiUrl}/Public/GetDistricts`);
  }

  LoadCourtCaseInformation(body: any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/CaseInformation`, body);
  }

  LoadFslInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/FslInfo`, body);
  }

  LoadProsecutionInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/ProsecutionInfo`, body);
  }

  LoadPrisonerInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/PrisonerInfo`, body);
  }

  LoadMiniStatement(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/MiniStateMent`, body);
  }

  LoadMedleprInformation(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/MedleprInformation`, body);
  }

  OpinionAdviceInHtml(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/OpinionAdviceHtml`, body);
  }

  DownloadPdfFileFromByteArray(byteArray:any, fileName: any){
    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;  // The file name you want to save as
    link.click();
    // Cleanup
    window.URL.revokeObjectURL(link.href);
  }

  DownloadPdfFileFromBase64(base64:string, fileName: string) {
    // Create a Blob from the Base64 string
    const byteCharacters = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;  // The file name you want to save as
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(link.href);
  }

  DownloadOrder(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/DownloadOrder`, body);
  }

  DownloadFslReport(body:any){
    return this.http.post<any>(`${environment.apiUrl}/Napix/FslReport`, body);
  }

  ShowErrorPopup(message: string){
    Swal.fire({
      position: 'top-end', // Or 'center-end' for center-right position
      title:message,
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'custom-failure-alert',
        title: 'custom-title',
      },
      background: '#ff0000', // Red background
    });
  }
}
