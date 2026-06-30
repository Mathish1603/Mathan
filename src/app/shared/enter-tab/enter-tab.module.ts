import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterTabDirective } from 'src/app/core/dirctive/enter-tab.directive'; 

@NgModule({
  declarations: [EnterTabDirective],   //  Declare here
  imports: [CommonModule],
  exports: [EnterTabDirective]         //  Export so other modules can use
})
export class EnterTabModule {}