import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadgerService } from 'src/app/core/services/leadger/leadger.service';

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

  constructor(
    private fb: FormBuilder,
    private leadgerService: LeadgerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliersFromLocal(); 
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
    this.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    this.filteredSuppliers = [...this.suppliers];
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

    // save supplier locally for dropdown reuse
    this.saveSupplierToLocal(payload.supplier);

    this.leadgerService.saveOrUpdate(payload).subscribe({
      next: () => {
        alert('Saved successfully');
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