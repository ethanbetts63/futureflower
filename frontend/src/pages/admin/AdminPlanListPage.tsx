import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminPlans } from '@/api/admin';
import type { AdminPlan } from '@/types/AdminPlan';
import { Loader2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

// ── Types ─────────────────────────────────────────────────────────────────────

type StatusFilter = '' | 'pending_payment' | 'active' | 'completed' | 'cancelled' | 'refunded';
type PlanTypeFilter = '' | 'upfront' | 'subscription';
type SortKey = 'customer' | 'recipient' | 'plan_type' | 'status' | 'total' | 'created';
type SortDir = 'asc' | 'desc';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const TYPE_FILTERS: { value: PlanTypeFilter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'upfront', label: 'Upfront' },
  { value: 'subscription', label: 'Subscription' },
];

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending_payment: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-red-100 text-red-700',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dtStr: string): string {
  return new Date(dtStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function sortPlans(plans: AdminPlan[], key: SortKey, dir: SortDir): AdminPlan[] {
  const mul = dir === 'asc' ? 1 : -1;
  return [...plans].sort((a, b) => {
    let av = '';
    let bv = '';
    if (key === 'customer') {
      av = `${a.customer_last_name} ${a.customer_first_name}`.toLowerCase();
      bv = `${b.customer_last_name} ${b.customer_first_name}`.toLowerCase();
    } else if (key === 'recipient') {
      av = `${a.recipient_last_name ?? ''} ${a.recipient_first_name ?? ''}`.toLowerCase();
      bv = `${b.recipient_last_name ?? ''} ${b.recipient_first_name ?? ''}`.toLowerCase();
    } else if (key === 'plan_type') {
      av = a.plan_type;
      bv = b.plan_type;
    } else if (key === 'status') {
      av = a.status;
      bv = b.status;
    } else if (key === 'total') {
      return (parseFloat(a.total_amount) - parseFloat(b.total_amount)) * mul;
    } else if (key === 'created') {
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * mul;
    }
    return av.localeCompare(bv) * mul;
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status.replace('_', ' ')}
  </span>
);

const TypeBadge: React.FC<{ type: string }> = ({ type }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-black/5 text-black/60 capitalize">
    {type}
  </span>
);

const SortIcon: React.FC<{ col: SortKey; sortKey: SortKey; sortDir: SortDir }> = ({ col, sortKey, sortDir }) => {
  if (col !== sortKey) return <ChevronsUpDown className="inline h-3 w-3 ml-1 text-black/20" />;
  return sortDir === 'asc'
    ? <ChevronUp className="inline h-3 w-3 ml-1" />
    : <ChevronDown className="inline h-3 w-3 ml-1" />;
};

const FilterPills: React.FC<{
  options: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}> = ({ options, active, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(({ value, label }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
          active === value ? 'bg-black text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────

const AdminPlanListPage: React.FC = () => {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [typeFilter, setTypeFilter] = useState<PlanTypeFilter>('');
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input → activeSearch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveSearch(searchInput), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  // Fetch when filters change
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAdminPlans({
      status: statusFilter || undefined,
      plan_type: typeFilter || undefined,
      search: activeSearch || undefined,
    })
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter, typeFilter, activeSearch]);

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col);
      setSortDir('asc');
    }
  }

  const sorted = sortPlans(plans, sortKey, sortDir);

  return (
    <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
      <Seo title="Admin Plan List | FutureFlower" />
      <div className="container mx-auto max-w-5xl">
        <UnifiedSummaryCard
          title="Plans"
          description="All customer plans across every status and type."
        >
          {/* Filters */}
          <SummarySection label="Status">
            <FilterPills options={STATUS_FILTERS} active={statusFilter} onChange={(v) => setStatusFilter(v as StatusFilter)} />
          </SummarySection>

          <SummarySection label="Type">
            <FilterPills options={TYPE_FILTERS} active={typeFilter} onChange={(v) => setTypeFilter(v as PlanTypeFilter)} />
          </SummarySection>

          <SummarySection label="Search">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Customer name, email or recipient name…"
              className="w-full sm:max-w-sm px-3 py-2 text-sm border border-black/15 rounded-lg bg-white placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-black/20"
            />
          </SummarySection>

          {/* Results */}
          <SummarySection label={`Results (${plans.length})`}>
            {loading ? (
              <div className="py-8 flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-black/20" />
                <span className="text-sm text-black/40">Loading…</span>
              </div>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : sorted.length === 0 ? (
              <p className="text-sm text-black/40 italic">No plans found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-black/5">
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50"
                      onClick={() => handleSort('customer')}
                    >
                      Customer <SortIcon col="customer" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50"
                      onClick={() => handleSort('recipient')}
                    >
                      Recipient <SortIcon col="recipient" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50"
                      onClick={() => handleSort('plan_type')}
                    >
                      Type <SortIcon col="plan_type" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50"
                      onClick={() => handleSort('status')}
                    >
                      Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50 text-right"
                      onClick={() => handleSort('total')}
                    >
                      Total <SortIcon col="total" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-black/50"
                      onClick={() => handleSort('created')}
                    >
                      Created <SortIcon col="created" sortKey={sortKey} sortDir={sortDir} />
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((plan) => (
                    <TableRow key={`${plan.plan_type}-${plan.id}`} className="border-black/5">
                      <TableCell>
                        <p className="font-semibold text-black text-sm">
                          {plan.customer_first_name} {plan.customer_last_name}
                        </p>
                        <p className="text-xs text-black/40">{plan.customer_email}</p>
                      </TableCell>
                      <TableCell className="text-sm text-black">
                        {plan.recipient_first_name
                          ? `${plan.recipient_first_name} ${plan.recipient_last_name ?? ''}`
                          : <span className="text-black/30 italic">—</span>
                        }
                      </TableCell>
                      <TableCell>
                        <TypeBadge type={plan.plan_type} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={plan.status} />
                      </TableCell>
                      <TableCell className="text-sm text-black text-right">
                        ${plan.total_amount}
                      </TableCell>
                      <TableCell className="text-sm text-black/50">
                        {formatDate(plan.created_at)}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/dashboard/admin/plans/${plan.plan_type}/${plan.id}`}
                          className="text-xs px-3 py-1.5 rounded border border-black/20 hover:bg-black/5 text-black/70 whitespace-nowrap"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SummarySection>
        </UnifiedSummaryCard>
      </div>
    </div>
  );
};

export default AdminPlanListPage;
