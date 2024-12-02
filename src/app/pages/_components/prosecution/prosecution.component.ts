import { ChangeDetectorRef, Component } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-prosecution',
  templateUrl: './prosecution.component.html',
  styleUrl: './prosecution.component.css'
})
export class ProsecutionComponent {
  data: any = undefined;
  opinionAdviceInHtml: string = "";
  constructor(private ref: ChangeDetectorRef,  private utilityService: UtilityService, private sanitizer: DomSanitizer){

  }

  loadProsecutionInfo(data: any) {
    this.data = data;
    this.ref.detectChanges();
  }


  
  loadProsecutionHtml(eProcId: string){
    let body = {
      eProcId: eProcId
    };
    this.utilityService.OpinionAdviceInHtml(body).subscribe((response)=>{
      if (response.isSuccess) {
        let data = JSON.parse(response.data);
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data.htmlstring, 'text/html');
        console.log(doc.body.innerHTML);

        const styles = doc.querySelectorAll('style');
        styles.forEach(element => {
          element.remove();
        });

        const heads = doc.querySelectorAll('head');
        heads.forEach(element=> element.remove());

        const styleElements = doc.querySelectorAll('style');
        styleElements.forEach(style => style.remove());

        const collapse = doc.querySelectorAll('.collapse');
        collapse.forEach(element => {
          element.classList.remove('collapse');
        });

        const menucontent = doc.querySelectorAll('.menu-content');
        menucontent.forEach(element => {
          element.classList.remove('menu-content');
          element.classList.add('p-10');
        });

        const tableToChangeClass = doc.querySelectorAll('table');
        tableToChangeClass.forEach(element => {
          element.classList.add('table');
          element.classList.add('table-bordered');
        });
        
        const sanitizedHtml = doc.body.innerHTML;

        // Trust the sanitized HTML to render it safely
        this.opinionAdviceInHtml = sanitizedHtml;
        this.ref.detectChanges();
        
      } else {
        this.utilityService.ShowErrorPopup(response.message);
      }
    });
  }
}
