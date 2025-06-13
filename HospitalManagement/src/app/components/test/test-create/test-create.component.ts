// src/app/components/test-create/test-create.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestFormComponent } from '../test-form/test-form.component';
import { TestService } from '../../../services/test.service';
import { TestDTO } from '../../../models/test-dto';


@Component({
  selector: 'app-test-create',
  standalone: true,
  imports: [CommonModule, TestFormComponent],
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.css']
})
export class TestCreateComponent {
  constructor(
    private testService: TestService,
    private router: Router
  ) {}

  onFormSubmit(testData: Omit<TestDTO, 'testId'>): void {
    this.testService.createTest(testData).subscribe({
      next: (createdTest) => {
        this.router.navigate(['/tests']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create test. Please try again.');
      }
    });
  }
}