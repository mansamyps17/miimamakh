// បង្ហាញកាលបរិច្ឆេទថ្ងៃនេះស្វ័យប្រវត្តិ
document.getElementById('invDate').textContent = new Date().toLocaleDateString('km-KH');

let invoiceItems = [];

document.getElementById('addItemBtn').addEventListener('click', function() {
    const name = document.getElementById('itemName').value.trim();
    const qty = parseFloat(document.getElementById('itemQty').value) || 1;
    const price = parseFloat(document.getElementById('itemPrice').value) || 0;

    if (name === "") {
        alert("សូមបញ្ចូលឈ្មោះទំនិញ!");
        return;
    }

    const total = qty * price;
    invoiceItems.push({ name, qty, price, total });

    renderInvoice();

    // សម្អាតช่องបញ្ចូល
    document.getElementById('itemName').value = "";
    document.getElementById('itemPrice').value = "";
    document.getElementById('itemQty').value = "1";
});

function renderInvoice() {
    const tbody = document.getElementById('invoiceTableBody');
    tbody.innerHTML = "";
    let grandTotal = 0;

    invoiceItems.forEach((item, index) => {
        grandTotal += item.total;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left; padding-left: 10px;">${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}

// មុខងារទាញយកជា PDF
document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    if (invoiceItems.length === 0) {
        alert("សូមបន្ថែមទំនិញយ៉ាងហោចណាស់មួយមុននឹងទាញយក PDF!");
        return;
    }

    const element = document.getElementById('invoice-content');
    const opt = {
        margin:       0.5,
        filename:     'invoice.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
});