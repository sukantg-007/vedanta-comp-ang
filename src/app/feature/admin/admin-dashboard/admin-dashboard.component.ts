import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Active UI Navigation Management State
  activeTab: 'overview' | 'staff' | 'student' | 'course' | 'advertisement' = 'overview';

  // System Core Data Memory Stores
  staffList: any[] = [];
  studentList: any[] = [];
  courseList: any[] = [];
  adList: any[] = [];

  // Local Base API Endpoint Paths matching your Spring Boot controllers
  private baseApiUrl = 'http://localhost:8080/api/v1';

  ngOnInit(): void {
    this.loadAllDashboardData();
  }

  /**
   * Dispatches concurrent parallel network queries to load all administrative grids
   */
  loadAllDashboardData(): void {
    // 1. Fetch Staff Data
    this.http.get<any[]>(`${this.baseApiUrl}/staff`).subscribe({
      next: (data) => this.staffList = data,
      error: (err) => console.error('Failed to load staff array data:', err)
    });

    // 2. Fetch Student Data
    this.http.get<any[]>(`${this.baseApiUrl}/student`).subscribe({
      next: (data) => this.studentList = data,
      error: (err) => console.error('Failed to load student data:', err)
    });

    // 3. Fetch Course Domain Directory
    this.http.get<any[]>(`${this.baseApiUrl}/courses`).subscribe({
      next: (data) => this.courseList = data,
      error: (err) => console.error('Failed to load course details:', err)
    });

    // 4. Fetch Active Advertisement Carousel Slivers
    this.http.get<any[]>(`${this.baseApiUrl}/ads/active`).subscribe({
      next: (data) => this.adList = data,
      error: (err) => console.error('Failed to load active carousel banner components:', err)
    });
  }

  switchTab(tab: 'all' | 'staff' | 'student' | 'course' | 'advertisement'): void {
    this.activeTab = tab === 'all' ? 'overview' : tab;
  }

  getTabTitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'System Performance & Resource Metrics';
      case 'staff': return 'Staff Registry Directories';
      case 'student': return 'Student Portal Management Grid';
      case 'course': return 'Course Syllabus Directory Configurations';
      case 'advertisement': return 'Dynamic Homepage Carousel Banner Ad Slides';
    }
  }

  /**
   * Centralized record deletion router targeting explicit Spring Boot endpoints securely
   */
  deleteItem(type: 'staff' | 'student' | 'course' | 'ad', id: number): void {
    if (!confirm(`Are you sure you want to permanently remove this ${type} record?`)) return;

    let targetEndpoint = '';
    switch (type) {
      case 'staff': targetEndpoint = `${this.baseApiUrl}/staff/${id}`; break;
      case 'student': targetEndpoint = `${this.baseApiUrl}/student/${id}`; break;
      case 'course': targetEndpoint = `${this.baseApiUrl}/courses/${id}`; break;
      case 'ad': targetEndpoint = `${this.baseApiUrl}/ads/${id}`; break;
    }

    this.http.delete(targetEndpoint).subscribe({
      next: () => {
        alert('Item successfully deleted.');
        this.loadAllDashboardData(); // Re-trigger live sync loop refresh instantly
      },
      error: (err) => alert(`Execution block error: ${err.error?.message || 'Access Denied'}`)
    });
  }

  openModal(type: string): void {
    alert(`This feature will open a customized dynamic creation form modal popup interface to append details directly into your ${type} datasets.`);
  }

  logout(): void {
    this.authService.logout();
  }
}
