import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule], // 2. Add it to imports array so template recognizes ngModel
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Make sure this matches your css extension
})
export class HomeComponent {
  // Carousel State
  currentSlide = 0;
  slides = [
    { image: 'https://placeholder.com', title: 'Welcome to Vedanta', description: 'Your portal for learning.' },
    { image: 'https://placeholder.com', title: 'Achieve Excellence', description: 'Track your academic growth.' }
  ];

  // Form Properties
  email = '';
  password = '';
  errorMessage = '';

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
  }

  login() {
    if (this.email === 'admin@example.com' && this.password === 'admin123') {
      this.errorMessage = '';
      alert('Login successful!');
      // Add routing navigation here later
    } else {
      this.errorMessage = 'Invalid email or password.';
    }
  }
}
