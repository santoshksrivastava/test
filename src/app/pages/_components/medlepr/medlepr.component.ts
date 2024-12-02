import { ChangeDetectorRef, Component } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-medlepr',
  templateUrl: './medlepr.component.html',
  styleUrl: './medlepr.component.css'
})
export class MedleprComponent {

  data: any;

  constructor(private ref: ChangeDetectorRef, private utilityService: UtilityService){

  }

  loadMedleprInfo(data: any){
    this.data = data[0];
    this.ref.detectChanges();
  }

  downloadFile(base64: string)
  {
    this.utilityService.DownloadPdfFileFromBase64(base64, "Report.pdf");
  }
}
