import { Routes } from '@angular/router';
import { PrescriptionListComponent } from './components/prescription/prescription-list/prescription-list.component';
//import { PrescriptionCreateComponent } from './components/prescription/prescription-create/prescription-create.component';

import { PrescriptionDetailComponent } from './components/prescription/prescription-detail/prescription-detail.component';
import { TestListComponent } from './components/test/test-list/test-list.component';
import { TestCreateComponent } from './components/test/test-create/test-create.component';
import { TestEditComponent } from './components/test/test-edit/test-edit.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestReportsComponent } from './components/testReport/test-report/test-report.component';

import { TestBillingComponent } from './components/testBilling/test-billing/test-billing.component';
import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './components/appointment/appointment-create/appointment-create.component';
import { TokenComponent } from './components/token/token.component';
import { AdmissionListComponent } from './components/admission/admission-list/admission-list.component';
import { AdmissionFormComponent } from './components/admission/admission-form/admission-form.component';
// import { PrescriptionEditComponent } from './components/prescription/prescription-edit/prescription-edit.component';
import { MedicineListComponent } from './components/medicine/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './components/medicine/medicine-detail/medicine-detail.component';
import { MedicineAddComponent } from './components/medicine/medicine-add/medicine-add.component';
import { MedicineEditComponent } from './components/medicine/medicine-edit/medicine-edit.component';
import { MedicinePurchaseListComponent } from './components/medicine-purchase/medicine-purchase-list/medicine-purchase-list.component';
import { MedicinePurchaseDetailComponent } from './components/medicine-purchase/medicine-purchase-detail/medicine-purchase-detail.component';
import { MedicinePurchaseAddComponent } from './components/medicine-purchase/medicine-purchase-add/medicine-purchase-add.component';
import { MedicinePurchaseEditComponent } from './components/medicine-purchase/medicine-purchase-edit/medicine-purchase-edit.component';
import { MedicineSaleListComponent } from './components/medicine-sale/medicine-sale-list/medicine-sale-list.component';
import { MedicineSaleDetailComponent } from './components/medicine-sale/medicine-sale-detail/medicine-sale-detail.component';
import { MedicineSaleAddComponent } from './components/medicine-sale/medicine-sale-add/medicine-sale-add.component';
import { MedicineSaleEditComponent } from './components/medicine-sale/medicine-sale-edit/medicine-sale-edit.component';
import { MedicineProfitListComponent } from './components/medicine-profit/medicine-profit-list/medicine-profit-list.component';
import { MedicineProfitDetailComponent } from './components/medicine-profit/medicine-profit-detail/medicine-profit-detail.component';
import { MedicineProfitAddComponent } from './components/medicine-profit/medicine-profit-add/medicine-profit-add.component';
import { MedicineProfitEditComponent } from './components/medicine-profit/medicine-profit-edit/medicine-profit-edit.component';
import { MedicineLossListComponent } from './components/medicine-loss/medicine-loss-list/medicine-loss-list.component';
import { MedicineLossDetailComponent } from './components/medicine-loss/medicine-loss-detail/medicine-loss-detail.component';
import { MedicineLossAddComponent } from './components/medicine-loss/medicine-loss-add/medicine-loss-add.component';
import { MedicineLossEditComponent } from './components/medicine-loss/medicine-loss-edit/medicine-loss-edit.component';
import { PrescriptionFormComponent } from './components/prescription/prescription-form/prescription-form.component';
import { PatientListComponent } from './components/patient/patient-list/patient-list.component';
import { PatientCreateComponent } from './components/patient/patient-create/patient-create.component';
import { PatientEditComponent } from './components/patient/patient-edit/patient-edit.component';
import { PatientDetailComponent } from './components/patient/patient-detail/patient-detail.component';
import { MedicineBillingCreateComponent } from './components/medicine-billing/medicine-billing-create/medicine-billing-create.component';
import { MedicineBillingListComponent } from './components/medicine-billing/medicine-billing-list/medicine-billing-list.component';
import { MedicineBillingDetailComponent } from './components/medicine-billing/medicine-billing-detail/medicine-billing-detail.component';
import { DoctorDetailsComponent } from './components/doctor/doctor-details/doctor-details.component';
import { DoctorListComponent } from './components/doctor/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './components/doctor/doctor-form/doctor-form.component';
import { AppointmentDetailComponent } from './components/appointment/appointment-detail/appointment-detail.component';
import { AppointmentEditComponent } from './components/appointment/appointment-edit/appointment-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  //Patient
  { path: 'patients', component: PatientListComponent },
  { path: 'patients/new', component: PatientCreateComponent },
  { path: 'patients/edit/:id', component: PatientEditComponent },
  { path: 'patients/:id', component: PatientDetailComponent },

  //token
  { path: 'token', component: TokenComponent },

  // Appointment
  { path: 'appointment', component: AppointmentListComponent },
  { path: 'appointment/create', component: AppointmentCreateComponent },
  { path: 'appointment/:id', component: AppointmentDetailComponent },
  { path: 'appointment/edit/:id', component: AppointmentEditComponent },

  //doctors
  { path: 'doctors', component: DoctorListComponent },
  { path: 'doctors/new', component: DoctorFormComponent },
  { path: 'doctors/edit/:id', component: DoctorFormComponent },
  { path: 'doctors/details/:id', component: DoctorDetailsComponent },

  // Prescription
  { path: 'prescriptions', component: PrescriptionListComponent },
  { path: 'prescriptions/create', component: PrescriptionFormComponent },
  { path: 'prescriptions/edit/:id', component: PrescriptionFormComponent },
  { path: 'prescriptions/:id', component: PrescriptionDetailComponent },

  // Test
  { path: 'tests', component: TestListComponent },
  { path: 'tests/create', component: TestCreateComponent },
  { path: 'tests/edit/:id', component: TestEditComponent },

  // TestReport
  { path: 'testReport', component: TestReportsComponent },

  // TestBilling
  { path: 'billings', component: TestBillingComponent },

  // admissions
  { path: 'admissions', component: AdmissionListComponent },
  { path: 'admissions/new', component: AdmissionFormComponent },
  { path: 'admissions/edit/:id', component: AdmissionFormComponent },

  // Medicine
  { path: 'medicines', component: MedicineListComponent },
  { path: 'medicines/detail/:id', component: MedicineDetailComponent },
  { path: 'medicines/add', component: MedicineAddComponent },
  { path: 'medicines/edit/:id', component: MedicineEditComponent },

  { path: 'medicine-purchases', component: MedicinePurchaseListComponent },
  {
    path: 'medicine-purchases/detail/:id',
    component: MedicinePurchaseDetailComponent,
  },
  { path: 'medicine-purchases/add', component: MedicinePurchaseAddComponent },
  {
    path: 'medicine-purchases/edit/:id',
    component: MedicinePurchaseEditComponent,
  },

  { path: 'medicine-sales', component: MedicineSaleListComponent },
  { path: 'medicine-sales/detail/:id', component: MedicineSaleDetailComponent },
  { path: 'medicine-sales/add', component: MedicineSaleAddComponent },
  { path: 'medicine-sales/edit/:id', component: MedicineSaleEditComponent },

  { path: 'medicine-profits', component: MedicineProfitListComponent },
  {
    path: 'medicine-profits/detail/:id',
    component: MedicineProfitDetailComponent,
  },
  { path: 'medicine-profits/add', component: MedicineProfitAddComponent },
  { path: 'medicine-profits/edit/:id', component: MedicineProfitEditComponent },

  { path: 'medicine-losses', component: MedicineLossListComponent },
  {
    path: 'medicine-losses/detail/:id',
    component: MedicineLossDetailComponent,
  },
  { path: 'medicine-losses/add', component: MedicineLossAddComponent },
  { path: 'medicine-losses/edit/:id', component: MedicineLossEditComponent },

  //medicine-billing
  {
    path: 'medicine-billing/create',
    component: MedicineBillingCreateComponent,
  }, // Route to create component
  { path: 'medicine-billings', component: MedicineBillingListComponent }, // Route to the list component
  { path: 'medicine-billings/:id', component: MedicineBillingDetailComponent }, // Route to the detail component
  { path: '', redirectTo: '/medicine-billings', pathMatch: 'full' }, // Redirect to the list as the default

  // Wildcard
  { path: '**', redirectTo: 'dashboard' },
];
