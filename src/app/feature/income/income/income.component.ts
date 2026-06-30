import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from 'src/app/core/services/income/income.service';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {

  incomeForm!: FormGroup;

  showDropdown = false;
  showNameDropdown = false;

  suppliers: string[] = [];
  filteredSuppliers: string[] = [];

  names: string[] = [];
  filteredNames: string[] = [];

  private supplierSearch$ = new Subject<string>();
  private nameSearch$ = new Subject<string>();

  isEditMode = false;
  currentSupplier = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadNames();
    this.loadSuppliers();

    this.supplierSearch$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        if (value) this.getIncomeBySupplier(value);
      });

    this.nameSearch$
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(value => this.filterNames(value));
  }

  initForm() {
    this.incomeForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      supplier: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      description: ['', Validators.required],
      referenceNo: ['', Validators.required],
      cashierNo: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  // ================= SUPPLIER =================

  loadSuppliers() {
    this.suppliers = JSON.parse(localStorage.getItem('incomeSuppliers') || '[]');
    this.filteredSuppliers = [...this.suppliers];
  }

  onSupplierInput(event: any) {
    const value = event.target.value || '';

    this.showDropdown = true;

    this.filteredSuppliers = this.suppliers.filter(s =>
      s.toLowerCase().includes(value.toLowerCase())
    );

    this.supplierSearch$.next(value);
  }

  selectSupplier(value: string) {
    this.currentSupplier = value;

    this.incomeForm.patchValue({ supplier: value });
    this.showDropdown = false;

    this.getIncomeBySupplier(value);
  }

  getIncomeBySupplier(supplier: string) {
    this.loading = true;
    this.incomeService.getIncomeBySupplier(supplier).subscribe({
      next: (res) => {

        if (res.success && res.data.length > 0) {

          const income = res.data[0];

          const formattedDate = income.date
            ? new Date(income.date).toISOString().split('T')[0]
            : '';

          this.incomeForm.patchValue({
            date: formattedDate,
            type: income.type,
            name: income.name,
            supplier: income.supplier,
            paymentMethod: income.paymentMethod,
            description: income.description,
            referenceNo: income.referenceNo,
            cashierNo: income.cashierNo,
            amount: income.amount
          });

          this.currentSupplier = income.supplier;

          this.isEditMode = false;

          this.incomeForm.disable();

          this.incomeForm.get('supplier')?.enable();

        } else {
          this.isEditMode = false;
        }

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        console.error('Fetch failed');
      }
    });
  }

  saveSupplierToLocal(value: string) {
    let list = JSON.parse(localStorage.getItem('incomeSuppliers') || '[]');

    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem('incomeSuppliers', JSON.stringify(list));
    }
  }

  // ================= NAME =================

  loadNames() {
    this.names = JSON.parse(localStorage.getItem('incomeNames') || '[]');
    this.filteredNames = [...this.names];
  }

  onNameInput(event: any) {
    const value = event.target.value || '';

    this.showNameDropdown = true;

    this.nameSearch$.next(value);
  }

  filterNames(value: string) {
    const v = value.toLowerCase();

    this.filteredNames = this.names.filter(n =>
      n.toLowerCase().includes(v)
    );

    if (value && !this.names.includes(value)) {
      this.filteredNames.unshift(value);
    }
  }

  selectName(name: string) {
    this.incomeForm.patchValue({ name });
    this.showNameDropdown = false;
  }

  saveNameToLocal(value: string) {
    let list = JSON.parse(localStorage.getItem('incomeNames') || '[]');

    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem('incomeNames', JSON.stringify(list));
    }
  }

  // ================= EDIT =================

  enableEdit() {

    if (!this.currentSupplier) return;

    this.isEditMode = true;

    this.incomeForm.enable();

    this.incomeForm.get('supplier')?.disable();
  }

  // ================= SUBMIT =================

  onSubmit() {

    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      return;
    }

    const data = {
      ...this.incomeForm.getRawValue(),
      amount: Number(this.incomeForm.getRawValue().amount)
    };

    // UPDATE
    if (this.currentSupplier && this.isEditMode) {

      this.incomeService.updateIncome(this.currentSupplier, data)
        .subscribe({
          next: () => {
            alert('Updated successfully');
            this.resetForm();
          },
          error: () => alert('Update failed')
        });

    } else {

      // SAVE
      this.saveNameToLocal(data.name);
      this.saveSupplierToLocal(data.supplier);

      this.incomeService.addIncome(data)
        .subscribe({
          next: () => {
            alert('Saved successfully');
            this.resetForm();
          },
          error: () => alert('Save failed')
        });
    }
  }

  // ================= RESET =================

  resetForm() {
    this.incomeForm.reset();

    this.isEditMode = false;

    this.currentSupplier = '';

    this.incomeForm.enable();
  }

  // ================= CLOSE DROPDOWN =================

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {

    const el = event.target as HTMLElement;

    if (!el.closest('.position-relative')) {
      this.showDropdown = false;
      this.showNameDropdown = false;
    }
  }

} 