import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../shared/models/auth.model';
import { Enquiry } from '../../shared/models/enquiry.model';
import { EnquiryService } from '../../core/services/enquiry.service';
import { IndianMobileValidatorDirective } from '../../shared/validator/indian-mobile.validator';
import { CustomEmailValidatorDirective } from '../../shared/validator/custom-email.validator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, 
            FormsModule,
            IndianMobileValidatorDirective,
            CustomEmailValidatorDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService, 
              private router: Router,
              private enquiryService: EnquiryService) { }

  ngOnInit(): void {
    // 2. If the user clicks back and lands here but is STILL logged in...
    if (this.authService.isLoggedIn()) {
      console.log('Active session detected. Auto-redirecting to dashboard...');

      // 3. Bounce them straight back to their dashboard panel instantly!
      const targetDashboard = this.authService.getDashboardRoute();
      this.router.navigate([targetDashboard]);
    }
  }
  // Carousel State (Kept exactly as is)
  currentSlide = 0;
  slides = [
    { image: 'https://placeholder.com', title: 'Welcome to Vedanta', description: 'Your portal for learning.' },
    { image: 'https://placeholder.com', title: 'Achieve Excellence', description: 'Track your academic growth.' }
  ];

  // Form Navigation State
  activeForm: 'login' | 'enquiry' = 'login';

  // Credentials models
  email = '';
  password = '';
  loginErrorMessage= '';
  enquiryErrorMessage= '';

  // Enquiry submission models
 enquiryData: Enquiry = {
    name: '',
    email: '',
    mobileNumber: '',
    course: ''
  };

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  }

  switchForm(formType: 'login' | 'enquiry') {debugger;
    this.activeForm = formType;
    this.loginErrorMessage = '';
    this.enquiryErrorMessage = '';
  }

  login(): void {
    this.loginErrorMessage = '';
    // 1. Email Format Validation using a standard regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.loginErrorMessage = 'Please enter a valid email address.';
      return;
    }
    // 2. Password Length Validation (Minimum 4 characters)
    if (!this.password || this.password.length < 4) {
      this.loginErrorMessage = 'Password must be at least 4 characters long.';
      return;
    }
    this.loginErrorMessage = ''; // Clear any previous error messages
    // 1. Bundle the data into a clear payload object
    const loginPayload: AuthRequest = {
      email: this.email,
      password: this.password
    };

    // 2. Pass the entire payload object down to the service layer
    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        debugger;
        console.log('Login successful:', response);
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (error: any) => {
        console.error('Login failed:', error);

        if (error.status === 401 || error.status === 403 || error.status === 400) {
          // Correctly navigate down into your Spring Boot ErrorResponse object structure
          this.loginErrorMessage = error.error?.message || 'Invalid email or password.';
        } else {
          this.loginErrorMessage = 'Server is unreachable. Please ensure the backend is running.';
        }
      }
    });
  }

  submitEnquiry(form: NgForm): void {debugger;
    this.enquiryErrorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.validateEnquiryForm(form);
      return;
    }
    this.enquiryService.submitEnquiry(this.enquiryData).subscribe({
      next: () => {
        alert('Enquiry submitted successfully.');

        this.enquiryData = {
          name: '',
          email: '',
          mobileNumber: '',
          course: ''
        };

        this.activeForm = 'enquiry'; // Switch back to the enquiry form after successful submission
      },
      error: (error) => {
        console.error('Error submitting enquiry:', error);
        if (error.status === 401 || error.status === 403 || error.status === 400) {
          // Correctly navigate down into your Spring Boot ErrorResponse object structure
          this.enquiryErrorMessage = error.error?.message || 'Invalid email or mobile number.';
        } else {
          this.enquiryErrorMessage = 'Server is unreachable. Please ensure the backend is running.';
        }
      }
    });
  }

  private validateEnquiryForm(form: NgForm): boolean {debugger;
    const emailControl = form.controls['studentEmail'];
    const mobileControl = form.controls['mobileNumber'];
    this.enquiryErrorMessage = '';

    if (form.controls['studentName']?.errors?.['required']) {
      this.enquiryErrorMessage = 'Full name is required.';
      return false;
    }

    if (form.controls['studentName']?.errors?.['minlength']) {
      this.enquiryErrorMessage =
        'Full name must contain at least 2 characters.';
      return false;
    }

    if (
      emailControl?.errors?.['customEmail'] ||
      emailControl?.errors?.['email']
    ) {
      this.enquiryErrorMessage = 'Please enter a valid email address.';
      return false;
    }

    if (mobileControl?.errors?.['required']) {
      this.enquiryErrorMessage = 'Mobile number is required.';
      return false;
    }

    if (mobileControl?.errors?.['indianMobile']) {
      this.enquiryErrorMessage =
        'Please enter a valid 10-digit mobile number.';
      return false;
    }

    if (form.controls['course']?.errors?.['required']) {
      this.enquiryErrorMessage = 'Course of interest is required.';
      return false;
    }

    return true;
  }

}
