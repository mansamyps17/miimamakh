// កំណត់កាលបរិច្ឆេទថ្ងៃនេះជាស្វ័យប្រវត្តិពេលចូលមកដល់
const today = new Date().toISOString().split('T')[0];
const dateInput = document.getElementById('dateInput');
const dateDisplay = document.getElementById('invDateDisplay');

if (dateInput) {
    dateInput.value = today;
    dateDisplay.textContent = formatDateString(today);

    // ពេលអ្នកប្រើប្រាស់ប្ដូរកាលបរិច្ឆេទ
    dateInput.addEventListener('change', function() {
        dateDisplay.textContent = formatDateString(this.value);
    });
}

function formatDateString(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // ប្តូរជា DD-MM-YYYY
}

// មុខងារ Upload Logo
const logoInput = document.getElementById('logoInput');
if (logoInput) {
    logoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const logoImg = document.getElementById('invoiceLogo');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoImg.src = e.target.result;
                logoImg.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            logoImg.style.display = 'none';
        }
    });
}

let invoiceItems = [];

// បន្ថែមទំនិញចូលតារាង
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

    document.getElementById('grandTotal').textContent = "$ " + grandTotal.toFixed(2);
}

// មុខងារ Upload និងបង្ហាញរូបភាព Attachments
const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function(event) {
        const files = event.target.files;
        const previewContainer = document.getElementById('imagePreviewContainer');
        const attachmentSection = document.getElementById('attachmentSection');
        
        previewContainer.innerHTML = "";

        if (files.length > 0) {
            attachmentSection.style.display = 'block';
            
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'image-item';
                    div.innerHTML = `<img src="${e.target.result}" alt="Attachment">`;
                    previewContainer.appendChild(div);
                }
                reader.readAsDataURL(file);
            });
        } else {
            attachmentSection.style.display = 'none';
        }
    });
}

// មុខងារ Print / Save PDF ដោយយកឈ្មោះហ្វាលតាមប្រអប់បញ្ចូល
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function() {
        if (invoiceItems.length === 0) {
            alert("សូមបន្ថែមទំនិញយ៉ាងហោចណាស់មួយមុននឹងទាញយក PDF!");
            return;
        }

        // កំណត់ឈ្មោះ Title របស់ Document ឱ្យត្រូវនឹងឈ្មោះហ្វាលដែលបានវាយបញ្ចូល
        const customFileName = document.getElementById('pdfNameInput').value.trim() || "Invoice_A4";
        document.title = customFileName;

        window.print();
    });
}
