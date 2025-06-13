// // src/app/components/test-list/test-list.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { TestService } from '../../../services/test.service';
// import { TestDTO } from '../../../models/test-dto';

// @Component({
//   selector: 'app-test-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './test-list.component.html',
//   styleUrls: ['./test-list.component.css']
// })
// export class TestListComponent implements OnInit {
//   tests: TestDTO[] = [];
//   isLoading = true;
//   error: string | null = null;

//   constructor(private testService: TestService) {}

//   ngOnInit(): void {
//     this.loadTests();
//   }

//   loadTests(): void {
//     this.isLoading = true;
//     this.error = null;
//     this.testService.getTests().subscribe({
//       next: (data) => {
//         this.tests = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load tests. Please try again later.';
//         this.isLoading = false;
//         console.error(err);
//       }
//     });
//   }

//   deleteTest(id: number): void {
//     if (confirm('Are you sure you want to delete this test?')) {
//       this.testService.deleteTest(id).subscribe({
//         next: () => {
//           this.tests = this.tests.filter(test => test.testId !== id);
//         },
//         error: (err) => {
//           console.error(err);
//           alert('Failed to delete test.');
//         }
//       });
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestDTO } from '../../../models/test-dto';
import { TestService } from '../../../services/test.service';


@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {
  tests: TestDTO[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.isLoading = true;
    this.error = null;
    this.testService.getTests().subscribe({
      next: (data) => {
        // Ensure we're working with an array
        this.tests = Array.isArray(data) ? data : [data];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tests. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteTest(id: number): void {
    if (confirm('Are you sure you want to delete this test?')) {
      this.testService.deleteTest(id).subscribe({
        next: () => {
          this.tests = this.tests.filter(test => test.testId !== id);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete test.');
        }
      });
    }
  }
}