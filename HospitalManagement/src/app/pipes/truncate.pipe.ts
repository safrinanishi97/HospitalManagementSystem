// pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 25, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
      if (limit < 0) limit = 25;
    }

    return `${value.substring(0, limit)}${ellipsis}`;
  }
}
