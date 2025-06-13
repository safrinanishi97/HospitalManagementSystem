// test-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { TestReport, TestReportDTO } from '../../../models/test-report';
import { TestReportService } from '../../../services/test-report.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-test-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TruncatePipe],
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.css']
})
export class TestReportsComponent implements OnInit {
  reports: TestReport[] = [];
  selectedReport: TestReport | null = null;
  newReport: TestReportDTO = {
    prescriptionTestId: null!,
    testResult: '',
    isFinalized: false
  };
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private reportService: TestReportService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.reportService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reports. Please try again later.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  selectReport(report: TestReport) {
    this.selectedReport = { ...report };
    this.successMessage = null;
    this.errorMessage = null;
  }

  createReport() {
    this.reportService.createReport(this.newReport).subscribe({
      next: () => {
        this.successMessage = 'Report created successfully!';
        this.loadReports();
        this.resetNewReportForm();
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to create report. Please check your inputs.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  updateReport() {
    if (!this.selectedReport) return;

    this.reportService.updateReport(this.selectedReport.testReportId, this.selectedReport).subscribe({
      next: () => {
        this.successMessage = 'Report updated successfully!';
        this.loadReports();
        this.selectedReport = null;
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to update report.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  deleteReport(id: number) {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.successMessage = 'Report deleted successfully!';
          this.loadReports();
          if (this.selectedReport?.testReportId === id) {
            this.selectedReport = null;
          }
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          this.errorMessage = err.error || 'Failed to delete report.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  resetNewReportForm() {
    this.newReport = {
      prescriptionTestId: null!,
      testResult: '',
      isFinalized: false
    };
  }

  cancelEdit() {
    this.selectedReport = null;
  }
}