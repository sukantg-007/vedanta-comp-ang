import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../shared/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) {}

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
  errorMessage = '';

  // Enquiry submission models
  enquiryData = {
    name: '',
    email: '',
    course: '',
    message: ''
  };

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  }

  switchForm(formType: 'login' | 'enquiry') {
    this.activeForm = formType;
    this.errorMessage = ''; 
  }

 login(): void {
  // 1. Bundle the data into a clear payload object
  const loginPayload: AuthRequest = {
    email: this.email,
    password: this.password
  };

  // 2. Pass the entire payload object down to the service layer
  this.authService.login(loginPayload).subscribe({
    next: (response: any) => { debugger;
      console.log('Login successful:', response);
      this.router.navigate([this.authService.getDashboardRoute()]);
    },
    error: (error : any) => {
      console.error('Login failed:', error);
      
      // 4. Handle backend validation errors gracefully
      if (error.status === 401 || error.status === 403) {
        this.errorMessage = error.error?.message || 'Invalid email or password.';
      } else {
        this.errorMessage = 'Server is unreachable. Please ensure the backend is running.';
      }
    }
  });
}

  submitEnquiry() {
    alert(`Thank you ${this.enquiryData.name}! Your enquiry for ${this.enquiryData.course} has been received.`);
    this.enquiryData = { name: '', email: '', course: '', message: '' };
  }
}
