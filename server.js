const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4310;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory databases
let workEntries = [];
let invoices = [];
let disputes = [];
let nextWorkId = 1;
let nextInvoiceId = 1;
let nextDisputeId = 1;

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

app.get('/api/info', (req, res) => {
    res.json({
        name: 'Billing Application',
        version: '1.0.0',
        description: 'Workoutput, Billing and Collection Management',
        port: PORT
    });
});

// ==================== WORK ENTRIES ====================
app.post('/api/work-entries', (req, res) => {
    const { date, description, hours, rate, status } = req.body;
    const amount = hours * rate;
    const entry = {
        id: nextWorkId++,
        date,
        description,
        hours,
        rate,
        amount,
        status,
        createdAt: new Date()
    };
    workEntries.push(entry);
    res.status(201).json(entry);
});

app.get('/api/work-entries', (req, res) => {
    res.json(workEntries);
});

app.get('/api/work-entries/:id', (req, res) => {
    const entry = workEntries.find(e => e.id == req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
});

app.put('/api/work-entries/:id', (req, res) => {
    const entry = workEntries.find(e => e.id == req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    
    Object.assign(entry, req.body);
    entry.amount = entry.hours * entry.rate;
    res.json(entry);
});

app.delete('/api/work-entries/:id', (req, res) => {
    const index = workEntries.findIndex(e => e.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Entry not found' });
    
    workEntries.splice(index, 1);
    res.json({ message: 'Entry deleted successfully' });
});

app.get('/api/work-summary', (req, res) => {
    const totalEntries = workEntries.length;
    const totalHours = workEntries.reduce((sum, e) => sum + e.hours, 0);
    const totalAmount = workEntries.reduce((sum, e) => sum + e.amount, 0);
    const averageRate = totalEntries > 0 ? (totalAmount / totalHours).toFixed(2) : 0;

    res.json({
        totalEntries,
        totalHours: totalHours.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        averageRate: parseFloat(averageRate)
    });
});

// ==================== INVOICES ====================
app.post('/api/invoices', (req, res) => {
    const { invoiceNumber, clientName, amount, dueDate, status } = req.body;
    const invoice = {
        id: nextInvoiceId++,
        invoiceNumber,
        clientName,
        amount,
        dueDate,
        status: status || 'pending',
        disputes: [],
        createdAt: new Date()
    };
    invoices.push(invoice);
    res.status(201).json(invoice);
});

app.get('/api/invoices', (req, res) => {
    res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
    const invoice = invoices.find(i => i.id == req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
});

app.put('/api/invoices/:id', (req, res) => {
    const invoice = invoices.find(i => i.id == req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    Object.assign(invoice, req.body);
    res.json(invoice);
});

app.delete('/api/invoices/:id', (req, res) => {
    const index = invoices.findIndex(i => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
    
    invoices.splice(index, 1);
    res.json({ message: 'Invoice deleted successfully' });
});

// ==================== DISPUTES ====================
app.post('/api/invoices/:invoiceId/disputes', (req, res) => {
    const { reason, amount, description, status } = req.body;
    const invoice = invoices.find(i => i.id == req.params.invoiceId);
    
    if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
    }

    const dispute = {
        id: nextDisputeId++,
        invoiceId: parseInt(req.params.invoiceId),
        reason,
        amount,
        description: description || '',
        status: status || 'open',
        createdAt: new Date()
    };

    disputes.push(dispute);
    invoice.disputes.push(dispute.id);
    
    res.status(201).json(dispute);
});

app.get('/api/disputes', (req, res) => {
    res.json(disputes);
});

app.get('/api/disputes/:id', (req, res) => {
    const dispute = disputes.find(d => d.id == req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    res.json(dispute);
});

app.get('/api/invoices/:invoiceId/disputes', (req, res) => {
    const invoice = invoices.find(i => i.id == req.params.invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    const invoiceDisputes = disputes.filter(d => d.invoiceId == req.params.invoiceId);
    res.json(invoiceDisputes);
});

app.put('/api/disputes/:id', (req, res) => {
    const dispute = disputes.find(d => d.id == req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    
    Object.assign(dispute, req.body);
    res.json(dispute);
});

app.delete('/api/disputes/:id', (req, res) => {
    const dispute = disputes.find(d => d.id == req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    
    // Remove dispute from invoice
    const invoice = invoices.find(i => i.id === dispute.invoiceId);
    if (invoice) {
        invoice.disputes = invoice.disputes.filter(dId => dId !== dispute.id);
    }
    
    // Remove dispute from array
    const index = disputes.findIndex(d => d.id == req.params.id);
    disputes.splice(index, 1);
    
    res.json({ message: 'Dispute deleted successfully' });
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
    console.log(`\n✅ Billing Application Server Running`);
    console.log(`📍 URL: http://127.0.0.1:${PORT}`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n🚀 Dashboard available at http://127.0.0.1:${PORT}/`);
    console.log(`📡 API available at http://127.0.0.1:${PORT}/api\n`);
});
