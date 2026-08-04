const dateInput = document.getElementById('dateInput');
const dateDisplay = document.getElementById('invDateDisplay');

if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    if (dateDisplay) {
        dateDisplay.textContent = formatDateString(today);
    }

    dateInput.addEventListener('change', function() {
        if (dateDisplay) {
            dateDisplay.textContent = formatDateString(this.value);
        }
    });
}

function formatDateString(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

const logoInput = document.getElementById('logoInput');
if (logoInput) {
    logoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const logoImg = document.getElementById('invoiceLogo');
        if (file && logoImg) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoImg.src = e.target.result;
                logoImg.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else if (logoImg) {
            logoImg.style.display = 'none';
        }
    });
}

let invoiceItems = [];

const addItemBtn = document.getElementById('addItemBtn');
if (addItemBtn) {
    addItemBtn.addEventListener('click', function() {
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

        document.getElementById('itemName').value = "";
        document.getElementById('itemUnit').value = "";
        document.getElementById('itemPrice').value = "";
        document.getElementById('itemQty').value = "1";
    });
}

function renderInvoice() {
    const tbody = document.getElementById('invoiceTableBody');
    if (!tbody) return;
    
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

    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement) {
        grandTotalElement.textContent = "$ " + grandTotal.toFixed(2);
    }
}

const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function(event) {
        const files = event.target.files;
        const previewContainer = document.getElementById('imagePreviewContainer');
        const attachmentSection = document.getElementById('attachmentSection');
        
        if (previewContainer) previewContainer.innerHTML = "";

        if (files.length > 0) {
            if (attachmentSection) attachmentSection.style.display = 'block';
            
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'image-item';
                    div.innerHTML = `<img src="${e.target.result}" alt="Attachment">`;
                    if (previewContainer) previewContainer.appendChild(div);
                }
                reader.readAsDataURL(file);
            });
        } else {
            if (attachmentSection) attachmentSection.style.display = 'none';
        }
    });
}

const downloadPdfBtn = document.getElementById('downloadPdfBtn');
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function() {
        if (invoiceItems.length === 0) {
            alert("សូមបន្ថែមទំនិញយ៉ាងហោចណាស់មួយមុននឹងទាញយក PDF!");
            return;
        }

        const pdfNameInput = document.getElementById('pdfNameInput');
        const customFileName = pdfNameInput ? pdfNameInput.value.trim() : "Invoice_A4";
        document.title = customFileName || "Invoice_A4";

        window.print();
    });
}
