import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enquiry } from '../../shared/models/enquiry.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
 private readonly http = inject(HttpClient);

  // Core Endpoint Routing Parameters Configuration
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  submitEnquiry(enquiry: Enquiry): Observable<Enquiry> {
    return this.http.post<Enquiry>(`${this.apiUrl}/login`, enquiry);
  }
}