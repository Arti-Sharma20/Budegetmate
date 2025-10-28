import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Entry {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [editId, setEditId] = useState<number | null>(null);

    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (!token || !userId) {
            navigate('/');
        } else {
            setUsername(storedUsername); // ✅ Set the username
            fetchEntries(userId);
        }
    }, []);
    const fetchEntries = (userId: string) => {
        axios
            .get(`http://localhost:8080/api/entries?userId=${userId}`)
            .then((res) => setEntries(res.data))
            .catch((err) => console.error('Error fetching entries:', err));
    };

    const handleAddOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) return alert('User ID missing!');

        const entry = {
            amount: parseFloat(amount),
            category,
            description,
            type,
        };
        if (editId) {
            axios
                .put(`http://localhost:8080/api/entries/${editId}`, entry)
                .then(() => {
                    fetchEntries(userId);
                    resetForm();
                })
                .catch(() => alert('Failed to update entry'));
        } else {
            axios
                .post(`http://localhost:8080/api/entries?userId=${userId}`, entry)
                .then(() => {
                    fetchEntries(userId);
                    resetForm();
                })
                .catch(() => alert('Failed to add entry'));
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            axios
                .delete(`http://localhost:8080/api/entries/${id}`)
                .then(() => {
                    const userId = localStorage.getItem('userId');
                    if (userId) fetchEntries(userId);
                })
                .catch(() => alert('Failed to delete entry'));
        }
    };

    const handleEdit = (entry: Entry) => {
        setEditId(entry.id);
        setAmount(entry.amount.toString());
        setCategory(entry.category);
        setDescription(entry.description);
        setType(entry.type);
    };

    const resetForm = () => {
        setAmount('');
        setCategory('');
        setDescription('');
        setType('income');
        setEditId(null);
    };


    const totalIncome = entries
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = entries
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpense;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('BudgetMate Report', 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [['Type', 'Amount', 'Category', 'Description']],
            body: entries.map((entry) => [
                entry.type.toUpperCase(),
                `${entry.amount}`,
                entry.category,
                entry.description || 'N/A',
            ]),
        });

        const finalY = (doc as any).lastAutoTable.finalY;

        doc.text(`Total Income: ${totalIncome}`, 14, finalY + 10);
        doc.text(`Total Expense: ${totalExpense}`, 14, finalY + 20);
        doc.text(`Balance: ${balance}`, 14, finalY + 30);

        doc.save('budgetmate-report.pdf');
    };


    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col d-flex justify-content-between align-items-center">
                    <h2 className="text-primary fw-bold">
                        <i className="fas fa-user me-2"></i>
                        Welcome, {username ? username : "User"}!
                    </h2>
                    <button onClick={handleDownloadPDF} className="btn btn-outline-dark">
                        <i className="fas fa-file-pdf me-2"></i>Download PDF
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card bg-success text-white shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Current Balance</h5>
                            <h3 className="card-text fw-bold">₹{balance}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-primary text-white shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Income</h5>
                            <h3 className="card-text fw-bold">₹{totalIncome}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-danger text-white shadow">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Expenses</h5>
                            <h3 className="card-text fw-bold">₹{totalExpense}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold text-dark">
                        <i className="fas fa-plus-circle me-2 text-primary"></i>
                        {editId ? 'Update Entry' : 'Add New Transaction'}
                    </h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddOrUpdate}>
                        <div className="row g-3">
                            <div className="col-md-2">
                                <label className="form-label fw-semibold">Type</label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                                >
                                    <option value="income">Income</option> {/* No <i> here */}
                                    <option value="expense">Expense</option>
                                </select>

                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-semibold">Amount</label>
                                <div className="input-group">
                                    <span className="input-group-text">₹</span>
                                    <input
                                        className="form-control form-control-lg"
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Category</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    placeholder="e.g., Food, Salary"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Description</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    placeholder="Optional"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit">
                                    <i className={`fas ${editId ? 'fa-sync' : 'fa-plus'} me-2`}></i>
                                    {editId ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-light">
                    <h5 className="mb-0 fw-bold text-dark">
                        <i className="fas fa-list me-2 text-primary"></i> All Transactions
                    </h5>
                </div>
                <div className="card-body p-0">
                    {entries.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>
                                                <span className={`badge ${entry.type === 'income' ? 'bg-success' : 'bg-danger'} fs-6`}>
                                                    <i className={`fas ${entry.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
                                                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="fw-bold">₹{entry.amount}</td>
                                            <td>
                                                <span className="badge bg-secondary">{entry.category}</span>
                                            </td>
                                            <td className="text-muted">{entry.description || 'No description'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(entry)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(entry.id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No transactions yet</h5>
                            <p className="text-muted">Add your first transaction above to get started!</p>
                        </div>
                    )}


                </div>
            </div>

        </div>
    );
};

export default Dashboard;
