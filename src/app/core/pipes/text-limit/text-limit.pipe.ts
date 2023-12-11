import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textLimit',
  standalone: true,
})
export class TextLimitPipe implements PipeTransform {
  public transform(text: string, limit: number): string {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  }
}
