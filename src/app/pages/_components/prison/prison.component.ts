import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-prison',
  templateUrl: './prison.component.html',
  styleUrl: './prison.component.css'
})
export class PrisonComponent {
  data:any;
  
  constructor(private ref: ChangeDetectorRef){

  }

  loadPrisonInfo(data: any) {
    debugger;
    this.data = data;
    this.ref.detectChanges();
  }

}
