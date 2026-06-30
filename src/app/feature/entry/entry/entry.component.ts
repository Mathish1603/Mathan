import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from 'src/app/core/services/purchase/purchase.service';
import { FolderService } from 'src/app/core/services/folder/folder.service';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  purchaseForm!: FormGroup;

  // Dropdowns
  showDropdown = false;
  showFolderDropdown = false;
  showFolderNoDropdown = false;
  showProductDropdown = false;
  showProductDescDropdown = false;

  // Data
  suppliers: string[] = [];
  filteredSuppliers: string[] = [];

  folders: string[] = [];
  filteredFolders: string[] = [];

  folderNos: string[] = [];
  filteredFolderNos: string[] = [];

  products: string[] = [];
  filteredProducts: string[] = [];

  productDescs: string[] = [];
  filteredProductDesc: string[] = [];

  // Subjects
  private folderNoSearch$ = new Subject<string>();
  private productSearch$ = new Subject<string>();

  // ✅ FIXED VARIABLE
  isEditMode: boolean = false;
  currentProduct: string = '';

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private folderService: FolderService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getSuppliers();
    this.getFolders();
    this.getFolderNos();
    this.getProducts();
    this.getProductDescs();
    this.autoCalculation();

    // PRODUCT SEARCH
    this.productSearch$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(product => {
        if (product && product.trim().length >= 3) {
          this.fetchPurchaseByProduct(product);
        }
      });

    // FOLDER NO SEARCH
    this.folderNoSearch$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(no => {
        if (no && no.trim().length >= 3) {
          this.fetchByFolderNo(no);
        }
      });
  }

  // ================= FORM =================
  initForm() {
    this.purchaseForm = this.fb.group({
      supplier: ['', Validators.required],
      quantity: [null, Validators.required],
      folderName: ['', Validators.required],
      product: ['', Validators.required],
      productDesc: ['', Validators.required],
      minQty: [null, Validators.required],
      purchaseDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      price: [null, Validators.required],
      profit: [null, Validators.required],
      sellingPrice: [null ,Validators.required],
      folderNo: ['', Validators.required],
      mrp: [null, Validators.required],
      tax: [null, Validators.required],
    });
  }

  // ================= AUTO CALC =================
  autoCalculation() {
    this.purchaseForm.valueChanges.subscribe(val => {
      const price = Number(val?.price || 0);
      const profit = Number(val?.profit || 0);

      this.purchaseForm.patchValue(
        { sellingPrice: price + profit },
        { emitEvent: false }
      );
    });
  }


  onFolderNameInput(event: any) {
    const value = event.target.value;
    this.filterFolders();
  }
  // ================= SUPPLIER =================
  getSuppliers() {
    this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    this.filteredSuppliers = [...this.suppliers];
  }

  filterSuppliers() {
    const v = (this.purchaseForm.value.supplier || '').toLowerCase();
    this.filteredSuppliers = this.suppliers.filter(x =>
      x.toLowerCase().includes(v)
    );
    this.showDropdown = true;
  }

  selectSupplier(v: string) {
    this.purchaseForm.patchValue({ supplier: v });
    this.showDropdown = false;
  }

  // ================= FOLDER =================
  getFolders() {
    this.folders = JSON.parse(localStorage.getItem('folders') || '[]');
    this.filteredFolders = [...this.folders];
  }

  filterFolders() {
    const v = (this.purchaseForm.value.folderName || '').toLowerCase();
    this.filteredFolders = this.folders.filter(x =>
      x.toLowerCase().includes(v)
    );
  }

  selectFolder(v: string) {
    this.purchaseForm.patchValue({ folderName: v });
    this.showFolderDropdown = false;
    this.fetchByFolderName(v);
  }

  // ================= FOLDER NO =================
  getFolderNos() {
    this.folderNos = JSON.parse(localStorage.getItem('folderNos') || '[]');
    this.filteredFolderNos = [...this.folderNos];
  }

  filterFolderNos() {
    const v = (this.purchaseForm.value.folderNo || '').toLowerCase();
    this.filteredFolderNos = this.folderNos.filter(x =>
      x.toLowerCase().includes(v)
    );
  }

  selectFolderNo(v: string) {
    this.purchaseForm.patchValue({ folderNo: v });
    this.showFolderNoDropdown = false;
    this.fetchByFolderNo(v);
  }

  onFolderNoInput(event: any) {
    const value = event.target.value;
    this.filterFolderNos();
    this.folderNoSearch$.next(value);
  }

  // ================= PRODUCT =================
  getProducts() {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
    this.filteredProducts = [...this.products];
  }

  filterProducts() {
    const v = (this.purchaseForm.value.product || '').toLowerCase();
    this.filteredProducts = this.products.filter(x =>
      x.toLowerCase().includes(v)
    );
  }

  selectProduct(v: string) {
    this.purchaseForm.patchValue({ product: v });
    this.showProductDropdown = false;
    this.fetchPurchaseByProduct(v);
  }

  onProductInput(event: any) {
    const value = event.target.value;
    this.filterProducts();
    this.productSearch$.next(value);
  }

  // ================= PRODUCT DESC =================
  getProductDescs() {
    this.productDescs = JSON.parse(localStorage.getItem('productDescs') || '[]');
    this.filteredProductDesc = [...this.productDescs];
  }

  filterProductDesc() {
    const v = (this.purchaseForm.value.productDesc || '').toLowerCase();
    this.filteredProductDesc = this.productDescs.filter(x =>
      x.toLowerCase().includes(v)
    );
  }

  selectProductDesc(v: string) {
    this.purchaseForm.patchValue({ productDesc: v });
    this.showProductDescDropdown = false;
  }

  // ================= PURCHASE FETCH =================
  fetchPurchaseByProduct(product: string) {
    this.purchaseService.getByProduct(product).subscribe({
      next: (res: any) => {
        const data = res?.data?.[0];

        if (!data) {
          this.purchaseForm.enable();
          this.isEditMode = false;
          this.currentProduct = '';
          return;
        }

        // ✅ FIXED
        this.currentProduct = data.product;

        this.purchaseForm.patchValue({
          ...data,
          purchaseDate: data.purchaseDate?.split('T')[0],
          expiryDate: data.expiryDate?.split('T')[0]
        }, { emitEvent: false });

        setTimeout(() => this.purchaseForm.disable());
      },
      error: () => this.purchaseForm.enable()
    });
  }

  // ================= FOLDER SERVICE =================
  fetchByFolderNo(folderNo: string) {
    this.folderService.getFolderByNo(folderNo).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data) return;

        this.purchaseForm.patchValue({
          folderName: data.folderName,
          folderNo: data.folderNo,
          product: data.product,
          productDesc: data.productDetail,
          tax: data.tax,
          minQty: data.minQty
        }, { emitEvent: false });
      }
    });
  }

  fetchByFolderName(folderName: string) {
    this.folderService.getFolderByName(folderName).subscribe({
      next: (res: any) => {
        const data = res?.data;
        if (!data) return;

        this.purchaseForm.patchValue({
          folderName: data.folderName,
          folderNo: data.folderNo,
          product: data.product,
          productDesc: data.productDetail,
          tax: data.tax,
          minQty: data.minQty
        }, { emitEvent: false });
      }
    });
  }

  // ================= EDIT =================
  enableEdit() {
    if (!this.currentProduct) return;

    this.isEditMode = true;
    this.purchaseForm.enable();

    this.purchaseForm.get('supplier')?.disable();
    this.purchaseForm.get('folderNo')?.disable();
    this.purchaseForm.get('folderName')?.disable();
    this.purchaseForm.get('product')?.disable();
    this.purchaseForm.get('productDesc')?.disable();
    this.purchaseForm.get('minQty')?.disable();
    this.purchaseForm.get('tax')?.disable();
  }

  onSubmit() {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    const data = this.purchaseForm.getRawValue();

    if (this.isEditMode && this.currentProduct) {
      this.purchaseService.updateByProduct(this.currentProduct, data).subscribe({
        next: () => {
          alert('Updated successfully');
          this.isEditMode = false;
          this.purchaseForm.disable();
        }
      });

    } else {
      this.saveToLocal('suppliers', data.supplier);
      this.saveToLocal('folders', data.folderName);
      this.saveToLocal('folderNos', data.folderNo);
      this.saveToLocal('products', data.product);
      this.saveToLocal('productDescs', data.productDesc);

      this.purchaseService.createPurchase(data).subscribe({
        next: () => {
          alert('Saved successfully');
          this.purchaseForm.reset();
          // this.purchaseForm.disable();
          this.reloadDropdowns();
          this.getSuppliers();
        }
      });
    }
  }

  saveToLocal(key: string, value: string) {
    let list = JSON.parse(localStorage.getItem(key) || '[]');

    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }

  reloadDropdowns() {

    this.getSuppliers();

    this.getFolders();

    this.getFolderNos();

    this.getProducts();

    this.getProductDescs();
  }

  closeAllDropdowns() {

    this.showDropdown = false;

    this.showFolderDropdown = false;

    this.showFolderNoDropdown = false;

    this.showProductDropdown = false;

    this.showProductDescDropdown = false;
  }

  openSupplierDropdown() {

    this.closeAllDropdowns();

    this.showDropdown = true;
  }

  openFolderDropdown() {

    this.closeAllDropdowns();

    this.showFolderDropdown = true;
  }
  openFolderNoDropdown() {

    this.closeAllDropdowns();

    this.showFolderNoDropdown = true;
  }
  openProductDropdown() {

    this.closeAllDropdowns();

    this.showProductDropdown = true;
  }
  openProductDescDropdown() {

    this.closeAllDropdowns();

    this.showProductDescDropdown = true;
  }

  // ================= OUTSIDE CLICK =================
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const el = event.target as HTMLElement;

    if (!el.closest('.position-relative')) {
      this.showDropdown = false;
      this.showFolderDropdown = false;
      this.showFolderNoDropdown = false;
      this.showProductDropdown = false;
      this.showProductDescDropdown = false;
    }
  }
}