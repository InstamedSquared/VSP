import React, { useState, useRef } from 'react';
import moment from 'moment';
import DataTable from '../../../components/common/DataTable';
import { createResourceService } from '../../../services/api.service';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';
import Modal from '../../../components/common/Modal';

const p_table = "Payslip";
const tableService = createResourceService('v1/workforce/payslips');

const Payslips = () => {
    const dataTableRef = useRef(null);
    const [viewItem, setViewItem] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleView = (item) => {
        setViewItem(item);
        setIsViewOpen(true);
    };

    const handlePrint = (item) => {
        setViewItem(item);
        setIsViewOpen(true);
        // Delay print to allow modal to render
        setTimeout(() => {
            const printContent = document.getElementById('payslip-print-area');
            if (!printContent) return;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Payslip - ${item.employee_fn} ${item.employee_sn}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #222; }
                        .payslip-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
                        .payslip-header h1 { margin: 0; font-size: 22px; }
                        .payslip-header p { margin: 5px 0 0; color: #666; font-size: 13px; }
                        .payslip-section { margin-bottom: 20px; }
                        .payslip-section h3 { margin: 0 0 10px; font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                        .payslip-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
                        .payslip-row span:first-child { color: #555; }
                        .payslip-row span:last-child { font-weight: 600; }
                        .payslip-total { border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
                        .payslip-total .payslip-row span:last-child { font-size: 18px; color: #1a7f37; }
                        .payslip-footer { text-align: center; margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                        @media print { body { padding: 20px; } }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }, 400);
    };

    const tableColumns = React.useMemo(() => [
        {
            key: 'employee', label: 'Employee', type: 1, sortable: true, render: (item) => (
                <div className='td-user'>
                    <div className='tr-name'><b>{`${item.employee_fn} ${item.employee_sn}`}</b></div>
                </div>
            )
        },
        { key: 'period', label: 'Pay Period', type: 1, sortable: true, render: (item) => (
            `${item.period_start ? moment(item.period_start).format('MM/DD/YYYY') : '-'} to ${item.period_end ? moment(item.period_end).format('MM/DD/YYYY') : '-'}`
        ) },
        { key: 'gross_pay', label: 'Gross Pay', type: 1, sortable: true, render: (item) => (
            <span>${parseFloat(item.gross_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        ) },
        { key: 'deductions', label: 'Deductions', type: 1, sortable: true, render: (item) => (
            <span>${parseFloat(item.deductions || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        ) },
        { key: 'net_pay', label: 'Net Pay', type: 1, sortable: true, render: (item) => (
            <b style={{ color: 'var(--success-color)' }}>${parseFloat(item.net_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
        ) },
        { key: 'payment_date', label: 'Payment Date', type: 1, sortable: true, render: (item) => (
            item.payment_date ? moment(item.payment_date).format('MMM DD, YYYY') : '-'
        ) },
    ], []);

    return (
        <>
            <DataTable
                ref={dataTableRef}
                resourceName={p_table}
                apiService={tableService}
                columns={tableColumns}
                config={{
                    searchables: ['employee_fn', 'employee_sn'],
                    title: <span><h2>Payslips</h2><p>View paid payroll records</p></span>,
                    add: false,
                    edit: false,
                    delete: false,
                    rowActions: [
                        { type: 'button', icon: icons.eye, text: 'View', className: 'td-btn-edit', onClick: (item) => handleView(item) },
                        { type: 'button', icon: icons.print, text: 'Print', className: 'td-btn', onClick: (item) => handlePrint(item) }
                    ]
                }}
            />

            <Modal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Payslip Details"
                actions={[
                    { text: 'Close', className: 'btn-secondary', icon: icons.times, onClick: () => setIsViewOpen(false) },
                    { text: 'Print', className: 'btn-primary', icon: icons.print, onClick: () => { if (viewItem) handlePrint(viewItem); } }
                ]}
            >
                {viewItem && (
                    <div id="payslip-print-area">
                        <div className="payslip-header">
                            <h1>PAYSLIP</h1>
                            <p>Compensation Statement</p>
                        </div>
                        <div className="payslip-section">
                            <h3>Employee Information</h3>
                            <div className="payslip-row">
                                <span>Employee Name</span>
                                <span>{viewItem.employee_fn} {viewItem.employee_sn}</span>
                            </div>
                            <div className="payslip-row">
                                <span>Pay Period</span>
                                <span>{moment(viewItem.period_start).format('MMM DD, YYYY')} — {moment(viewItem.period_end).format('MMM DD, YYYY')}</span>
                            </div>
                            <div className="payslip-row">
                                <span>Payment Date</span>
                                <span>{viewItem.payment_date ? moment(viewItem.payment_date).format('MMM DD, YYYY') : '-'}</span>
                            </div>
                        </div>
                        <div className="payslip-section">
                            <h3>Compensation Breakdown</h3>
                            <div className="payslip-row">
                                <span>Gross Pay</span>
                                <span>${parseFloat(viewItem.gross_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="payslip-row">
                                <span>Deductions</span>
                                <span>-${parseFloat(viewItem.deductions || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="payslip-total">
                                <div className="payslip-row">
                                    <span><b>Net Pay</b></span>
                                    <span>${parseFloat(viewItem.net_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="payslip-footer">
                            <p>This is a system-generated payslip. For questions, contact the Finance Department.</p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Payslips;
