import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIES } from '../../data/categories';

const CreateBudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  budgetToEdit = null,
  currency = '₹'
}) => {
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [startDate, setStartDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category || 'Food');
      setLimit(budgetToEdit.limit || '');
      setStartDate(budgetToEdit.startDate || '');
      setEndDate(budgetToEdit.endDate || '');
    } else {
      setCategory('Food');
      setLimit('');
      setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
      setEndDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
    }
    setError('');
  }, [budgetToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limit || Number(limit) <= 0) {
      setError('Please enter a valid monthly limit amount');
      return;
    }

    onSubmit({
      ...(budgetToEdit ? { id: budgetToEdit.id } : {}),
      category,
      limit: Number(limit),
      startDate,
      endDate
    });
    onClose();
  };

  const categoryOptions = Object.keys(CATEGORIES)
    .filter(cat => cat !== 'Income')
    .map(cat => ({ value: cat, label: CATEGORIES[cat].label }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Edit Category Budget' : 'Create Category Budget'}
      subtitle="Set spending limits for individual expense categories"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Select */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          disabled={Boolean(budgetToEdit)}
        />

        {/* Monthly Limit */}
        <Input
          label="Monthly Spending Limit"
          type="number"
          prefix={currency}
          placeholder="e.g. 5000"
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
            setError('');
          }}
          error={error}
          min="1"
          step="100"
          required
        />

        {/* Start & End Date */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {budgetToEdit ? 'Update Budget' : 'Set Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBudgetModal;
