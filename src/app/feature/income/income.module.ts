import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterTabModule } from 'src/app/shared/enter-tab/enter-tab.module';



@NgModule({
  declarations: [
    IncomeComponent,
    ExpenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnterTabModule
  ]
})
export class IncomeModule { }
