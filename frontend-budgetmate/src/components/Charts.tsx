import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,LinearScale,BarElement,Title);

interface Entry {amount: number; category: string;
  date: string; type: string;
}

const Charts: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    axios
      .get(`http://localhost:8080/api/entries?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setEntries(res.data))
      .catch((err) => console.error('Failed to fetch entries', err));
  }, []);

  // Filter only expenses
  const expenseEntries = entries.filter(e => e.type.toLowerCase() === 'expense');

  // Group by category for pie chart
  const categoryTotals: Record<string, number> = {};
  expenseEntries.forEach((entry) => {
    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
  });

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Amount by Category',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#17a2b8', '#6610f2'
        ]}]};

  // Group by month for bar chart
  const monthlyTotals: Record<string, number> = {};
  expenseEntries.forEach((entry) => {
    if (!entry.date) return;

    const dateObj = new Date(entry.date);
    if (isNaN(dateObj.getTime())) return;

    const month = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + entry.amount;
  });

  const barData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: 'Total Expenses',
        data: Object.values(monthlyTotals),
        backgroundColor: '#17a2b8'
      }]};

  const barOptions = { responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Monthly Expense Summary'
      }}};

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 fw-bold">Your Budget Analytics</h2>

      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-center mb-4">Expense Distribution by Category</h5>
              {Object.keys(categoryTotals).length > 0 ? (
                <div style={{ height: '400px', width: '100%' }}>
                  <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <p className="text-center text-muted mt-4">No expense data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-center mb-4">Monthly Expenses Bar Graph</h5>
              {Object.keys(monthlyTotals).length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <p className="text-center text-muted mt-4">No monthly data available</p>
              )}
            </div>
          </div> </div> </div> </div>);};

export default Charts;
