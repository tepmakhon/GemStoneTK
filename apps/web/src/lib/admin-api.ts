const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:4000/api/v1';

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const error = new Error(response.status === 401 ? 'Your administrator session has expired.' : 'The admin service could not complete this request.') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}

export type AdminIdentity = { id: string; email: string; fullName: string; role: string };
export type AdminOverview = {
  products: { total: number; active: number; unitsOnHand: number; availableUnits: number; reservedUnits: number };
  orders: { total: number; pending: number; completed: number };
  payments: { verifiedCount: number };
  recentActivity: Array<{ id: string; action: string; entityType: string; entityId: string | null; actor: string; createdAt: string }>;
};
export type AdminProduct = {
  id: string; sku: string; name: string; status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'; pricingMethod: 'FIXED' | 'NEGOTIABLE' | 'CONTACT';
  price: string | null; currency: string; onHand: number; reserved: number; categories: string[]; updatedAt: string;
};
