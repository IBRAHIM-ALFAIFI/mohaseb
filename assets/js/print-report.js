function generatePrintableReport(accountantName, reviewerName) {
    const resultCard = document.getElementById('resultsContent');
    const periodDetails = document.getElementById('periodDetailsContent');

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (!resultCard || !periodDetails || !startDateInput || !endDateInput) {
        alert('لا توجد بيانات كافية لعرض التقرير');
        return;
    }

    const today = new Date();
    const printDate = today.toLocaleDateString('en-GB');

    const startDate = new Date(startDateInput.value).toLocaleDateString('en-GB');
    const endDate = new Date(endDateInput.value).toLocaleDateString('en-GB');

    const reportWindow = window.open('', '', 'width=900,height=800');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
            <style>
                body {
                    font-family: 'Cairo', sans-serif;
                    padding: 20px;
                    color: #000;
                }
                .report-header {
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 1px;
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }
                .signature-section {
                    margin-top: 40px;
                }
                .signature-box {
                    margin-top: 40px;
                    text-align: center;
                }
                .signature-box .title {
                    font-weight: bold;
                }
                .signature-box .line {
                    margin-top: 50px;
                    border-top: 1px solid #000;
                    width: 60%;
                    margin-left: auto;
                    margin-right: auto;
                }
                .print-date {
                    text-align: left;
                    font-size: 13px;
                    margin-top: 20px;
                    color: #555;
                }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>

            <div class="report-header">بسم الله الرحمن الرحيم</div>

            <div class="text-center mb-4">
                <h2>استحقاق بدل الابتعاث رقم (...............) المرفق</h2>
                <p>فرع الشؤون الإدارية والمالية للقوات البرية بالجنوبية - معهد سلاح المشاة</p>
            </div>

            <div class="section-title">تفاصيل الفترة</div>
            <p><strong>من تاريخ:</strong> ${startDate} &nbsp;&nbsp; <strong>إلى تاريخ:</strong> ${endDate}</p>

            <div class="section-title">تفاصيل الحساب</div>
            ${resultCard.innerHTML}

            <div class="row signature-section">
                <div class="col-6 signature-box">
                    <div class="title">اسم المحاسب</div>
                    <div>${accountantName}</div>
                    <div class="line"></div>
                    <div>التوقيع</div>
                </div>
                <div class="col-6 signature-box">
                    <div class="title">اسم المدقق</div>
                    <div>${reviewerName}</div>
                    <div class="line"></div>
                    <div>التوقيع</div>
                </div>
            </div>

            <div class="print-date">تاريخ الطباعة: ${printDate}</div>

            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    reportWindow.document.close();
}
