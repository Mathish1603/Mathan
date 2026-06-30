import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterTabModule } from 'src/app/shared/enter-tab/enter-tab.module';



@NgModule({
  declarations: [
    EntryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnterTabModule
  ]
})
export class EntryModule { }
