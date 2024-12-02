import { Component,OnInit,TemplateRef  } from '@angular/core';
import { NgbModal,NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service'
import { User } from './../models/user.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit   {


  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  isOtpTextVisible:boolean=false;
  isOtpButton:boolean=false;
  isOtpReSendButton:boolean=false;
  isOtpVerfiy:boolean = false;
  modalRef: NgbModalRef | undefined; 
  selectedStateCode: number = 0; 
  mobileNumber: string = '';

  captch_input: string = '';
  code: string = '';
  resultCode: any = 0;
  config = {
    cssClass: 'custom-captcha-class',
    type: 2, // For math-based captcha
    font: { size: '20px', family: 'Arial', color: '#000000' },
    back: { stroke: '#2F9688', solid: '#f2efd2' },
    length : 6
  };



  constructor(private modalService: NgbModal,private router: Router,private authService: AuthService) {}
   ngOnInit(): void {
    this.authService.getStates().subscribe((data: any[]) => {
      this.states = data;
    });
    this.createCaptcha();

  }

  states: any[] = [];
  openLoginModal(content: any) {
    this.createCaptcha();
    this.isOtpTextVisible=false;
    this.isOtpVerfiy = false;
    this.isOtpButton=true;
    this.isOtpReSendButton=false;
    this.modalRef = this.modalService.open(content, { centered: true });
  }


  moveFocus(event: any, nextInput: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && !isNaN(Number(input.value))) {
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      input.value = ''; // Clear the input if it's not a valid number
    }
  }

  verifyMobile() {


    const mobileNumber = this.mobileNumber;
    const stateCode: number = this.selectedStateCode; // replace with the actual state code

    //content: TemplateRef<any>
    if (this.captch_input === this.resultCode) {
    this.authService.verifyMobile(mobileNumber, stateCode).subscribe(
      response => {
       if(response.isSuccess)
       {
        
        this.isOtpTextVisible=true;
        this.isOtpVerfiy = true;
        this.isOtpButton=false;
        this.isOtpReSendButton=true;
        console.log('API true response:', response);
        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: 'The OTP has been sent successfully to the user’s registered mobile number.',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-alert',
            title: 'custom-title',
          },
          background: '#006400', // Green background
        });
       }
       else{
        
        this.isOtpTextVisible=false;
        this.isOtpVerfiy = false;
        this.isOtpButton=true;
        this.isOtpReSendButton=false;
        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: response.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-failure-alert',
            title: 'custom-title',
          },
          background: '#ff0000', // Red background
        });
        console.log('API false response:', response);
       }
      },
      error => {
        console.error('API error:', error);
      }
    );
  }
  else{
    alert('Captcha incorrect. Please try again.');
    this.createCaptcha();
  }
  }

  getOtpValue(): string {
    return `${this.otp1}${this.otp2}${this.otp3}${this.otp4}`;
  }


  verfiyOTPUser() {
    const otp = this.getOtpValue();
    const mobileNumber = this.mobileNumber;
    const stateCode: number = this.selectedStateCode; // replace with the actual state code

    this.authService.verifyOtp(stateCode,mobileNumber,otp).subscribe(
      response => {
       if(response.isSuccess)
       {
        this.isOtpTextVisible=false;
        this.isOtpVerfiy = false;
        this.isOtpButton=false;
        this.isOtpReSendButton=false;
        console.log('API true response:', response);
        const data: User = response.data;
        if (localStorage.getItem('userData')) {
          // If it exists, remove it
          localStorage.removeItem('userData');
          }

          if (localStorage.getItem('userName')) {
            // If it exists, remove it
            localStorage.removeItem('userName');
            }
      
      // Now, add the new data to localStorage
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('userName', data.name);

        if (this.modalRef) {
          this.modalRef.close(); // Or use this.modalRef.dismiss() if you want to dismiss with a reason
        }

        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: 'User is login successfully',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-alert',
            title: 'custom-title',
          },
          background: '#006400', // Green background
        });
         this.router.navigate(['/dashboard']);
       
       }
       else{
        this.isOtpTextVisible=true;
        this.isOtpVerfiy = true;
        this.isOtpButton=false;
        this.isOtpReSendButton=true;
        console.log('API false response:', response);

        Swal.fire({
          position: 'top-end', // Or 'center-end' for center-right position
          title: response.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'custom-failure-alert',
            title: 'custom-title',
          },
          background: '#ff0000', // Red background
        });
       }
      },
      error => {
        console.error('API error:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    // Create captcha after view is initialized to ensure the canvas is available
    this.createCaptcha();
  }

  createCaptcha(): void {
    if (this.config.type === 1) {
      // Alpha-numeric captcha
      this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.resultCode = this.code;
    } else if (this.config.type === 2) {
      // Simple arithmetic captcha
      const num1 = Math.floor(Math.random() * 100);
      const num2 = Math.floor(Math.random() * 10);
      this.code = `${num1} + ${num2} = ?`;
      this.resultCode = (num1 + num2).toString();
    }

    setTimeout(() => {
      const canvas = document.getElementById('captcahCanvas') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content

          ctx.fillStyle = this.config.back.solid; // Background color
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.font = `${this.config.font.size} ${this.config.font.family}`;
          ctx.fillStyle = this.config.font.color;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center'; // Center the text horizontally

          ctx.fillText(this.code, canvas.width / 2, canvas.height / 2);
        }
      }
    }, 100);
  }
  checkCaptcha(): void {
    if (this.captch_input === this.resultCode) {
      alert('Captcha correct!');
    } else {
      alert('Captcha incorrect. Please try again.');
      this.createCaptcha();
    }
  }

  playCaptcha(): void {
    const msg = new SpeechSynthesisUtterance(this.code.split('').join(' '));
    msg.pitch = 0.1;
    window.speechSynthesis.speak(msg);
  }
}

