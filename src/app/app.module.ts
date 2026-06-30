import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterModule } from './feature/master/master.module';
import { EntryModule } from './feature/entry/entry.module';
import { ReportModule } from './feature/report/report.module';
import { IncomeModule } from './feature/income/income.module';
import { HttpClientModule } from '@angular/common/http';
import { EnterTabDirective } from './core/dirctive/enter-tab.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MasterModule,IncomeModule,
    EntryModule,
    ReportModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
