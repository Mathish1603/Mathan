export interface Entry {
  sno: number;        // வ
  date: string;     // தேதி
  product: string;    // பொருள்
  referenceNo: string;      // வா.வ
  cashierNo: string;       // கே.ந
  quantity: number;       // எண்ணம்
  price: number;     // பொ.ரூபாய்
  totalprice: number; // மொ.ரூபாய்
  amount: number;     // கொ.ரூபாய்
  debit: number;    // பற்று
  balance:number;   // இருப்பு
  type?: string;
  _expIdx?: number;
}

export interface Register {
  supplier: string;
  name: string;
  bank: string;
  gst: string;
  account: string;
  gCity: string;
  pCity: string;
  bankcity: string;
  street: string;
  ifsc: string;
  state: string;
  phone: string;

  entries: Entry[];
}
