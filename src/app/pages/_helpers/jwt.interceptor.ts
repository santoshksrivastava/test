import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';



@Injectable()
export class jwtInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        
        const platformId = inject(PLATFORM_ID);
        const userData =  isPlatformBrowser(platformId) ? localStorage.getItem('userData') : null;
        // add auth header with jwt if user is logged in and request is to the api url
        if (userData != null) {
            const jwtToken =  isPlatformBrowser(platformId) ? JSON.parse(localStorage.getItem('userData') as string).jwtToken : null;
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
        }

        return  next.handle(request).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}