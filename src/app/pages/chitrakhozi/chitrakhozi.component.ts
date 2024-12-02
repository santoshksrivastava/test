import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ChitrakhoziService } from '../services/chitrakhozi.service';
import { ChitrakhoziDetail } from '../models/chitra-khozi-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-chitrakhozi',
  templateUrl: './chitrakhozi.component.html',
  styleUrls: ['./chitrakhozi.component.css']
})
export class ChitrakhoziComponent implements OnInit {
  
  courtCasesData: ChitrakhoziDetail[] = [];
  uploadedImage: string | ArrayBuffer | null = null;
  uploadedImageSrc: string | null = null;

  constructor(private chitrakhoziService: ChitrakhoziService,private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    // If you need to load any initial data, you can do it here
  }

  getChitraKhoziWithImage(): void {
    if (typeof this.uploadedImage === 'string') {
      this.chitrakhoziService.getChitraKhoziWithImage(this.uploadedImage).subscribe(
        response => {
          this.ref.detectChanges();
          if (response.isSuccess) {
            this.courtCasesData = JSON.parse(response.data);
            console.log(this.courtCasesData);  // Check the data
          } else {
            console.log('API false response:', response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API error:', error);
        }
      );
    } else {
      console.error('Uploaded image is not a valid base64 string');
    }
  }

  onFileSelected(event: Event): void {
    const input = (event.target as HTMLInputElement).files?.[0];
    if (input) {
      this.convertToBase64(input);
    } else {
      console.error('No file selected or file is undefined');
    }
  }

  convertToBase64(file: File): void {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe({
      next: (data) => {
        this.uploadedImage = data;       
      },
      error: (error) => {
        console.error('Error reading file:', error);
      }
    });
  }

  readFile(file: File, subscriber: Subscriber<any>): void {
    const fileReader = new FileReader();
    
    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    };
    
    fileReader.onerror = (error) => {
      subscriber.error(error);
    };

    fileReader.readAsDataURL(file);
  }

  onQuickFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implement filtering logic based on the `filterValue` and `courtCasesData`
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
