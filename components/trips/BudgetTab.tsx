'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plane, Hotel, Zap, Utensils, MoreHorizontal, X, Plus, AlertCircle, Download, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  Transport: '#B08968', // gold
  Stay: '#606C38',      // forest
  Activities: '#7F5539',// gold-dark
  Meals: '#8B8175',     // muted
  Misc: '#D8CBB8',      // light
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Transport: <Plane size={16} />,
  Stay: <Hotel size={16} />,
  Activities: <Zap size={16} />,
  Meals: <Utensils size={16} />,
  Misc: <MoreHorizontal size={16} />,
};

export default function BudgetTab({ trip, isOwner }: { trip: any, isOwner: boolean }) {
  const [expenses, setExpenses] = useState<any[]>(trip.expenses || []);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('All');
  
  // New expense state
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(trip.startDate ? format(new Date(trip.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [stopId, setStopId] = useState('');

  const totalBudget = trip.budget || 0;
  const spentSoFar = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - spentSoFar;
  const days = trip.startDate && trip.endDate ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))) : 1;
  const avgCostPerDay = spentSoFar / days;

  const pieData = useMemo(() => {
    const sums: Record<string, number> = {};
    expenses.forEach(e => {
      sums[e.category] = (sums[e.category] || 0) + e.amount;
    });
    return Object.entries(sums).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    if (!trip.stops) return [];
    const stopData = trip.stops.map((stop: any) => {
      const stopExpenses = expenses.filter(e => e.stopId === stop.id);
      const data: any = { name: stop.cityName };
      stopExpenses.forEach(e => {
        data[e.category] = (data[e.category] || 0) + e.amount;
      });
      return data;
    });
    return stopData;
  }, [expenses, trip.stops]);

  const filteredExpenses = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    try {
      const res = await fetch(`/api/trips/${trip.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          amount: parseFloat(amount),
          date,
          stopId: stopId || null
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses([...expenses, data.expense].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setIsAdding(false);
        setDescription('');
        setAmount('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/trips/${trip.id}/expenses/${id}`, { method: 'DELETE' });
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (type: string) => {
    alert(`${type} generation coming soon!`);
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Over Budget Warning */}
      {remaining < 0 && (
        <div className="bg-error/10 border border-error text-error rounded-[12px] p-4 flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">⚠️ You're ${Math.abs(remaining).toLocaleString()} over budget for this trip!</span>
        </div>
      )}

      {/* Top Summary Row */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gold/20">
            <p className="text-sm text-earth-muted mb-1 font-medium">Total Budget</p>
            <p className="font-serif italic text-[42px] text-gold leading-none">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-earth/10">
            <p className="text-sm text-earth-muted mb-1 font-medium">Spent So Far</p>
            <p className={`font-serif italic text-[42px] leading-none ${spentSoFar > totalBudget ? 'text-error' : 'text-earth'}`}>
              ${spentSoFar.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-forest/20">
            <p className="text-sm text-earth-muted mb-1 font-medium">Remaining</p>
            <p className={`font-serif italic text-[42px] leading-none ${remaining < 0 ? 'text-error' : 'text-forest'}`}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-earth-muted mt-4 ml-2">Avg cost per day: <span className="font-semibold text-earth">${Math.round(avgCostPerDay).toLocaleString()}</span></p>
      </div>

      {/* Charts Row */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-earth/10">
            <h3 className="font-serif italic text-xl text-earth mb-6">Spending Breakdown</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-earth/10">
            <h3 className="font-serif italic text-xl text-earth mb-6">Spending by Stop</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#8B8175" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#8B8175" />
                  <Tooltip formatter={(value: any) => `$${value}`} cursor={{fill: '#f6f1e7'}} />
                  {Object.keys(CATEGORY_COLORS).map(cat => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Expense Table Section */}
      <div className="bg-white rounded-[24px] shadow-sm border border-earth/10 overflow-hidden">
        <div className="p-6 border-b border-earth/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-serif italic text-2xl text-earth">All Expenses</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Transport', 'Stay', 'Activities', 'Meals', 'Misc'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === f ? 'bg-earth text-white' : 'bg-paper text-earth hover:bg-paper-dark'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-earth text-paper text-sm">
                <th className="py-3 px-6 font-medium rounded-tl-lg">#</th>
                <th className="py-3 px-6 font-medium">Category</th>
                <th className="py-3 px-6 font-medium">Description</th>
                <th className="py-3 px-6 font-medium">Date</th>
                <th className="py-3 px-6 font-medium text-right rounded-tr-lg">Amount</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-earth-muted italic">No expenses found.</td>
                </tr>
              ) : (
                filteredExpenses.map((exp, i) => (
                  <tr key={exp.id} className="group border-b border-earth/5 hover:bg-paper-dark/30 transition-colors odd:bg-white even:bg-paper/30 text-sm">
                    <td className="py-4 px-6 text-earth-muted">{i + 1}</td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-2 text-earth font-medium">
                        <span className="text-gold">{CATEGORY_ICONS[exp.category]}</span>
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-earth">{exp.description}</td>
                    <td className="py-4 px-6 text-earth-muted">{format(new Date(exp.date), 'MMM d, yyyy')}</td>
                    <td className="py-4 px-6 text-right font-medium text-earth">${exp.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      {isOwner && (
                        <button onClick={() => handleDelete(exp.id)} className="text-earth-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Expense Button */}
        {isOwner && (
          <div className="p-6">
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 border-2 border-dashed border-gold/40 rounded-xl text-gold font-medium hover:bg-gold/5 hover:border-gold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add expense
            </button>
          </div>
        )}

        {/* Footer Summary */}
        <div className="bg-paper p-6 border-t border-earth/10 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-earth-muted">
            {Object.keys(CATEGORY_COLORS).map(cat => {
              const sum = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
              return <span key={cat}>{cat}: <span className="font-semibold text-earth">${sum.toLocaleString()}</span></span>;
            })}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-2 border-t border-earth/10 pt-4">
            <div className="text-lg text-earth font-medium">
              Remaining Budget: <span className={remaining < 0 ? 'text-error' : 'text-forest'}>${remaining.toLocaleString()}</span>
            </div>
            <div className="text-xl font-serif italic text-earth">
              Grand Total: <span className="font-bold ml-2">${spentSoFar.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button onClick={() => handleExport('Invoice')} className="flex items-center gap-2 px-4 py-2 bg-white border border-earth/20 rounded-full text-sm font-medium text-earth hover:bg-paper transition-colors">
          <Download size={16} /> Download Invoice
        </button>
        <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-4 py-2 bg-white border border-earth/20 rounded-full text-sm font-medium text-earth hover:bg-paper transition-colors">
          <FileText size={16} /> Report as PDF
        </button>
        <button onClick={() => handleExport('Email')} className="flex items-center gap-2 px-4 py-2 bg-white border border-earth/20 rounded-full text-sm font-medium text-earth hover:bg-paper transition-colors">
          <Mail size={16} /> Mark as email
        </button>
      </div>

      {/* Add Expense Slide-over */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-earth/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-paper h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif italic text-2xl text-earth">Add Expense</h3>
              <button onClick={() => setIsAdding(false)} className="text-earth-muted hover:text-earth"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-earth-muted mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold">
                  {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-muted mb-1">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Flight to Paris" className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-muted mb-1">Amount ($)</label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="450.00" className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-muted mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold" />
              </div>

              {trip.stops && trip.stops.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-earth-muted mb-1">Which city/stop?</label>
                  <select value={stopId} onChange={e => setStopId(e.target.value)} className="w-full p-3 rounded-xl border border-earth/20 bg-white text-earth focus:outline-none focus:border-gold">
                    <option value="">General Trip Expense</option>
                    {trip.stops.map((s: any) => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 rounded-xl border border-earth/20 text-earth font-medium hover:bg-earth/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
