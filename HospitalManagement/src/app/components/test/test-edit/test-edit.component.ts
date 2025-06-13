// test-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestFormComponent } from '../test-form/test-form.component';
import { CommonModule } from '@angular/common';
import { TestDTO } from '../../../models/test-dto';
import { TestService } from '../../../services/test.service';


@Component({
  selector: 'app-test-edit',
  standalone: true,
  imports: [CommonModule, TestFormComponent],
  templateUrl: './test-edit.component.html',
  styleUrls: ['./test-edit.component.css']
})
export class TestEditComponent implements OnInit {
  test: TestDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {}


  ngOnInit(): void {
  console.log('Edit component initialized');
  const id = this.route.snapshot.paramMap.get('id');
  console.log('ID from route:', id);
  
  if (id) {
    this.testService.getTest(+id).subscribe({
      next: (data) => {
        console.log('Received test data:', data);
        this.test = data;
      },
      error: (err) => {
        console.error('Error loading test:', err);
        this.router.navigate(['/tests']);
      }
    });
  }
}

  onFormSubmit(testData: TestDTO): void {
    this.testService.updateTest(testData).subscribe({
      next: () => {
        this.router.navigate(['/tests']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update test. Please try again.');
      }
    });
  }
}