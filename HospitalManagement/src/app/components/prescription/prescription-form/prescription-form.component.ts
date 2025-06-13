
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CreatePrescriptionDTO, CreatePrescriptionMedicineDTO, PrescriptionFormDataDTO } from '../../../models/prescription-dto';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.css']
})
export class PrescriptionFormComponent implements OnInit {
    @Input() isEditMode = false;
  @Input() prescriptionId?: number;
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;
 
 // Predefined dropdown suggestions for Diagnoses, Symptoms, Advices
  suggestions = {
    diagnoses: ['Diabetes', 'Hypertension', 'Asthma'],
    symptoms: ['Fever', 'Cough', 'Headache'],
    advices: ['Drink plenty of water', 'Take rest', 'Follow up in a week']
  };


  isLoading = false;
isSubmitting = false;
isDataLoaded = false;
formData: PrescriptionFormDataDTO = {
  doctors: [],
  tokens: [],
  tests: [],
  medicines: []
};
  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadFormData();

    if (this.isEditMode && this.prescriptionId) {
      this.loadPrescriptionForEdit(this.prescriptionId);
    } else {
      this.form.patchValue({
        prescriptionNo: this.prescriptionService.generatePrescriptionNo(),
        prescriptionDate: new Date()
      });
    }
  }

  // Add this debug method
ngAfterViewInit() {
  console.log('Form Data:', this.formData);
  console.log('Form Value:', this.form.value);
}

  initializeForm() {
    this.form = this.fb.group({
      prescriptionId: [0],
      prescriptionNo: ['', Validators.required],
      tokenId: ['', Validators.required],
      doctorId: ['', Validators.required],
      prescriptionDate: ['', Validators.required],
      nextVisitDate: [''],
      assessment: [''],
      prescriptionMedicines: this.fb.array([]),
      prescriptionTests: this.fb.array([]),
      prescriptionDiagnoses: this.fb.array([]),
      physicalSymptoms: this.fb.array([]),
      prescriptionAdvices: this.fb.array([])
    });
  }

 loadFormData() {
  this.isLoading = true;
  this.prescriptionService.getFormData().subscribe({
    next: (data) => {
      console.log('API Response:', data); // Debug log
      this.formData = {
        doctors: Array.isArray(data.doctors) ? data.doctors : [],
        tokens: Array.isArray(data.tokens) ? data.tokens : [],
        tests: Array.isArray(data.tests) ? data.tests : [],
        medicines: Array.isArray(data.medicines) ? data.medicines : []
      };
      console.log('Processed Form Data:', this.formData); // Debug log
      this.isDataLoaded = true;
      this.isLoading = false;

      // Force change detection if needed
        this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading form data:', err); // Error log
      this.isLoading = false;
    }
  });
}
  loadPrescriptionForEdit(id: number) {
    this.isLoading = true;
    this.prescriptionService.getPrescription(id).subscribe({
      next: (prescription) => {
        this.form.patchValue({
          prescriptionId: prescription.prescriptionId,
          prescriptionNo: prescription.prescriptionNo,
          tokenId: prescription.tokenId,
          doctorId: prescription.doctorId,
          prescriptionDate: prescription.prescriptionDate,
          nextVisitDate: prescription.nextVisitDate,
          assessment: prescription.assessment
        });

        // Clear existing arrays
        this.clearFormArrays();

        // Add medicines
        prescription.prescriptionMedicines.forEach(med => {
          this.addMedicine({
            medicineId: med.medicineId,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration
          });
        });

        // Add tests
        prescription.prescriptionTests.forEach(test => {
          this.addTest(test.testId);
        });

        // Add diagnoses
        prescription.prescriptionDiagnoses.forEach(diag => {
          this.addDiagnosis(diag.diagnosisTitle);
        });

        // Add symptoms
        prescription.physicalSymptoms.forEach(symptom => {
          this.addSymptom(symptom.symptomDescription);
        });

        // Add advices
        prescription.prescriptionAdvices.forEach(advice => {
          this.addAdvice(advice.advice);
        });

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/prescriptions']);
      }
    });
  }

  clearFormArrays() {
    this.medicineControls.clear();
    this.testControls.clear();
    this.diagnosisControls.clear();
    this.symptomControls.clear();
    this.adviceControls.clear();
  }

  // Form array getters
  get medicineControls() {
    return this.form.get('prescriptionMedicines') as FormArray;
  }

  get testControls() {
    return this.form.get('prescriptionTests') as FormArray;
  }

  get diagnosisControls() {
    return this.form.get('prescriptionDiagnoses') as FormArray;
  }

  get symptomControls() {
    return this.form.get('physicalSymptoms') as FormArray;
  }

  get adviceControls() {
    return this.form.get('prescriptionAdvices') as FormArray;
  }


onDiagnosisSelect(index: number, event: Event) {
  const selected = (event.target as HTMLSelectElement).value;
  const control = (this.diagnosisControls.at(index) as FormGroup).get('diagnosisTitle');
  control?.setValue(selected);
}


  onSymptomSelect(index: number, event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    const control = (this.symptomControls.at(index) as FormGroup).get('symptomDescription');
    control?.setValue(selected);
  }
  

  onAdviceSelect(index: number, event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const control = (this.adviceControls.at(index) as FormGroup).get('advice');
    control?.setValue(selectedValue);
  }


  // Add methods for each section
  addMedicine(medicine?: CreatePrescriptionMedicineDTO) {
    const group = this.fb.group({
      medicineId: [medicine?.medicineId || '', Validators.required],
      dosage: [medicine?.dosage || '', Validators.required],
      frequency: [medicine?.frequency || '', Validators.required],
      duration: [medicine?.duration || '', Validators.required]
    });
    this.medicineControls.push(group);
  }

  removeMedicine(index: number) {
    this.medicineControls.removeAt(index);
  }

  addTest(testId?: number) {
    const group = this.fb.group({
      testId: [testId || '', Validators.required]
    });
    this.testControls.push(group);
  }

  removeTest(index: number) {
    this.testControls.removeAt(index);
  }

  addDiagnosis(diagnosisTitle?: string) {
    const group = this.fb.group({
      diagnosisTitle: [diagnosisTitle || '', Validators.required]
    });
    this.diagnosisControls.push(group);
  }

  removeDiagnosis(index: number) {
    this.diagnosisControls.removeAt(index);
  }

  addSymptom(description?: string) {
    const group = this.fb.group({
      symptomDescription: [description || '', Validators.required]
    });
    this.symptomControls.push(group);
  }

  removeSymptom(index: number) {
    this.symptomControls.removeAt(index);
  }

  addAdvice(advice?: string) {
    const group = this.fb.group({
      advice: [advice || '', Validators.required]
    });
    this.adviceControls.push(group);
  }

  removeAdvice(index: number) {
    this.adviceControls.removeAt(index);
  }



   onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.form.value as CreatePrescriptionDTO;

    const operation = this.isEditMode
      ? this.prescriptionService.updatePrescription(this.form.value.prescriptionId, formValue)
      : this.prescriptionService.createPrescription(formValue);

    operation.subscribe({
      next: (result) => {
        const id = this.isEditMode ? this.form.value.prescriptionId : (result as any).id;
        this.router.navigate(['/prescriptions', id]);
      },
      error: () => this.isSubmitting = false
    });
  }
}






























// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { PrescriptionService } from '../../../services/prescription.service';
// import { PrescriptionDTO, PrescriptionFormData, PrescriptionMedicineDTO, PrescriptionTestDTO } from '../../../models/prescription-dto';

// @Component({
//   selector: 'app-prescription-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbDatepickerModule],
//   templateUrl: './prescription-form.component.html',
//   styleUrls: ['./prescription-form.component.css']
// })
// export class PrescriptionFormComponent implements OnInit {
//   @Input() isEditMode = false;
//   @Input() prescription: PrescriptionDTO | null = null;
//   @Output() formSubmit = new EventEmitter<PrescriptionDTO>();

//   formData: PrescriptionFormData | null = null;
//   prescriptionForm: FormGroup;
//   today = new Date();

//   constructor(
//     private fb: FormBuilder,
//     private prescriptionService: PrescriptionService,
//     private router: Router,
//     private route: ActivatedRoute
//   )
  
//   {
//     this.prescriptionForm = this.fb.group({
//       tokenId: ['', Validators.required],
//       doctorId: ['', Validators.required],
//       prescriptionDate: [this.formatDate(this.today), Validators.required],
//       nextVisitDate: [''],
//       assessment: [''],
//       prescriptionMedicines: this.fb.array([]),
//       prescriptionTests: this.fb.array([]),
//       prescriptionDiagnosises: this.fb.array([]),
//       physicalSymptoms: this.fb.array([]),
//       prescriptionAdvices: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     this.loadFormData();

//     if (this.isEditMode && !this.prescription) {
//       const id = this.route.snapshot.paramMap.get('id');
//       if (id) {
//         this.loadPrescription(+id);
//       }
//     } else if (this.prescription) {
//       this.patchForm();
//     }
    
//   }

//   // Form array getters
//   get medicines(): FormArray {
//     return this.prescriptionForm.get('prescriptionMedicines') as FormArray;
//   }

//   get tests(): FormArray {
//     return this.prescriptionForm.get('prescriptionTests') as FormArray;
//   }

//   get diagnoses(): FormArray {
//     return this.prescriptionForm.get('prescriptionDiagnosises') as FormArray;
//   }

//   get symptoms(): FormArray {
//     return this.prescriptionForm.get('physicalSymptoms') as FormArray;
//   }

//   get advices(): FormArray {
//     return this.prescriptionForm.get('prescriptionAdvices') as FormArray;
//   }

//   loadFormData(): void {
//     this.prescriptionService.getFormData().subscribe({
//       next: (data) => {
//         this.formData = data;
//       },
//       error: (err) => console.error('Error loading form data:', err)
//     });
//   }

//   loadPrescription(id: number): void {
//     this.prescriptionService.getPrescription(id).subscribe({
//       next: (data) => {
//         this.prescription = data;
//         this.patchForm();
//       },
//       error: (err) => {
//         console.error('Error loading prescription:', err);
//         this.router.navigate(['/prescriptions']);
//       }
//     });
//   }

//   patchForm(): void {
//     if (this.prescription) {
//       this.prescriptionForm.patchValue({
//         tokenId: this.prescription.tokenId,
//         doctorId: this.prescription.doctorId,
//         prescriptionDate: this.formatDate(new Date(this.prescription.prescriptionDate)),
//         nextVisitDate: this.prescription.nextVisitDate ? this.formatDate(new Date(this.prescription.nextVisitDate)) : null,
//         assessment: this.prescription.assessment
//       });

//       // Patch arrays
//       this.prescription.prescriptionMedicines?.forEach(med => this.addMedicine(med));
//       this.prescription.prescriptionTests?.forEach(test => this.addTest(test));
//       this.prescription.prescriptionDiagnosises?.forEach(diag => this.addDiagnosis(diag));
//       this.prescription.physicalSymptoms?.forEach(symptom => this.addSymptom(symptom));
//       this.prescription.prescriptionAdvices?.forEach(advice => this.addAdvice(advice));
//     }
//   }

//   // Medicine methods
//   addMedicine(med?: any): void {
//     this.medicines.push(this.fb.group({
//       medicineId: [med?.medicineId || '', Validators.required],
//       dosage: [med?.dosage || ''],
//       frequency: [med?.frequency || ''],
//       duration: [med?.duration || '']
//     }));
//   }

//   removeMedicine(index: number): void {
//     this.medicines.removeAt(index);
//   }

//   // Test methods
//   addTest(test?: any): void {
//     this.tests.push(this.fb.group({
//       testId: [test?.testId || '', Validators.required]
//     }));
//   }

//   removeTest(index: number): void {
//     this.tests.removeAt(index);
//   }

//   // Diagnosis methods
//   addDiagnosis(diag?: any): void {
//     this.diagnoses.push(this.fb.group({
//       diagnosisTitle: [diag?.diagnosisTitle || '', Validators.required]
//     }));
//   }

//   removeDiagnosis(index: number): void {
//     this.diagnoses.removeAt(index);
//   }

//   // Symptom methods
//   addSymptom(symptom?: any): void {
//     this.symptoms.push(this.fb.group({
//       symptomDescription: [symptom?.symptomDescription || '', Validators.required]
//     }));
//   }

//   removeSymptom(index: number): void {
//     this.symptoms.removeAt(index);
//   }

//   // Advice methods
//   addAdvice(advice?: any): void {
//     this.advices.push(this.fb.group({
//       advice: [advice?.advice || '', Validators.required]
//     }));
//   }

//   removeAdvice(index: number): void {
//     this.advices.removeAt(index);
//   }

//   onSubmit(): void {
//     if (this.prescriptionForm.valid) {
//       const formValue = this.prescriptionForm.value;
      
//       const prescription: PrescriptionDTO = {
//         ...formValue,
//         tokenId: Number(formValue.tokenId),
//         doctorId: Number(formValue.doctorId),
//         prescriptionId: this.prescription?.prescriptionId || 0,
//         prescriptionNo: '',
//         tokenNumber: '',
//         firstName: '',
//         lastName: '',
//         prescriptionDate: new Date(formValue.prescriptionDate).toISOString(),
//         nextVisitDate: formValue.nextVisitDate 
//           ? new Date(formValue.nextVisitDate).toISOString()
//           : null,
//         assessment: formValue.assessment || null,
//         prescriptionMedicines: (formValue.prescriptionMedicines || []).map((m: PrescriptionMedicineDTO) => ({ // Added type
//           ...m,
//           medicineId: Number(m.medicineId),
//           prescriptionId: 0 // Will be set server-side
//         })),
//         prescriptionTests: (formValue.prescriptionTests || []).map((t: PrescriptionTestDTO) => ({ // Added type
//           ...t,
//           testId: Number(t.testId),
//           prescriptionId: 0 // Will be set server-side
//         })),
//         prescriptionDiagnosises: formValue.prescriptionDiagnosises || [],
//         physicalSymptoms: formValue.physicalSymptoms || [],
//         prescriptionAdvices: formValue.prescriptionAdvices || []
//       };
  
//       this.formSubmit.emit(prescription);
//     }
//   }

//   onCancel(): void {
//     this.router.navigate(['/prescriptions']);
//   }

//   private formatDate(date: Date): string {
//     return date.toISOString().split('T')[0];
//   }
// }















