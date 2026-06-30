import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadgerComponent } from './leadger/leadger.component';
import { FolderComponent } from './folder/folder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterTabModule } from 'src/app/shared/enter-tab/enter-tab.module';



@NgModule({
  declarations: [
    LeadgerComponent,
    FolderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnterTabModule
  ]
})
export class MasterModule { }
