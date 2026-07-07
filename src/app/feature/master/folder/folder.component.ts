import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FolderService } from 'src/app/core/services/folder/folder.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {

  folderForm!: FormGroup;

  // DROPDOWNS
  showFolderNameDropdown = false;
  showFolderNoDropdown = false;
  showProductDropdown = false;
  showProductDetailDropdown = false;

  // DATA
  folderNames: string[] = [];
  folderNos: string[] = [];
  products: string[] = [];
  productDetailsList: string[] = [];

  filteredFolderNames: string[] = [];
  filteredFolderNos: string[] = [];
  filteredProducts: string[] = [];
  filteredProductDetails: string[] = [];

  // SEARCH SUBJECTS
  private folderNameSearch$ = new Subject<string>();
  private folderNoSearch$ = new Subject<string>();
  private productSearch$ = new Subject<string>();
  private productDetailSearch$ = new Subject<string>();
  private folderNoFetch$ = new Subject<string>();

  currentFolderNo: string = '';

  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private folderService: FolderService,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.initForm();

    this.loadDropdowns();

    // Folder Name Search
    this.folderNameSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(v => {
        this.filterFolderNames(v);
      });

    // Folder No Search
    this.folderNoSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(v => {
        this.filterFolderNos(v);
      });

    // Product Search
    this.productSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(v => {
        this.filterProducts(v);
      });

    // Product Detail Search
    this.productDetailSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(v => {
        this.filterProductDetails(v);
      });

    // Fetch Folder By No
    this.folderNoFetch$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(no => {

        if (no && no.trim() !== '') {

          this.fetchFolderByNo(no);
        }
      });
  }

  // =========================
  // FORM INIT
  // =========================

  initForm() {

    this.folderForm = this.fb.group({

      folderName: ['', Validators.required],

      folderNo: ['', Validators.required],

      product: ['', Validators.required],

      productDetail: ['', Validators.required],

      minQty: ['', Validators.required],

      hsn: ['', Validators.required],

      sales: ['', Validators.required],

      tax: ['', Validators.required]

    });
  }

  // =========================
  // CLOSE ALL DROPDOWNS
  // =========================

  closeAllDropdowns() {

    this.showFolderNameDropdown = false;

    this.showFolderNoDropdown = false;

    this.showProductDropdown = false;

    this.showProductDetailDropdown = false;
  }

  // =========================
  // LOAD DROPDOWNS
  // =========================

  loadDropdowns() {
    this.utilsService.getDistinct('folder', 'folderName').subscribe({
      next: (data) => {
        this.folderNames = data;
        this.filteredFolderNames = [...data];
        localStorage.setItem('folderNames', JSON.stringify(data));
      },
      error: () => {
        this.folderNames = JSON.parse(localStorage.getItem('folderNames') || '[]');
        this.filteredFolderNames = [...this.folderNames];
      }
    });
    this.utilsService.getDistinct('folder', 'folderNo').subscribe({
      next: (data) => {
        this.folderNos = data;
        this.filteredFolderNos = [...data];
        localStorage.setItem('folderNos', JSON.stringify(data));
      },
      error: () => {
        this.folderNos = JSON.parse(localStorage.getItem('folderNos') || '[]');
        this.filteredFolderNos = [...this.folderNos];
      }
    });
    this.utilsService.getDistinct('folder', 'product').subscribe({
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
    this.utilsService.getDistinct('folder', 'productDetail').subscribe({
      next: (data) => {
        this.productDetailsList = data;
        this.filteredProductDetails = [...data];
        localStorage.setItem('productDetails', JSON.stringify(data));
      },
      error: () => {
        this.productDetailsList = JSON.parse(localStorage.getItem('productDetails') || '[]');
        this.filteredProductDetails = [...this.productDetailsList];
      }
    });
  }

  // =========================
  // SAVE DROPDOWN VALUES
  // =========================

  saveDropdownValues(data: any) {

    // Folder Name
    if (
      data.folderName &&
      !this.folderNames.includes(data.folderName)
    ) {

      this.folderNames.push(data.folderName);

      localStorage.setItem(
        'folderNames',
        JSON.stringify(this.folderNames)
      );
    }

    // Folder No
    if (
      data.folderNo &&
      !this.folderNos.includes(data.folderNo)
    ) {

      this.folderNos.push(data.folderNo);

      localStorage.setItem(
        'folderNos',
        JSON.stringify(this.folderNos)
      );
    }

    // Product
    if (
      data.product &&
      !this.products.includes(data.product)
    ) {

      this.products.push(data.product);

      localStorage.setItem(
        'products',
        JSON.stringify(this.products)
      );
    }

    // Product Detail
    if (
      data.productDetail &&
      !this.productDetailsList.includes(data.productDetail)
    ) {

      this.productDetailsList.push(data.productDetail);

      localStorage.setItem(
        'productDetails',
        JSON.stringify(this.productDetailsList)
      );
    }

    this.loadDropdowns();
  }

  // =========================
  // INPUT EVENTS
  // =========================

  onFolderNameInput(event: any) {

    this.closeAllDropdowns();

    this.showFolderNameDropdown = true;

    this.folderNameSearch$.next(event.target.value);
  }

  onFolderNoInput(event: any) {

    const value = event.target.value;

    this.closeAllDropdowns();

    this.showFolderNoDropdown = true;

    this.folderNoSearch$.next(value);

    this.folderNoFetch$.next(value);
  }

  onProductInput(event: any) {

    this.closeAllDropdowns();

    this.showProductDropdown = true;

    this.productSearch$.next(event.target.value);
  }

  onProductDetailInput(event: any) {

    this.closeAllDropdowns();

    this.showProductDetailDropdown = true;

    this.productDetailSearch$.next(event.target.value);
  }

  // =========================
  // FILTERS
  // =========================

  filterFolderNames(v: string) {

    this.filteredFolderNames =
      this.folderNames.filter(x =>
        x.toLowerCase().includes(v.toLowerCase())
      );
  }

  filterFolderNos(v: string) {

    this.filteredFolderNos =
      this.folderNos.filter(x =>
        x.toLowerCase().includes(v.toLowerCase())
      );
  }

  filterProducts(v: string) {

    this.filteredProducts =
      this.products.filter(x =>
        x.toLowerCase().includes(v.toLowerCase())
      );
  }

  filterProductDetails(v: string) {

    this.filteredProductDetails =
      this.productDetailsList.filter(x =>
        x.toLowerCase().includes(v.toLowerCase())
      );
  }

  // =========================
  // SELECT VALUES
  // =========================

  selectFolderName(v: string) {

    this.folderForm.patchValue({
      folderName: v
    });

    this.closeAllDropdowns();
  }

  selectFolderNo(v: string) {

    this.folderForm.patchValue({
      folderNo: v
    });

    this.closeAllDropdowns();

    this.folderNoFetch$.next(v);
  }

  selectProduct(v: string) {

    this.folderForm.patchValue({
      product: v
    });

    this.closeAllDropdowns();
  }

  selectProductDetail(v: string) {

    this.folderForm.patchValue({
      productDetail: v
    });

    this.closeAllDropdowns();
  }

  // =========================
  // FETCH FOLDER
  // =========================

  fetchFolderByNo(folderNo: string) {

    this.folderService.getFolderByNo(folderNo).subscribe({

      next: (res: any) => {

        const data = res?.data;

        if (!data) {

          this.isEditMode = false;

          this.currentFolderNo = '';

          this.folderForm.enable();

          return;
        }

        this.isEditMode = false;

        this.currentFolderNo = data.folderNo;

        this.folderForm.patchValue({

          folderName: data.folderName,

          folderNo: data.folderNo,

          product: data.product,

          productDetail: data.productDetail,

          minQty: data.minQty,

          hsn: data.hsn,

          sales: data.sales,

          tax: data.tax

        });

        // Disable Form
        this.folderForm.disable();

        // Enable searchable field
        this.folderForm.get('folderNo')?.enable();

        this.cdr.detectChanges();
      },

      error: () => {

        this.isEditMode = false;

        this.currentFolderNo = '';

        this.folderForm.enable();
      }
    });
  }

  // =========================
  // ENABLE EDIT
  // =========================

  enableEdit() {

    if (!this.currentFolderNo) return;

    this.isEditMode = true;

    this.folderForm.enable();

    // Disable key field
    this.folderForm.get('folderNo')?.disable();
  }

  // =========================
  // SUBMIT
  // =========================

  onSubmit() {

    if (this.folderForm.invalid) {

      this.folderForm.markAllAsTouched();

      return;
    }

    const data = this.folderForm.getRawValue();

    // UPDATE
    if (this.isEditMode && this.currentFolderNo) {

      this.folderService
        .updateFolder(this.currentFolderNo, data)
        .subscribe({

          next: () => {

            this.saveDropdownValues(data);

            this.snackBar.open('Updated successfully', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-success'] });

            this.fetchFolderByNo(this.currentFolderNo);
          },

          error: () => {

            this.snackBar.open('Update failed', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-error'] });
          }
        });
    }

    // SAVE
    else {

      this.folderService
        .addFolder(data)
        .subscribe({

          next: () => {

            this.saveDropdownValues(data);

            this.snackBar.open('Saved successfully', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-success'] });

            this.resetForm();
          },

          error: () => {

            this.snackBar.open('Save failed', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-error'] });
          }
        });
    }
  }

  // =========================
  // RESET
  // =========================

  resetForm() {

    this.folderForm.reset();

    this.isEditMode = false;

    this.currentFolderNo = '';

    this.folderForm.enable();

    this.loadDropdowns();

    this.closeAllDropdowns();
  }

  // =========================
  // OUTSIDE CLICK
  // =========================

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {

    const el = event.target as HTMLElement;

    if (!el.closest('.position-relative')) {

      this.closeAllDropdowns();
    }
  }
}