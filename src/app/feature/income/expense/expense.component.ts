import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/core/services/expense/expense.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  expenseForm!: FormGroup;

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

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadNames();
    this.loadSuppliers();
    this.supplierSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterSuppliers(value);
        if (value) {
          this.getExpenseBySupplier(value);
        }
      });

    this.nameSearch$
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterNames(value);
      });
  }

  initForm() {

    this.expenseForm = this.fb.group({

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

  loadSuppliers() {

    this.suppliers =
      JSON.parse(localStorage.getItem('suppliers') || '[]');

    this.filteredSuppliers = [...this.suppliers];
  }

  loadNames() {

    this.names =
      JSON.parse(localStorage.getItem('names') || '[]');

    this.filteredNames = [...this.names];
  }


  saveSupplierToLocal(value: string) {

    let list =
      JSON.parse(localStorage.getItem('suppliers') || '[]');

    value = value?.trim();

    if (value && !list.includes(value)) {

      list.push(value);

      localStorage.setItem(
        'suppliers',
        JSON.stringify(list)
      );

      this.suppliers = [...list];
      this.filteredSuppliers = [...list];
    }
  }

  saveNameToLocal(value: string) {

    let list =
      JSON.parse(localStorage.getItem('names') || '[]');

    value = value?.trim();

    if (value && !list.includes(value)) {

      list.push(value);

      localStorage.setItem(
        'names',
        JSON.stringify(list)
      );

      this.names = [...list];
      this.filteredNames = [...list];
    }
  }


  onSupplierInput(event: any) {

    const value = event.target.value || '';

    this.openSupplierDropdown();
    this.supplierSearch$.next(value);
  }

  filterSuppliers(value: string) {

    const v = value.toLowerCase();

    this.filteredSuppliers =
      this.suppliers.filter(s =>
        s.toLowerCase().includes(v)
      );

    if (value && !this.suppliers.includes(value)) {

      this.filteredSuppliers.unshift(value);
    }
  }

  selectSupplier(value: string) {

    this.currentSupplier = value;

    this.expenseForm.patchValue({
      supplier: value
    });

    this.showDropdown = false;

    this.getExpenseBySupplier(value);
  }


  onNameInput(event: any) {

    const value = event.target.value || '';

    this.openNameDropdown();

    this.nameSearch$.next(value);
  }

  filterNames(value: string) {

    const v = value.toLowerCase();

    this.filteredNames =
      this.names.filter(n =>
        n.toLowerCase().includes(v)
      );

    if (value && !this.names.includes(value)) {

      this.filteredNames.unshift(value);
    }
  }

  selectName(name: string) {

    this.expenseForm.patchValue({
      name
    });

    this.showNameDropdown = false;
  }


  getExpenseBySupplier(supplier: string) {

    this.loading = true;

    this.expenseService
      .getBySupplier(supplier)
      .subscribe({

        next: (res) => {

          if (res.success && res.data.length > 0) {

            const exp = res.data[0];

            const formattedDate = exp.date
              ? new Date(exp.date)
                .toISOString()
                .split('T')[0]
              : '';

            this.expenseForm.patchValue({

              date: formattedDate,

              type: exp.type,

              name: exp.name,

              supplier: exp.supplier,

              paymentMethod: exp.paymentMethod,

              description: exp.description,

              referenceNo: exp.referenceNo,

              cashierNo: exp.cashierNo,

              amount: exp.amount
            });

            this.currentSupplier = exp.supplier;

            this.isEditMode = false;

            this.expenseForm.disable();

            this.expenseForm
              .get('supplier')
              ?.enable();

          } else {

            this.isEditMode = false;

            this.currentSupplier = '';

            this.expenseForm.enable();
          }

          this.loading = false;
        },

        error: () => {
          this.loading = false;
          console.error('Fetch failed');
        }

      });
  }

  enableEdit() {
    if (!this.currentSupplier) return;
    this.isEditMode = true;
    this.expenseForm.enable();
    this.expenseForm.get('supplier')?.disable();
  }

  onSubmit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
    const data = this.expenseForm.getRawValue();

    if (this.currentSupplier && this.isEditMode) {

      this.expenseService
        .updateExpense(this.currentSupplier, data)
        .subscribe({
          next: () => {
            this.saveNameToLocal(data.name);
            alert('Updated successfully');
            this.resetForm();
          },
          error: () => {
            alert('Update failed');
          }
        });
    }
    else {
      this.saveNameToLocal(data.name);
      this.expenseService
        .addExpense(data)
        .subscribe({
          next: () => {
            alert('Saved successfully');
            this.resetForm();
          },
          error: () => {
            alert('Save failed');
          }
        });
    }
  }

  resetForm() {
    this.expenseForm.reset();
    this.isEditMode = false;
    this.currentSupplier = '';
    this.expenseForm.enable();
    this.loadNames();
    this.loadSuppliers();
  }

  closeAllDropdowns() {
    this.showDropdown = false;
    this.showNameDropdown = false;
  }

  openSupplierDropdown() {
    this.closeAllDropdowns();
    this.showDropdown = true;
  }

  openNameDropdown() {
    this.closeAllDropdowns();
    this.showNameDropdown = true;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.position-relative')) {
      this.showDropdown = false;
      this.showNameDropdown = false;
    }
  }

}