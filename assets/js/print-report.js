function generatePrintableReport(accountantName, reviewerName) {
    const resultCard = document.getElementById('resultsContent');
    const periodDetails = document.getElementById('periodDetailsContent');

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (!resultCard || !periodDetails || !startDateInput || !endDateInput) {
        alert('لا توجد بيانات كافية لعرض التقرير');
        return;
    }

    // Get calculation data from the scholarship calculation
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const previousSalary = parseFloat(document.getElementById('previousSalary').value) || currentSalary;
    const travelDays = parseInt(document.getElementById('travelDays').value) || 0;

    // Recalculate to get detailed breakdown
    const calculationResult = performScholarshipCalculation();
    
    const today = new Date();
    const printDate = today.toLocaleDateString('en-GB');
    const startDateFormatted = startDate.toLocaleDateString('en-GB');
    const endDateFormatted = endDate.toLocaleDateString('en-GB');

    // Generate detailed calculation breakdown
    let calculationDetails = '';
    
    calculationResult.yearlyCalculations.forEach(calc => {
        if (calc.first90Days > 0) {
            calculationDetails += `<p>${calc.salary} × 75% ÷ 30 × ${calc.first90Days} = ${formatCurrency(calc.first90Allowance)}</p>`;
        }
        
        if (calc.remainingDays > 0) {
            calculationDetails += `<p>${calc.salary} × 37.5% ÷ 30 × ${calc.remainingDays} = ${formatCurrency(calc.remainingAllowance)}</p>`;
        }
    });
    
    // Add travel days calculation with appropriate rate
    if (travelDays > 0) {
        const travelPercentage = calculationResult.travelRate === 0.75 ? '75%' : '37.5%';
        calculationDetails += `<p>${currentSalary} × ${travelPercentage} ÷ 30 × ${travelDays} = ${formatCurrency(calculationResult.travelAllowance)} (أيام مسافة الطريق)</p>`;
    }

    const reportWindow = window.open('', '', 'width=900,height=800');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تقرير بدل الابتعاث</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Cairo', sans-serif;
                    line-height: 1.4;
                    color: #2c3e50;
                    background: white;
                    padding: 15px;
                    font-size: 12px;
                }
                
                .report-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border: 2px solid #2c3e50;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .report-header {
                    border-bottom: 3px double #2c3e50;
                    padding: 20px;
                    text-align: center;
                    background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
                                linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
                                linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                }
                
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .ministry-logo {
                    width: 60px;
                    height: 60px;
                    border: 2px solid #2c3e50;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                }
                
                .ministry-logo img {
                    width: 45px;
                    height: 45px;
                    object-fit: contain;
                }
                
                .header-info {
                    text-align: center;
                    flex: 1;
                    margin: 0 20px;
                }
                
                .header-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    text-decoration: underline;
                }
                
                .header-subtitle {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 3px;
                }
                
                .header-department {
                    font-size: 11px;
                    font-weight: 400;
                    color: #666;
                }
                
                .report-number {
                    text-align: right;
                    font-size: 10px;
                    color: #666;
                }
                
                .report-title {
                    border: 2px solid #2c3e50;
                    padding: 12px;
                    text-align: center;
                    margin: 15px 0;
                    background: repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        #f8f9fa 10px,
                        #f8f9fa 20px
                    );
                }
                
                .report-title h2 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                    text-shadow: 1px 1px 0px white;
                }
                
                .report-content {
                    padding: 15px;
                }
                
                .section {
                    margin-bottom: 15px;
                    border: 1px solid #dee2e6;
                    border-radius: 5px;
                    overflow: hidden;
                }
                
                .section-header {
                    background: #f8f9fa;
                    padding: 8px 12px;
                    border-bottom: 1px solid #dee2e6;
                    font-weight: 600;
                    font-size: 13px;
                    position: relative;
                }
                
                .section-header::before {
                    content: '▶';
                    margin-left: 8px;
                    font-size: 10px;
                }
                
                .section-content {
                    padding: 12px;
                }
                
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                }
                
                .info-table td {
                    padding: 6px 10px;
                    border: 1px solid #dee2e6;
                    font-size: 11px;
                }
                
                .info-table .label {
                    background: #f8f9fa;
                    font-weight: 600;
                    width: 35%;
                    text-align: center;
                }
                
                .info-table .value {
                    font-weight: 500;
                    text-align: center;
                }
                
                .calculation-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin: 10px 0;
                }
                
                .calc-box {
                    border: 1px dashed #6c757d;
                    padding: 8px;
                    text-align: center;
                    border-radius: 4px;
                    background: #fafafa;
                }
                
                .calc-formula {
                    font-size: 10px;
                    color: #666;
                    margin-bottom: 3px;
                    font-family: monospace;
                }
                
                .calc-result {
                    font-weight: 600;
                    font-size: 11px;
                }
                
                .total-section {
                    border: 3px double #2c3e50;
                    padding: 15px;
                    text-align: center;
                    margin: 15px 0;
                    background: repeating-linear-gradient(
                        90deg,
                        #f8f9fa,
                        #f8f9fa 10px,
                        white 10px,
                        white 20px
                    );
                }
                
                .total-amount {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 5px 0;
                    text-decoration: underline;
                    text-decoration-style: double;
                }
                
                .signature-section {
                    margin-top: 20px;
                    border-top: 2px solid #2c3e50;
                    padding-top: 15px;
                }
                
                .signature-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                
                .signature-table td {
                    border: 1px solid #2c3e50;
                    padding: 15px;
                    text-align: center;
                    width: 50%;
                    vertical-align: top;
                }
                
                .signature-title {
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 12px;
                }
                
                .signature-name {
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 25px;
                    text-decoration: underline;
                }
                
                .signature-line {
                    border-top: 1px solid #2c3e50;
                    width: 80%;
                    margin: 0 auto 8px;
                }
                
                .signature-label {
                    font-size: 10px;
                    color: #666;
                }
                
                .footer-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 15px;
                    padding: 10px;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    background: #f8f9fa;
                    font-size: 10px;
                }
                
                .decorative-border {
                    border: 2px solid #2c3e50;
                    border-style: dashed;
                    margin: 10px 0;
                    padding: 8px;
                    text-align: center;
                    font-size: 11px;
                    font-weight: 600;
                }
                
                .pattern-bg {
                    background-image: 
                        radial-gradient(circle at 1px 1px, #dee2e6 1px, transparent 0);
                    background-size: 20px 20px;
                }
                
                @media print {
                    body {
                        padding: 0 !important;
                        font-size: 11px !important;
                    }
                    
                    .report-container {
                        border: 2px solid #000 !important;
                        border-radius: 0 !important;
                    }
                    
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                    
                    .section {
                        break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <!-- Header -->
                <div class="report-header">
                    <div class="header-top">
                        <div class="ministry-logo">
                            <img src="assets/images/ministry-logo2.png" alt="شعار وزارة الدفاع">
                        </div>
                        <div class="header-info">
                            <div class="header-title">بسم الله الرحمن الرحيم</div>
                            <div class="header-subtitle">المملكة العربية السعودية - وزارة الدفاع</div>
                            <div class="header-department">فرع الشؤون الإدارية والمالية للقوات البرية بالجنوبية</div>
                        </div>
                        <div class="report-number">
                            رقم: ${Date.now().toString().slice(-6)}<br>
                            التاريخ: ${printDate}
                        </div>
                    </div>
                </div>

                <!-- Report Title -->
                <div class="report-title">
                    <h2>استحقاق بدل الابتعاث رقم (...........) المرفق</h2>
                </div>

                <!-- Content -->
                <div class="report-content">
                    <!-- Period Details -->
                    <div class="section">
                        <div class="section-header">تفاصيل فترة الابتعاث</div>
                        <div class="section-content">
                            <table class="info-table">
                                <tr>
                                    <td class="label">تاريخ البداية</td>
                                    <td class="value">${startDateFormatted}</td>
                                    <td class="label">تاريخ النهاية</td>
                                    <td class="value">${endDateFormatted}</td>
                                </tr>
                                <tr>
                                    <td class="label">أيام الابتعاث</td>
                                    <td class="value">${calculationResult.scholarshipDays} يوم</td>
                                    <td class="label">أيام مسافة الطريق</td>
                                    <td class="value">${travelDays} يوم</td>
                                </tr>
                                <tr>
                                    <td class="label">إجمالي الأيام</td>
                                    <td class="value">${calculationResult.totalDays} يوم</td>
                                    <td class="label">الراتب الحالي</td>
                                    <td class="value">${formatCurrency(currentSalary)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <!-- Calculation Details -->
                    <div class="section">
                        <div class="section-header">تفاصيل الحساب والمعادلات</div>
                        <div class="section-content">
                            <div class="calculation-grid">
                                ${calculationResult.yearlyCalculations.map(calc => `
                                    ${calc.first90Days > 0 ? `
                                    <div class="calc-box">
                                        <div class="calc-formula">${calc.salary} × 75% ÷ 30 × ${calc.first90Days}</div>
                                        <div class="calc-result">${formatCurrency(calc.first90Allowance)}</div>
                                    </div>
                                    ` : ''}
                                    ${calc.remainingDays > 0 ? `
                                    <div class="calc-box">
                                        <div class="calc-formula">${calc.salary} × 37.5% ÷ 30 × ${calc.remainingDays}</div>
                                        <div class="calc-result">${formatCurrency(calc.remainingAllowance)}</div>
                                    </div>
                                    ` : ''}
                                `).join('')}
                                ${travelDays > 0 ? `
                                <div class="calc-box">
                                    <div class="calc-formula">${currentSalary} × ${calculationResult.travelRate === 0.75 ? '75%' : '37.5%'} ÷ 30 × ${travelDays}</div>
                                    <div class="calc-result">${formatCurrency(calculationResult.travelAllowance)} (مسافة طريق)</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Total Amount -->
                    <div class="total-section">
                        <div class="decorative-border">
                            إجمالي الاستحقاق النهائي
                        </div>
                        <div class="total-amount">${formatCurrency(calculationResult.totalAllowance)}</div>
                        <div style="font-size: 10px; margin-top: 5px;">
                            (${calculationResult.totalAllowance.toFixed(2).replace(/\d/g, d => '٠١٢٣٤٥٦٢٨٩'[d])} ريال سعودي)
                        </div>
                    </div>

                    <!-- Signatures -->
                    <div class="signature-section">
                        <div class="section-header">التوقيعات والاعتماد</div>
                        <table class="signature-table">
                            <tr>
                                <td>
                                    <div class="signature-title">المحاسب المختص</div>
                                    <div class="signature-name">${accountantName}</div>
                                    <div class="signature-line"></div>
                                    <div class="signature-label">التوقيع والتاريخ</div>
                                </td>
                                <td>
                                    <div class="signature-title">المدقق المالي</div>
                                    <div class="signature-name">${reviewerName}</div>
                                    <div class="signature-line"></div>
                                    <div class="signature-label">التوقيع والتاريخ</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer-info">
                    <span>نظام حساب البدلات الإلكتروني</span>
                    <span>معهد سلاح المشاة - القوات البرية الجنوبية</span>
                    <span>SYS-${Date.now().toString().slice(-6)}</span>
                </div>
            </div>

            <script>
                function formatCurrency(amount) {
                    return new Intl.NumberFormat('ar-SA', {
                        style: 'currency',
                        currency: 'SAR',
                        minimumFractionDigits: 2
                    }).format(amount);
                }
                
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                }
            </script>
        </body>
        </html>
    `);
    reportWindow.document.close();
}
