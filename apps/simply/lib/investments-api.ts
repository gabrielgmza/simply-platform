const API = process.env.NEXT_PUBLIC_PAYSUR_CORE_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

export interface InvestmentAccount {
  id: string;
  customerId: string;
  currency: string;
  principal: string;
  accruedYield: string;
  activatesAt: string;
  status: 'active' | 'closed';
  isActive: boolean;
  hoursToActivate: number;
}

export interface InvestmentMovement {
  id: string;
  investmentAccountId: string;
  type: 'deposit' | 'withdraw' | 'yield' | 'fee';
  amount: string;
  balanceAfter: string;
  metadata?: any;
  createdAt: string;
}

export interface CreditLine {
  currency: string;
  principal: number;
  ltvPercent: number;
  grossLine: number;
  activeLoanPrincipal: number;
  pendingInstallments: number;
  available: number;
  maxInstallments: number;
  interestRateAnnual: number;
}

export interface CreditInstallment {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amount: string;
  paidAmount: string;
  moraAmount: string;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: string;
}

export interface CreditLoan {
  id: string;
  customerId: string;
  currency: string;
  principal: string;
  interestRateAnnual: string;
  installmentsCount: number;
  installmentAmount: string;
  origin: string;
  originRef?: string | null;
  status: 'active' | 'cancelled' | 'paid' | 'liquidated';
  createdAt: string;
  closedAt?: string | null;
  installments?: CreditInstallment[];
}

export async function getInvestments(customerId: string): Promise<{ accounts: InvestmentAccount[] }> {
  const r = await fetch(`${API}/api/v1/investments/${customerId}`);
  if (!r.ok) throw new Error("Error cargando inversiones");
  return r.json();
}

export async function getInvestmentMovements(customerId: string): Promise<{ items: InvestmentMovement[] }> {
  const r = await fetch(`${API}/api/v1/investments/${customerId}/movements`);
  if (!r.ok) throw new Error("Error cargando movimientos");
  return r.json();
}

export async function depositInvestment(customerId: string, currency: string, amount: number) {
  const r = await fetch(`${API}/api/v1/investments/${customerId}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency, amount }),
  });
  if (!r.ok) throw new Error((await r.json()).message || "Error al depositar");
  return r.json();
}

export async function withdrawInvestment(customerId: string, currency: string, amount: number) {
  const r = await fetch(`${API}/api/v1/investments/${customerId}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency, amount }),
  });
  if (!r.ok) throw new Error((await r.json()).message || "Error al retirar");
  return r.json();
}

export async function getCreditLines(customerId: string, level: string = "STANDARD"): Promise<{ lines: CreditLine[] }> {
  const r = await fetch(`${API}/api/v1/credit/lines/${customerId}?level=${level}`);
  if (!r.ok) throw new Error("Error cargando línea de crédito");
  return r.json();
}

export async function getCreditLoans(customerId: string, status?: string): Promise<{ items: CreditLoan[] }> {
  const url = status
    ? `${API}/api/v1/credit/loans/${customerId}?status=${status}`
    : `${API}/api/v1/credit/loans/${customerId}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Error cargando préstamos");
  return r.json();
}

export async function createLoan(body: {
  customerId: string;
  level: string;
  currency: string;
  principal: number;
  installments: number;
  origin: string;
  originRef?: string;
}): Promise<CreditLoan> {
  const r = await fetch(`${API}/api/v1/credit/loans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json()).message || "Error creando préstamo");
  return r.json();
}

export async function payInstallment(installmentId: string, amount: number) {
  const r = await fetch(`${API}/api/v1/credit/installments/${installmentId}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!r.ok) throw new Error((await r.json()).message || "Error al pagar cuota");
  return r.json();
}
