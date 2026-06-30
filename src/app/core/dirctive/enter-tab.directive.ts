import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEnterTab]'
})
export class EnterTabDirective {

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {

    if (event.key !== 'Enter') return;

    const form = this.el.nativeElement as HTMLElement;
    const active = document.activeElement as HTMLElement;

    if (!form.contains(active)) return;

    // Allow Enter in textarea
    if (active.tagName === 'TEXTAREA') return;

    event.preventDefault();

    const focusable = form.querySelectorAll(
      'input:not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    )
    const elements = Array.from(focusable).filter(
      (el: any) => el.offsetParent !== null
    ) as HTMLElement[];

    const index = elements.indexOf(active);

    if (index > -1 && index < elements.length - 1) {
      elements[index + 1].focus();
    } else {
      if (typeof (form as HTMLFormElement).requestSubmit === 'function') {
        (form as HTMLFormElement).requestSubmit();
      } else {
        (form as HTMLFormElement).submit();
      }
    }
  }
}