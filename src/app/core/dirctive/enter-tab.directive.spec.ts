import { ElementRef } from '@angular/core';
import { EnterTabDirective } from './enter-tab.directive';

describe('EnterTabDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('form'));
    const directive = new EnterTabDirective(elMock);
    expect(directive).toBeTruthy();
  });
});
