import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadgerComponent } from './feature/master/leadger/leadger.component';
import { FolderComponent } from './feature/master/folder/folder.component';
import { ReportsComponent } from './feature/report/reports/reports.component';
import { IncomeComponent } from './feature/income/income/income.component';
import { ExpenseComponent } from './feature/income/expense/expense.component';
import { EntryComponent } from './feature/entry/entry/entry.component';

const routes: Routes = [
  { path: '', redirectTo: '/Entry', pathMatch: 'full' },

  // master

  { path: 'Leadger', component: LeadgerComponent },

  { path: 'Folder', component: FolderComponent },

  // report
  { path: 'Reports', component: ReportsComponent },

  // income&expense

  { path: 'Income', component: IncomeComponent },

  { path: 'Expense', component: ExpenseComponent },

  // entry

  { path: 'Entry', component: EntryComponent },

  { path: '**', redirectTo: '/Entry' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
