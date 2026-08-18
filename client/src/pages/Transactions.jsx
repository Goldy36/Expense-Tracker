import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionCard from '../components/transactions/TransactionCard';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionDetailModal from '../components/transactions/TransactionDetailModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ReceiptUploader from '../components/ui/ReceiptUploader';
import { CATEGORIES, PAYMENT_METHODS } from '../data/categories';
import { Plus, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const Transactions = () => {
  const { transactions, settings, editTransaction, deleteTransaction } = useExpense();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currency = settings.currency || '₹';

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, amount_desc, amount_asc

  // Pagination & Modals
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);
  const [txToEdit, setTxToEdit] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: '',
    paymentMethod: 'UPI',
    description: '',
    notes: '',
    receipt: null
  });

  // Handle URL edit parameter (e.g. /transactions?edit=tx_01)
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const target = transactions.find(t => t.id === editId);
      if (target) {
        openEditModal(target);
        searchParams.delete('edit');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, transactions]);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description && t.description.toLowerCase().includes(q);
        const matchesNotes = t.notes && t.notes.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesNotes) return false;
      }

      // Type
      if (selectedType !== 'all' && t.type !== selectedType) return false;

      // Category
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Payment Method
      if (selectedPaymentMethod !== 'all' && t.paymentMethod !== selectedPaymentMethod) return false;

      // Date Range
      if (selectedDateRange !== 'all') {
        const d = new Date(t.date);
        const now = new Date();
        if (selectedDateRange === 'this_month') {
          if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
        } else if (selectedDateRange === 'last_month') {
          const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          if (d.getMonth() !== prevMonth || d.getFullYear() !== prevYear) return false;
        } else if (selectedDateRange === '30_days') {
          const past30 = new Date(now);
          past30.setDate(past30.getDate() - 30);
          if (d < past30) return false;
        } else if (selectedDateRange === 'this_year') {
          if (d.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory, selectedPaymentMethod, selectedDateRange, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedCategory, selectedPaymentMethod, selectedDateRange, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedPaymentMethod('all');
    setSelectedDateRange('all');
    setSortBy('date_desc');
  };

  const openEditModal = (tx) => {
    setTxToEdit(tx);
    setEditForm({
      title: tx.title || '',
      amount: tx.amount || '',
      type: tx.type || 'expense',
      category: tx.category || 'Food',
      date: tx.date || new Date().toISOString().split('T')[0],
      paymentMethod: tx.paymentMethod || 'UPI',
      description: tx.description || '',
      notes: tx.notes || '',
      receipt: tx.receipt || null
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (txToEdit) {
      editTransaction(txToEdit.id, {
        ...editForm,
        amount: Number(editForm.amount)
      });
      setTxToEdit(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transactions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, filter, and track all your income and expenses ({filteredTransactions.length} items)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort transactions"
              className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 pr-8 shadow-2xs"
            >
              <option value="date_desc">Newest Date First</option>
              <option value="date_asc">Oldest Date First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/add-expense')}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        onResetFilters={resetFilters}
      />

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No matching transactions"
          description="We couldn't find any transaction matching your active search or filter criteria."
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TransactionTable
              transactions={paginatedTransactions}
              onView={(tx) => setSelectedTx(tx)}
              onEdit={openEditModal}
              onDelete={(tx) => setTxToDelete(tx)}
              currency={currency}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {paginatedTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                onView={(tx) => setSelectedTx(tx)}
                onEdit={openEditModal}
                onDelete={(tx) => setTxToDelete(tx)}
                currency={currency}
              />
            ))}
          </div>

          {/* Pagination Toolbar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">
                Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        onEdit={openEditModal}
        onDelete={(tx) => setTxToDelete(tx)}
        currency={currency}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(txToEdit)}
        onClose={() => setTxToEdit(null)}
        title="Edit Transaction"
        maxWidth="max-w-lg"
      >
        {txToEdit && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Transaction Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Amount"
                type="number"
                prefix={currency}
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                required
              />
              <Select
                label="Transaction Type"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                options={[
                  { value: 'expense', label: 'Expense' },
                  { value: 'income', label: 'Income' }
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                options={Object.keys(CATEGORIES).map(c => ({ value: c, label: CATEGORIES[c].label }))}
              />
              <Input
                label="Date"
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              />
            </div>

            <Select
              label="Payment Method"
              value={editForm.paymentMethod}
              onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
              options={PAYMENT_METHODS.map(pm => ({ value: pm.id, label: pm.label }))}
            />

            <Input
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />

            <ReceiptUploader
              value={editForm.receipt}
              onChange={(res) => setEditForm({ ...editForm, receipt: res })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setTxToEdit(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${txToDelete?.title}"?`}
      />
    </div>
  );
};

export default Transactions;
