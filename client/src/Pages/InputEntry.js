import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Edit, Trash } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

const InputEntry = () => {
    const testapi = "https://expense-tracker-server-production-6e9d.up.railway.app";
    // const api = "http://localhost:5000"
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data only once when the component mounts
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);
    const [formType, setFormType] = useState('');
    const [formData, setFormData] = useState({ amount: '', category: '', note: '', date: new Date() });
    const [entries, setEntries] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Others'];

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    // To track total income
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                if (user?._id) {
                    const response = await axios.get(`${testapi}/entries/${user._id}`);
                    setEntries(response.data);
                    calculateTotalIncome(response.data);
                }
            } catch (error) {
                console.error("Error fetching entries:", error);
            }
        };
        fetchEntries();
    }, [user?._id]);


    const calculateTotalIncome = (data) => {
        const incomeEntries = data.filter(entry => entry.type === 'income');
        const total = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
        setTotalIncome(total);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve and parse the user object from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user._id : null;

        if (formData.amount && formType && userId) {
            const entryData = {
                ...formData,
                type: formType,
                date: formData.date,
                userId: userId,
            };

            try {
                const response = await axios.post(`${testapi}/add-entry`, entryData);
                setEntries([...entries, response.data]);
                if (formType === 'income') {
                    calculateTotalIncome([...entries, response.data]); // Update total income
                }
                setFormData({ amount: '', category: '', note: '', date: new Date() });
                setFormType('');
            } catch (error) {
                console.error("Error adding entry:", error.response?.data || error.message); // Log the error response
                toast.error("Error adding entry! Please try again."); // Show error toast
            }
        } else {
            toast.error('Please fill out all required fields'); // Show error toast
        }
    };

    const handleEdit = (id) => {
        const entry = entries.find((item) => item._id === id);
        if (entry) {
            setFormData({
                amount: entry.amount,
                category: entry.category,
                note: entry.note,
                date: new Date(entry.date)
            });
            setFormType(entry.type);
            setEntries(entries.filter((item) => item._id !== id));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${testapi}/entries/${id}`);
            setEntries(entries.filter((item) => item._id !== id));
            calculateTotalIncome(entries.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    const getRowColor = (type) => {
        switch (type) {
            case 'savings':
                return 'bg-blue-400';
            case 'income':
                return 'bg-green-400';
            case 'expense':
                return 'bg-red-400';
            default:
                return '';
        }
    };

    // Calculate remaining balance for the current month
    const calculateRemainingBalance = () => {
        const currentMonthStr = currentMonth.toISOString().slice(0, 7);
        const totalExpenses = entries
            .filter(entry => entry.type === 'expense' && new Date(entry.date).toISOString().slice(0, 7) === currentMonthStr)
            .reduce((sum, entry) => sum + entry.amount, 0);
        return totalIncome - totalExpenses;
    };

    // Month Navigation Handlers
    const nextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentMonth(newDate);
    };

    const previousMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentMonth(newDate);
    };

    const formatDate = (date) => {
        return `Today, ${date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(',', '')}`; // Format to "Today, 29Sep,2024"
    };

    const getMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' }); // Format to "August, 2024"
    };

    return (
        <div className="p-6 overflow-auto">
            <Helmet>
                <title>Input - Expense Tracker</title>
            </Helmet>

            {/* Current Date and Time Card */}
            <div className="flex justify-end">
                <div className="card bg-base-100 w-auto shadow-xl lg:mb-8">
                    <div className="card-body">
                        <h2 className="text-lg font-bold">{formatDate(new Date())}</h2>
                        <h2 className="text-lg font-bold">Time {currentTime}</h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Form */}
                <form onSubmit={handleSubmit} className="mb-6 bg-base-100 lg:w-1/3 shadow-xl p-2">
                    <div className="flex flex-col space-y-4">
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Type</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={formType}
                                onChange={(e) => setFormType(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                                <option value="savings">Savings</option>
                            </select>
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Amount</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                className="input input-bordered"
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Show different dropdowns based on the selected type */}
                        {formType === 'expense' && (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Category (Expense)</span>
                                </label>
                                <select
                                    name="category"
                                    className="select select-bordered"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formType === 'income' && (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Income Source</span>
                                </label>
                                <input
                                    type="text"
                                    name="category" // You can keep the name as category for uniformity, but it can be renamed if needed.
                                    className="input input-bordered"
                                    placeholder="Enter income source"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {formType === 'savings' && (
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Savings Type</span>
                                </label>
                                <input
                                    type="text"
                                    name="category" // Same here for uniformity.
                                    className="input input-bordered"
                                    placeholder="Enter savings type"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Note</span>
                            </label>
                            <input
                                type="text"
                                name="note"
                                className="input input-bordered"
                                placeholder="Enter a note (optional)"
                                value={formData.note}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text ">Date</span>
                            </label>
                            <DatePicker
                                selected={formData.date}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>

                {/* Entries Table */}
                <div className="w-full p-3 lg:w-2/3 bg-base-100 shadow-2xl">
                    <div className="flex justify-between mb-4">
                        <button onClick={previousMonth} className="btn btn-outline">Previous Month</button>
                        <h2 className="text-xl font-bold">{getMonthYear(currentMonth)}</h2>
                        <button onClick={nextMonth} className="btn btn-outline">Next Month</button>
                    </div>

                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th colSpan="3" className="text-center font-extrabold text-xl text-success">
                                    Remaining Balance: ${calculateRemainingBalance()}
                                </th>
                            </tr>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries
                                .filter(entry => new Date(entry.date).getMonth() === currentMonth.getMonth() && new Date(entry.date).getFullYear() === currentMonth.getFullYear())
                                .map((entry) => (
                                    <tr key={entry._id} className={getRowColor(entry.type)}>
                                        <td>{entry.type}</td>
                                        <td>${entry.amount}</td>
                                        <td>{entry.category}</td>
                                        <td>{new Date(entry.date).toLocaleDateString('en-GB')}</td>
                                        <td>{entry.note}</td>
                                        <td>
                                            <button onClick={() => handleEdit(entry._id)} className="btn btn-sm btn-info mr-4" ><Edit /></button>
                                            <button onClick={() => handleDelete(entry._id)} className="btn btn-sm btn-error"><Trash /></button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InputEntry;