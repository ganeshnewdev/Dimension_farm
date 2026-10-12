import React, { useState, useEffect } from 'react';
import { Wallet, Coins, Plus, Trash2, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, BarChart3 } from 'lucide-react';
import { INITIAL_EXPENSES, INITIAL_INCOME } from '../data/initialData';

export default function FinancesSection({ defaultTab = 'income' }) {
  const [tab, setTab] = useState(defaultTab);

  // Persistent state using LocalStorage
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('dim_farm_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [incomeList, setIncomeList] = useState(() => {
    const saved = localStorage.getItem('dim_farm_income');
    return saved ? JSON.parse(saved) : INITIAL_INCOME;
  });

  // New Expense Form
  const [expCategory, setExpCategory] = useState('Fertilizers (उर्वरक)');
  const [expCrop, setExpCrop] = useState('गेहूं (Wheat PBW 550)');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // New Income Form
  const [incCrop, setIncCrop] = useState('गेहूं (Wheat PBW 550)');
  const [incQty, setIncQty] = useState('');
  const [incRate, setIncRate] = useState('');
  const [incMandi, setIncMandi] = useState('स्थानीय APMC मंडी');
  const [incDate, setIncDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('dim_farm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('dim_farm_income', JSON.stringify(incomeList));
  }, [incomeList]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expAmount || isNaN(expAmount)) return;
    const item = {
      id: `exp-${Date.now()}`,
      date: expDate,
      category: expCategory,
      crop: expCrop,
      amount: parseFloat(expAmount),
      description: expDesc || "खेत परिचालन खर्च"
    };
    setExpenses([item, ...expenses]);
    setExpAmount('');
    setExpDesc('');
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!incQty || !incRate) return;
    const qty = parseFloat(incQty);
    const rate = parseFloat(incRate);
    const item = {
      id: `inc-${Date.now()}`,
      date: incDate,
      crop: incCrop,
      quantity: qty,
      unit: "क्विंटल",
      ratePerUnit: rate,
      totalRevenue: qty * rate,
      mandi: incMandi,
      notes: "सत्यापित फसल बिक्री"
    };
    setIncomeList([item, ...incomeList]);
    setIncQty('');
    setIncRate('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteIncome = (id) => {
    setIncomeList(incomeList.filter(i => i.id !== id));
  };

  // Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = incomeList.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Top Toggle & Summary Cards */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#193729] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#145C38]" />
            खेत का वित्तीय खाता एवं लाभ-हानि विश्लेषण
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            लागत, उत्पादन, मंडी बिक्री और शुद्ध मुनाफा (Net Profit / Loss) का वास्तविक ब्योरा
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-200/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('income')}
            className={`px-4 py-2 rounded-lg transition-all ${
              tab === 'income' ? 'bg-[#145C38] text-white shadow-sm' : 'text-gray-700 hover:text-[#145C38]'
            }`}
          >
            आय एवं लाभ (Income & Profit)
          </button>
          <button
            onClick={() => setTab('budget')}
            className={`px-4 py-2 rounded-lg transition-all ${
              tab === 'budget' ? 'bg-[#145C38] text-white shadow-sm' : 'text-gray-700 hover:text-[#145C38]'
            }`}
          >
            लागत व खर्च (Budget & Expenses)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">कुल फसल बिक्री आय</span>
            <p className="text-2xl font-extrabold text-[#145C38] mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> दर्ज आवक
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#145C38] flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">कुल परिचालन खर्च</span>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">₹{totalExpense.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> कुल लागत
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">शुद्ध मुनाफा (Net Profit)</span>
            <p className={`text-2xl font-extrabold mt-1 ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              ₹{netProfit.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-gray-500">आय - समस्त खर्च</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">लाभ मार्जिन</span>
            <p className="text-2xl font-extrabold text-[#193729] mt-1">{profitMargin}%</p>
            <span className="text-[11px] text-emerald-600 font-medium">निवेश पर प्रतिफल</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tab View: Income Tab */}
      {tab === 'income' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Income Form */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-bold text-sm text-[#145C38] mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              फसल बिक्री दर्ज करें
            </h3>
            <form onSubmit={handleAddIncome} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 block mb-1">फसल का नाम:</label>
                <input
                  type="text"
                  value={incCrop}
                  onChange={(e) => setIncCrop(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">मात्रा (क्विंटल):</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="उदा. 45"
                    value={incQty}
                    onChange={(e) => setIncQty(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 block mb-1">भाव (₹/क्विंटल):</label>
                  <input
                    type="number"
                    placeholder="उदा. 2650"
                    value={incRate}
                    onChange={(e) => setIncRate(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">मंडी / खरीदार:</label>
                <input
                  type="text"
                  value={incMandi}
                  onChange={(e) => setIncMandi(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">बिक्री तिथि:</label>
                <input
                  type="date"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#145C38] hover:bg-[#23764A] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
              >
                + बिक्री सहेजें
              </button>
            </form>
          </div>

          {/* Income Table */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="font-bold text-sm text-[#193729] mb-3">दर्ज फसल बिक्री रिकॉर्ड्स</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F7F3] text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">तिथि</th>
                    <th className="p-3">फसल</th>
                    <th className="p-3">मात्रा</th>
                    <th className="p-3">भाव (₹)</th>
                    <th className="p-3">कुल आय (₹)</th>
                    <th className="p-3">मंडी</th>
                    <th className="p-3 text-right">क्रिया</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incomeList.map((inc) => (
                    <tr key={inc.id} className="hover:bg-gray-50">
                      <td className="p-3 text-gray-500">{inc.date}</td>
                      <td className="p-3 font-bold text-gray-800">{inc.crop}</td>
                      <td className="p-3">{inc.quantity} {inc.unit}</td>
                      <td className="p-3">₹{inc.ratePerUnit}</td>
                      <td className="p-3 font-extrabold text-[#145C38]">₹{inc.totalRevenue.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-gray-500">{inc.mandi}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteIncome(inc.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab View: Budget & Expense Tab */}
      {tab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Expense Form */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-bold text-sm text-amber-800 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              नया खर्च दर्ज करें
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-700 block mb-1">खर्च की श्रेणी:</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                >
                  <option value="Seeds (बीज)">Seeds (बीज)</option>
                  <option value="Fertilizers (उर्वरक)">Fertilizers (उर्वरक)</option>
                  <option value="Pesticides (कीटनाशक)">Pesticides (कीटनाशक)</option>
                  <option value="Labour (मजदूरी)">Labour (मजदूरी)</option>
                  <option value="Irrigation (सिंचाई/बिजली)">Irrigation (सिंचाई/बिजली)</option>
                  <option value="Machinery (ट्रैक्टर/डीजल)">Machinery (ट्रैक्टर/डीजल)</option>
                  <option value="Transport (परिवहन)">Transport (परिवहन)</option>
                  <option value="Other (अन्य)">Other (अन्य)</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">संबंधित फसल:</label>
                <input
                  type="text"
                  value={expCrop}
                  onChange={(e) => setExpCrop(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">खर्च राशि (₹):</label>
                <input
                  type="number"
                  placeholder="उदा. 4500"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">विवरण / बिल नोट:</label>
                <input
                  type="text"
                  placeholder="उदा. DAP के 2 बैग और यूरिया"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 block mb-1">खर्च की तिथि:</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#145C38] hover:bg-[#23764A] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
              >
                + खर्च सहेजें
              </button>
            </form>
          </div>

          {/* Expenses Table */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="font-bold text-sm text-[#193729] mb-3">लागत एवं खर्च इतिहास</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F4F7F3] text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">तिथि</th>
                    <th className="p-3">श्रेणी</th>
                    <th className="p-3">फसल</th>
                    <th className="p-3">विवरण</th>
                    <th className="p-3">राशि (₹)</th>
                    <th className="p-3 text-right">क्रिया</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50">
                      <td className="p-3 text-gray-500">{exp.date}</td>
                      <td className="p-3 font-semibold text-gray-700">{exp.category}</td>
                      <td className="p-3 font-bold text-gray-800">{exp.crop}</td>
                      <td className="p-3 text-gray-500 max-w-[200px] truncate">{exp.description}</td>
                      <td className="p-3 font-bold text-amber-800">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
