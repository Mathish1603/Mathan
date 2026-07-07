import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from 'src/app/core/services/expense/expense.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
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
  showRefDropdown = false;
  showProductDropdown = false;
  showProductDescDropdown = false;

  suppliers: string[] = [];
  filteredSuppliers: string[] = [];

  names: string[] = [];
  filteredNames: string[] = [];

  referenceNos: string[] = [];
  filteredReferenceNos: string[] = [];

  products: string[] = [];
  filteredProducts: string[] = [];

  productDescs: string[] = [];
  filteredProductDesc: string[] = [];

  private supplierSearch$ = new Subject<string>();
  private nameSearch$ = new Subject<string>();
  private refSearch$ = new Subject<string>();

  isEditMode = false;
  currentReferenceNo = '';
  loading = false;

  constructor(private fb: FormBuilder, private expenseService: ExpenseService, private snackBar: MatSnackBar, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadNames();
    this.loadSuppliers();
    this.loadReferenceNos();
    this.loadProducts();
    this.loadProductDescs();
    this.supplierSearch$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterSuppliers(value);
      });

    this.nameSearch$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterNames(value);
      });

    this.refSearch$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterReferenceNos(value);
        if (value) {
          this.getExpenseByReferenceNo(value);
        }
      });

    this.expenseForm.get('type')?.valueChanges.subscribe(val => {
      if (val === 'பற்று') {
        this.expenseForm.patchValue({ amount: 0 });
        this.expenseForm.get('paymentMethod')?.disable();
        this.expenseForm.get('amount')?.disable();
        this.expenseForm.get('description')?.disable();
      } else {
        this.expenseForm.get('paymentMethod')?.enable();
        this.expenseForm.get('amount')?.enable();
      }
    });

    this.expenseForm.get('supplier')?.valueChanges.subscribe(supplier => {
      this.loadProductsBySupplier(supplier || '');
    });
  }

  initForm() {

    this.expenseForm = this.fb.group({

      name: ['', Validators.required],

      date: ['', Validators.required],

      type: ['', Validators.required],

      supplier: ['', Validators.required],

      paymentMethod: [''],

      description: [''],

      product: [''],

      referenceNo: ['', Validators.required],

      cashierNo: ['', Validators.required],

      amount: ['', Validators.required]

    });
  }

  loadSuppliers() {
    this.utilsService.getDistinct('purchase', 'supplier').subscribe({
      next: (data) => {
        this.suppliers = data;
        this.filteredSuppliers = [...data];
        localStorage.setItem('suppliers', JSON.stringify(data));
      },
      error: () => {
        this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        this.filteredSuppliers = [...this.suppliers];
      }
    });
  }

  loadNames() {
    this.utilsService.getDistinct('expense', 'name').subscribe({
      next: (data) => {
        this.names = data;
        this.filteredNames = [...data];
        localStorage.setItem('names', JSON.stringify(data));
      },
      error: () => {
        this.names = JSON.parse(localStorage.getItem('names') || '[]');
        this.filteredNames = [...this.names];
      }
    });
  }

  loadReferenceNos() {
    this.utilsService.getDistinct('expense', 'referenceNo').subscribe({
      next: (data) => {
        this.referenceNos = data;
        this.filteredReferenceNos = [...data];
        localStorage.setItem('expenseRefs', JSON.stringify(data));
      },
      error: () => {
        this.referenceNos = JSON.parse(localStorage.getItem('expenseRefs') || '[]');
        this.filteredReferenceNos = [...this.referenceNos];
      }
    });
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

  saveReferenceNoToLocal(value: string) {

    let list =
      JSON.parse(localStorage.getItem('expenseRefs') || '[]');

    value = value?.trim();

    if (value && !list.includes(value)) {

      list.push(value);

      localStorage.setItem(
        'expenseRefs',
        JSON.stringify(list)
      );

      this.referenceNos = [...list];
      this.filteredReferenceNos = [...list];
    }
  }

  saveToLocal(key: string, value: string) {
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    value = value?.trim();
    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }

  loadProducts() {
    this.loadProductsBySupplier(this.expenseForm?.get('supplier')?.value || '');
  }

  loadProductsBySupplier(supplier: string) {
    if (!supplier || supplier.trim() === '') {
      this.utilsService.getDistinct('purchase', 'product').subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = [...data];
          localStorage.setItem('products', JSON.stringify(data));
        },
        error: () => {
          this.products = JSON.parse(localStorage.getItem('products') || '[]');
          this.filteredProducts = [...this.products];
        }
      });
      return;
    }
    this.utilsService.getDistinct('purchase', 'product', { supplier }).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data];
      },
      error: () => {
        this.products = JSON.parse(localStorage.getItem('products') || '[]');
        this.filteredProducts = [...this.products];
      }
    });
  }

  loadProductDescs() {
    this.utilsService.getDistinct('purchase', 'productDesc').subscribe({
      next: (data) => {
        this.productDescs = data;
        this.filteredProductDesc = [...data];
        localStorage.setItem('productDescs', JSON.stringify(data));
      },
      error: () => {
        this.productDescs = JSON.parse(localStorage.getItem('productDescs') || '[]');
        this.filteredProductDesc = [...this.productDescs];
      }
    });
  }


  onRefInput(event: any) {

    const value = event.target.value || '';

    this.filterReferenceNos(value);

    this.openRefDropdown();
    this.refSearch$.next(value);
  }

  filterReferenceNos(value: string) {

    const v = value.toLowerCase();

    this.filteredReferenceNos =
      this.referenceNos.filter(r =>
        r.toLowerCase().includes(v)
      );

    if (value && !this.referenceNos.includes(value)) {

      this.filteredReferenceNos.unshift(value);
    }
  }

  selectReferenceNo(value: string) {

    this.currentReferenceNo = value;

    this.expenseForm.patchValue({
      referenceNo: value
    });

    this.showRefDropdown = false;

    this.getExpenseByReferenceNo(value);
  }

  onSupplierInput(event: any) {

    const value = event.target.value || '';

    this.filterSuppliers(value);

    this.openSupplierDropdown();
    this.supplierSearch$.next(value);
  }

  filterSuppliers(value: string) {

    const v = value.toLowerCase();

    this.filteredSuppliers =
      this.suppliers.filter(s =>
        s.toLowerCase().includes(v)
      );
  }

  selectSupplier(value: string) {

    this.expenseForm.patchValue({
      supplier: value
    });

    this.showDropdown = false;
  }

  onNameInput(event: any) {

    const value = event.target.value || '';

    this.filterNames(value);

    this.openNameDropdown();

    this.nameSearch$.next(value);
  }

  filterNames(value: string) {

    const v = value.toLowerCase();

    this.filteredNames =
      this.names.filter(n =>
        n.toLowerCase().includes(v)
      );
  }

  selectName(name: string) {

    this.expenseForm.patchValue({
      name
    });

    this.showNameDropdown = false;
  }

  onProductInput(event: any) {
    const value = event.target.value || '';
    this.filterProducts(value);
    this.openProductDropdown();
  }

  filterProducts(value: string) {
    const v = value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.toLowerCase().includes(v)
    );
  }

  selectProduct(value: string) {
    this.expenseForm.patchValue({ product: value });
    this.showProductDropdown = false;
  }

  onProductDescInput(event: any) {
    const value = event.target.value || '';
    this.filterProductDesc(value);
    this.openProductDescDropdown();
  }

  filterProductDesc(value: string) {
    const v = value.toLowerCase();
    this.filteredProductDesc = this.productDescs.filter(d =>
      d.toLowerCase().includes(v)
    );
  }

  selectProductDesc(value: string) {
    this.expenseForm.patchValue({ productDesc: value });
    this.showProductDescDropdown = false;
  }

  getExpenseByReferenceNo(refNo: string) {

    this.loading = true;

    this.expenseService
      .getByReferenceNo(refNo)
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

              product: exp.product || '',

              productDesc: exp.productDesc || '',

              referenceNo: exp.referenceNo,

              cashierNo: exp.cashierNo,

              amount: exp.amount
            });

            this.currentReferenceNo = exp.referenceNo;

            this.isEditMode = false;

            this.expenseForm.disable();

            this.expenseForm
              .get('referenceNo')
              ?.enable();

          } else {

            this.isEditMode = false;

            this.currentReferenceNo = '';

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
    if (!this.currentReferenceNo) return;
    this.isEditMode = true;
    this.expenseForm.enable();
    this.expenseForm.get('referenceNo')?.disable();
    if (this.expenseForm.get('type')?.value === 'பற்று') {
      this.expenseForm.get('paymentMethod')?.disable();
      this.expenseForm.get('amount')?.disable();
    }
  }

  onSubmit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }
    const data = this.expenseForm.getRawValue();

    this.saveNameToLocal(data.name);
    this.saveSupplierToLocal(data.supplier);
    this.saveReferenceNoToLocal(data.referenceNo);
    this.saveToLocal('products', data.product);
    this.saveToLocal('productDescs', data.productDesc);

    if (this.isEditMode && this.currentReferenceNo) {
      this.expenseService
        .updateExpenseByReferenceNo(this.currentReferenceNo, data)
        .subscribe({
          next: () => {
            this.snackBar.open('Updated successfully', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-success'] });
            this.resetForm();
          },
          error: () => {
            this.snackBar.open('Update failed', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-error'] });
          }
        });
    } else {
      this.expenseService
        .addExpense(data)
        .subscribe({
          next: () => {
            this.snackBar.open('Saved successfully', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-success'] });
            this.resetForm();
          },
          error: () => {
            this.snackBar.open('Save failed', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-error'] });
          }
        });
    }
  }

  resetForm() {
    this.expenseForm.reset();
    this.isEditMode = false;
    this.currentReferenceNo = '';
    this.expenseForm.enable();
    this.loadNames();
    this.loadSuppliers();
    this.loadReferenceNos();
    this.loadProducts();
    this.loadProductDescs();
  }

  closeAllDropdowns() {
    this.showDropdown = false;
    this.showNameDropdown = false;
    this.showRefDropdown = false;
    this.showProductDropdown = false;
    this.showProductDescDropdown = false;
  }

  openSupplierDropdown() {
    this.closeAllDropdowns();
    this.showDropdown = true;
  }

  openNameDropdown() {
    this.closeAllDropdowns();
    this.showNameDropdown = true;
  }

  openRefDropdown() {
    this.closeAllDropdowns();
    this.showRefDropdown = true;
  }

  openProductDropdown() {
    this.closeAllDropdowns();
    this.showProductDropdown = true;
  }

  openProductDescDropdown() {
    this.closeAllDropdowns();
    this.showProductDescDropdown = true;
  }



  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.position-relative')) {
      this.showDropdown = false;
      this.showNameDropdown = false;
      this.showRefDropdown = false;
      this.showProductDropdown = false;
      this.showProductDescDropdown = false;
    }
  }

}
