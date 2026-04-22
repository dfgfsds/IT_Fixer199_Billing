import React, { useState, useEffect } from "react";
import axiosInstance from "../configs/axios-middleware";
import Api from "../api-endpoints/ApiUrls";
import toast from "react-hot-toast";
import './AddPaymentModal.css';

const AddPaymentModal = ({ order, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        amount: "",
        payment_method: "",
        transaction_id: "",
        transaction_type: "",
        user_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setForm(prev => ({ ...prev, user_id: user.id || "" }));
        }
        // Prefill balance as default amount
        if (order?.amount_to_be_paid) {
            setForm(prev => ({ ...prev, amount: String(order.amount_to_be_paid) }));
        }
    }, [order]);

    const handleSubmit = async () => {
        if (!form.amount || Number(form.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!form.transaction_type) {
            toast.error("Please select a transaction type");
            return;
        }
        if (!form.payment_method) {
            toast.error("Please select a payment method");
            return;
        }
        if (!form.transaction_id) {
            toast.error("Transaction ID is required");
            return;
        }

        try {
            setLoading(true);
            setApiErrors("");

            const response = await axiosInstance.post(
                `${Api.createOrderPayment}${order?.id}/payment/`,
                {
                    amount: form.amount,
                    payment_method: form.payment_method,
                    transaction_id: form.transaction_id,
                    transaction_type: form.transaction_type,
                    user_id: form.user_id,
                }
            );

            if (response) {
                toast.success("Payment recorded successfully!");
                onSuccess();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
            setApiErrors(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pay-modal-overlay">
            <div className="pay-modal-card">

                {/* Header */}
                <div className="pay-modal-header">
                    <h2 className="pay-modal-title">Add Payment</h2>
                    <p className="pay-modal-subtitle">
                        Adding manual payment for Order: <span className="pay-order-id">#{order?.id?.slice(0, 8)}</span>
                    </p>
                </div>

                <div className="pay-modal-body">

                    {/* Transaction Type */}
                    <div className="pay-input-group">
                        <label className="pay-label">Transaction Type</label>
                        <select
                            className="pay-input"
                            value={form.transaction_type}
                            onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                        >
                            <option value="">Select Type</option>
                            <option value="PAYMENT">Payment</option>
                            <option value="REFUND">Refund</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div className="pay-input-group">
                        <label className="pay-label">Amount (₹)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Enter amount"
                            className="pay-input"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="pay-input-group">
                        <label className="pay-label">Payment Method</label>
                        <select
                            className="pay-input"
                            value={form.payment_method}
                            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                        >
                            <option value="">Select Method</option>
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">Cheque</option>
                        </select>
                    </div>

                    {/* Transaction ID */}
                    <div className="pay-input-group">
                        <label className="pay-label">Transaction ID</label>
                        <input
                            type="text"
                            placeholder="Enter reference number"
                            className="pay-input"
                            value={form.transaction_id}
                            onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                        />
                    </div>
                </div>

                {apiErrors && (
                    <div className="pay-error-box">
                        <p className="pay-error-text">
                            {apiErrors}
                        </p>
                    </div>
                )}

                <div className="pay-modal-footer">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? "Adding..." : "Add Payment"}
                    </button>

                </div>
            </div>
        </div>

    );
};

export default AddPaymentModal;
