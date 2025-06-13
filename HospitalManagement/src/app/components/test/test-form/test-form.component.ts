// // src/app/components/test-form/test-form.component.ts
// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { TestDTO } from '../../../models/test-dto';


// @Component({
//   selector: 'app-test-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './test-form.component.html',
//   styleUrls: ['./test-form.component.css']
// })
// export class TestFormComponent implements OnInit {
//   @Input() test: TestDTO | null = null;
//   @Output() submitForm = new EventEmitter<TestDTO>();
  
//   formData: Omit<TestDTO, 'testId'> = {
//     testName: '',
//     price: 0
//   };
//   isEditMode = false;
//   isLoading = false;
//   error: string | null = null;

//   ngOnInit(): void {
//     if (this.test) {
//       this.isEditMode = true;
//       this.formData = {
//         testName: this.test.testName,
//         price: this.test.price
//       };
//     }
//   }

//   onSubmit(): void {
//     this.isLoading = true;
//     this.error = null;
    
//     const testData = this.isEditMode 
//       ? { ...this.formData, testId: this.test!.testId }
//       : this.formData;

//     this.submitForm.emit(testData as TestDTO);
//   }
// }



import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TestDTO } from '../../../models/test-dto';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnChanges {
  @Input() test: TestDTO | null = null;
  @Output() submitForm = new EventEmitter<TestDTO>();
  
  formData: Omit<TestDTO, 'testId'> = {
    testName: '',
    price: 0
  };
  isEditMode = false;
  isLoading = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['test'] && changes['test'].currentValue) {
      this.isEditMode = true;
      this.formData = {
        testName: this.test!.testName,
        price: this.test!.price
      };
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.error = null;
    
    const testData = this.isEditMode 
      ? { ...this.formData, testId: this.test!.testId }
      : this.formData;

    this.submitForm.emit(testData as TestDTO);
  }
}