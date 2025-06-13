// src/app/components/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  cards = [
    {
      title: 'Patients',
      value: '120',
      icon: 'fa-flask',
      route: '/patients',
      color: 'bg-info',
    },
    {
      title: 'Token',
      value: '45',
      icon: 'fa-file-prescription',
      route: '/token',
      color: 'bg-success',
    },
    {
      title: 'Appointment',
      value: '120',
      icon: 'fa-flask',
      route: '/appointment',
      color: 'bg-primary',
    },
    {
      title: 'Doctors',
      value: '120',
      icon: 'fa-flask',
      route: '/doctors',
      color: 'bg-primary',
    },
    {
      title: 'Prescriptions',
      value: '45',
      icon: 'fa-file-prescription',
      route: '/prescriptions',
      color: 'bg-success',
    },
    {
      title: 'Tests',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/tests',
      color: 'bg-warning',
    },
    {
      title: 'TestReports',
      value: '89',
      icon: 'fa-user-injured',
      route: '/testReport',
      color: 'bg-info',
    },
    {
      title: 'TestBilling',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/billings',
      color: 'bg-warning',
    },
    {
      title: 'Admissions',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/admissions',
      color: 'bg-info',
    },
    {
      title: 'Medicines',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicines',
      color: 'bg-success',
    },
    {
      title: 'Medicine Purchases',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicine-purchases',
      color: 'bg-warning',
    },
    {
      title: 'Medicine Sales',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicine-sales',
      color: 'bg-danger',
    },
    {
      title: 'Medicine Profits',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicine-profits',
      color: 'bg-info',
    },
    {
      title: 'Medicine Losses',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicine-losses',
      color: 'bg-primary',
    },
    {
      title: 'Medicine-Billing',
      value: '15',
      icon: 'fa-calendar-check',
      route: '/medicine-billings',
      color: 'bg-warning',
    },
  ];

  recentActivities = [
    { action: 'New test created', time: '10 mins ago', user: 'Dr. Smith' },
    { action: 'Prescription updated', time: '25 mins ago', user: 'Dr. Khan' },
    { action: 'Test checked in', time: '1 hour ago', user: 'Nurse Jahan' },
  ];
}
