export interface Entry {
  sno: number;        // வ
  date: string;     // தேதி
  product: string;    // பொருள்
  referenceNo: string;      // வா.வ
  cashierNo: string;       // கே.ந
  quantity: number;       // எண்
  price: number;     // பொ.ரூ
  amount: number;     // கொ.ரூ
  debit: number;    // பற்று
  balance:number;   // இருப்பு
  type?: string;
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
