// បង្ហាញកាលបរិច្ឆេទថ្ងៃនេះស្វ័យប្រវត្តិ
const today = new Date();
const formattedDate = String(today.getDate()).padStart(2, '0') + '-' + 
                      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                      today.getFullYear();
document.getElementById('invDate').textContent = formattedDate;

// មុខងារចុចប្ដូរទម្លាក់ចុះឡើង (Accordion) សម្រាប់ប្រអប់ម៉ឺនុយទាំង ៤
function toggleAccordion(sectionId, headerElement) {
    const content = document.getElementById(sectionId);
    const arrow = headerElement.querySelector('.arrow');
    
    // បើក ឬ បិទ Content ជាក់លាក់
    if (content.style.display === 'block') {
        content.style.display = 'none';
        arrow.textContent = '▼';
        headerElement.classList.remove('active-header');
    } else {
        content.style.display = 'block';
        arrow.textContent = '▲';
        headerElement.classList.add('active-header');
    }
}

let invoiceItems = [];

document.getElementById('addItemBtn').addEventListener('click', function() {
    const name = document.getElementById('itemName').value.trim();
    const unit = document.getElementById('itemUnit').value.trim();
    const qty = parseFloat(document.getElementById('itemQty').value) || 1;
    const price = parseFloat(document.getElementById('itemPrice').value) || 0;

    if (name === "") {
        alert("សូមបញ្ចូលឈ្មោះទំនិញ!");
        return;
    }

    const total = qty * price;
    invoiceItems.push({ name, unit, qty, price, total });

    renderInvoice();

    // សម្អាតប្រអប់បញ្ចូល
    document.getElementById('itemName').value = "";
    document.getElementById('itemUnit').value = "";
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
            <td style="text-align: left; padding-left: 8px;">${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.unit}</td>
            <td>$ ${item.price.toFixed(2)}</td>
            <td>$ ${item.total.toFixed(2)}</td>
            <td></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('grandTotal').textContent = "$ " + grandTotal.toFixed(2);
}

// មុខងារ Print / Save PDF
document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    if (invoiceItems.length === 0) {
        alert("សូមបន្ថែមទំនិញយ៉ាងហោចណាស់មួយមុននឹងទាញយក PDF!");
        return;
    }
    
    window.print();
});
