import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadgerService } from 'src/app/core/services/leadger/leadger.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leadger',
  templateUrl: './leadger.component.html',
  styleUrls: ['./leadger.component.css']
})
export class LeadgerComponent implements OnInit {

  form!: FormGroup;

  // dropdown
  showDropdown = false;
  suppliers: string[] = [];
  filteredSuppliers: string[] = [];
  showPersonNameDropdown = false;
  personNames: string[] = [];
  filteredPersonNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private leadgerService: LeadgerService,
    private utilsService: UtilsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliersFromLocal();
    this.loadPersonNames();
  }

  initForm() {
    this.form = this.fb.group({
      personName: ['', Validators.required],
      address: ['', Validators.required],
      supplier: ['', Validators.required],
      phone: ['', Validators.required],
      pCity: ['', Validators.required],
      state: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      accountNo: ['', Validators.required],
      bank: ['', Validators.required],
      ifsc: ['', Validators.required],
      bankcity: ['', Validators.required],
      gst: ['', Validators.required],
      gCity: ['', Validators.required]
    });
  }

  // ================= LOCAL SUPPLIER =================
  loadSuppliersFromLocal() {
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

  onSupplierInput(event: any) {
    const value = event.target.value || '';
    this.filterSuppliers();
    this.openSupplierDropdown();
  }

  openSupplierDropdown() {
    this.showDropdown = true;
  }

  filterSuppliers() {
    const value = (this.form.value.supplier || '').toLowerCase();
    this.filteredSuppliers = this.suppliers.filter(x =>
      x.toLowerCase().includes(value)
    );
  }

  selectSupplier(value: string) {
    this.form.patchValue({ supplier: value });
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.position-relative')) {
      this.showDropdown = false;
      this.showPersonNameDropdown = false;
    }
  }

  // ================= PERSON NAME DROPDOWN =================
  loadPersonNames() {
    this.utilsService.getDistinct('leadger', 'personName').subscribe({
      next: (data) => {
        this.personNames = data;
        this.filteredPersonNames = [...data];
        this.mergeExpenseNames();
      },
      error: () => {
        this.personNames = JSON.parse(localStorage.getItem('leadgerPersonNames') || '[]');
        this.filteredPersonNames = [...this.personNames];
        this.mergeExpenseNames();
      }
    });
  }

  private mergeExpenseNames() {
    this.utilsService.getDistinct('expense', 'name').subscribe({
      next: (expenseNames) => {
        const merged = [...new Set([...this.personNames, ...expenseNames])];
        this.personNames = merged;
        this.filteredPersonNames = [...merged];
      }
    });
  }

  onPersonNameInput() {
    this.filterPersonNames();
    this.openPersonNameDropdown();
  }

  openPersonNameDropdown() {
    this.showPersonNameDropdown = true;
  }

  filterPersonNames() {
    const value = (this.form.value.personName || '').toLowerCase();
    this.filteredPersonNames = this.personNames.filter(x =>
      x.toLowerCase().includes(value)
    );
  }

  selectPersonName(value: string) {
    this.form.patchValue({ personName: value });
    this.showPersonNameDropdown = false;
  }

  savePersonNameToLocal(value: string) {
    let list = JSON.parse(localStorage.getItem('leadgerPersonNames') || '[]');
    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem('leadgerPersonNames', JSON.stringify(list));
    }
  }

  // ================= SAVE LOCAL =================
  saveSupplierToLocal(value: string) {
    let list = JSON.parse(localStorage.getItem('suppliers') || '[]');

    if (value && !list.includes(value)) {
      list.push(value);
      localStorage.setItem('suppliers', JSON.stringify(list));
    }
  }

  // ================= SUBMIT =================
  onSubmit() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    // save locally for dropdown reuse
    this.saveSupplierToLocal(payload.supplier);
    this.savePersonNameToLocal(payload.personName);

    this.leadgerService.saveOrUpdate(payload).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully', '✕', { duration: 3000, verticalPosition: 'top', panelClass: ['snackbar-success'] });
        this.form.reset({
          balance: 0,
          type: 'Debit'
        });
        this.loadSuppliersFromLocal(); 
      },
      error: (err) => {
        console.error('Error saving data', err);
      }
    });
  }
}