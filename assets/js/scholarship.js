// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Auto-calculate when inputs change
    const inputs = ['startDate', 'endDate', 'currentSalary', 'previousSalary'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', autoCalculate);
            element.addEventListener('input', autoCalculate);
        }
    });
    
    // Set default dates
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startDateEl = document.getElementById('startDate');
    const endDateEl = document.getElementById('endDate');
    
    if (startDateEl) startDateEl.value = formatDate(firstDayOfMonth);
    if (endDateEl) endDateEl.value = formatDate(today);
}

// Auto calculate with debounce
let calculateTimeout;
function autoCalculate() {
    clearTimeout(calculateTimeout);
    calculateTimeout = setTimeout(() => {
        if (isFormValid()) {
            calculateScholarship();
        }
    }, 500);
}

// Check if form is valid
function isFormValid() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const currentSalary = document.getElementById('currentSalary')?.value;
    
    return startDate && endDate && currentSalary && parseFloat(currentSalary) > 0;
}

// Calculate scholarship allowance
function calculateScholarship() {
    console.log('Starting scholarship calculation...');
    
    if (!isFormValid()) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        const result = performScholarshipCalculation();
        console.log('Calculation result:', result);
        displayResults(result);
        displayPeriodDetails(result.periodDetails);
    } catch (error) {
        console.error('Calculation error:', error);
        alert('حدث خطأ في الحساب: ' + error.message);
    }
}

// Perform the actual scholarship calculation
function performScholarshipCalculation() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const previousSalary = parseFloat(document.getElementById('previousSalary').value) || currentSalary;
    
    console.log('Input values:', { startDate, endDate, currentSalary, previousSalary });
    
    // Validate dates
    if (endDate <= startDate) {
        throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
    }
    
    // Calculate period details
    const periodDetails = calculatePeriodDetails(startDate, endDate);
    console.log('Period details:', periodDetails);
    
    // Calculate scholarship allowance with proper 90-day distribution
    const result = calculateScholarshipWithProperDistribution(periodDetails, currentSalary, previousSalary);
    
    return {
        totalDays: periodDetails.totalDays,
        totalAllowance: result.totalAllowance,
        yearlyCalculations: result.yearlyCalculations,
        periodDetails: periodDetails,
        first90Distribution: result.first90Distribution
    };
}

// Calculate scholarship with proper 90-day distribution across years
function calculateScholarshipWithProperDistribution(periodDetails, currentSalary, previousSalary) {
    const currentYear = new Date().getFullYear();
    let remainingFirst90Days = 90;
    let totalAllowance = 0;
    const yearlyCalculations = [];
    const first90Distribution = [];
    
    // First pass: distribute the first 90 days across years
    for (const yearData of periodDetails.years) {
        const salary = yearData.year === currentYear ? currentSalary : previousSalary;
        const dailyRate75 = (salary * 0.75) / 30;
        const dailyRate37_5 = (salary * 0.375) / 30;
        
        let first90DaysThisYear = 0;
        let remainingDaysThisYear = 0;
        let first90Allowance = 0;
        let remainingAllowance = 0;
        
        if (remainingFirst90Days > 0) {
            // Still have first 90 days to distribute
            first90DaysThisYear = Math.min(yearData.days, remainingFirst90Days);
            remainingFirst90Days -= first90DaysThisYear;
            first90Allowance = first90DaysThisYear * dailyRate75;
            
            // Track first 90 days distribution
            if (first90DaysThisYear > 0) {
                first90Distribution.push({
                    year: yearData.year,
                    days: first90DaysThisYear,
                    salary: salary,
                    allowance: first90Allowance
                });
            }
            
            // Remaining days in this year (if any) at 37.5%
            remainingDaysThisYear = yearData.days - first90DaysThisYear;
            if (remainingDaysThisYear > 0) {
                remainingAllowance = remainingDaysThisYear * dailyRate37_5;
            }
        } else {
            // All days in this year are at 37.5%
            remainingDaysThisYear = yearData.days;
            remainingAllowance = remainingDaysThisYear * dailyRate37_5;
        }
        
        const yearTotalAllowance = first90Allowance + remainingAllowance;
        
        yearlyCalculations.push({
            year: yearData.year,
            days: yearData.days,
            salary: salary,
            first90Days: first90DaysThisYear,
            remainingDays: remainingDaysThisYear,
            first90Allowance: first90Allowance,
            remainingAllowance: remainingAllowance,
            totalAllowance: yearTotalAllowance
        });
        
        totalAllowance += yearTotalAllowance;
    }
    
    return {
        totalAllowance,
        yearlyCalculations,
        first90Distribution
    };
}

// Calculate period details (30 days per month, 360 days per year)
function calculatePeriodDetails(startDate, endDate) {
    const years = [];
    const currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    let totalDays = 0;
    
    for (let year = currentYear; year <= endYear; year++) {
        let yearStartDate, yearEndDate;
        
        if (year === currentYear && year === endYear) {
            yearStartDate = startDate;
            yearEndDate = endDate;
        } else if (year === currentYear) {
            yearStartDate = startDate;
            yearEndDate = new Date(year, 11, 30);
        } else if (year === endYear) {
            yearStartDate = new Date(year, 0, 1);
            yearEndDate = endDate;
        } else {
            yearStartDate = new Date(year, 0, 1);
            yearEndDate = new Date(year, 11, 30);
        }
        
        const days = calculateDaysBetween(yearStartDate, yearEndDate);
        
        if (days > 0) {
            years.push({ year, days });
            totalDays += days;
        }
    }
    
    return {
        totalDays,
        years,
        startDate,
        endDate
    };
}

// Calculate days between two dates (30 days per month system)
function calculateDaysBetween(start, end) {
    const startYear = start.getFullYear();
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    
    const adjustedStartDay = Math.min(startDay, 30);
    const adjustedEndDay = Math.min(endDay, 30);
    
    const totalStartMonths = (startYear * 12) + startMonth;
    const totalEndMonths = (endYear * 12) + endMonth;
    
    let totalDays = 0;
    
    if (totalStartMonths === totalEndMonths) {
        totalDays = adjustedEndDay - adjustedStartDay + 1;
    } else {
        totalDays += (30 - adjustedStartDay + 1);
        const monthsBetween = totalEndMonths - totalStartMonths - 1;
        totalDays += monthsBetween * 30;
        totalDays += adjustedEndDay;
    }
    
    return Math.max(0, totalDays);
}

// Display calculation results
function displayResults(result) {
    const resultsCard = document.getElementById('resultsCard');
    const resultsContent = document.getElementById('resultsContent');
    
    if (!resultsCard || !resultsContent) {
        console.error('Results elements not found');
        return;
    }
    
    let html = '';
    
    // First 90 days distribution
    if (result.first90Distribution && result.first90Distribution.length > 1) {
        html += '<h6 class="mb-3">توزيع أول 90 يوم (75%):</h6>';
        html += '<div class="alert alert-success mb-3">';
        result.first90Distribution.forEach(dist => {
            html += `
                <div class="d-flex justify-content-between">
                    <span>سنة ${dist.year}: ${dist.days} يوم (راتب: ${formatCurrency(dist.salary)})</span>
                    <span><strong>${formatCurrency(dist.allowance)}</strong></span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Yearly breakdown
    if (result.yearlyCalculations.length > 1) {
        html += '<h6 class="mb-3">التفصيل السنوي:</h6>';
        result.yearlyCalculations.forEach(calc => {
            html += `
                <div class="scholarship-breakdown">
                    <h6>سنة ${calc.year} (${calc.days} يوم - راتب: ${formatCurrency(calc.salary)})</h6>
                    ${calc.first90Days > 0 ? `
                    <div class="breakdown-item">
                        <span class="breakdown-label">أول ${calc.first90Days} يوم (75%)</span>
                        <span class="breakdown-value">${formatCurrency(calc.first90Allowance)}</span>
                    </div>
                    ` : ''}
                    ${calc.remainingDays > 0 ? `
                    <div class="breakdown-item">
                        <span class="breakdown-label">${calc.first90Days > 0 ? 'الأيام المتبقية' : 'جميع الأيام'} ${calc.remainingDays} يوم (37.5%)</span>
                        <span class="breakdown-value">${formatCurrency(calc.remainingAllowance)}</span>
                    </div>
                    ` : ''}
                    <div class="breakdown-item">
                        <span class="breakdown-label"><strong>إجمالي السنة</strong></span>
                        <span class="breakdown-value"><strong>${formatCurrency(calc.totalAllowance)}</strong></span>
                    </div>
                </div>
            `;
        });
    } else {
        // Single year calculation
        const calc = result.yearlyCalculations[0];
        html += `
            <div class="scholarship-breakdown">
                <h6>تفصيل الحساب (راتب: ${formatCurrency(calc.salary)}):</h6>
                ${calc.first90Days > 0 ? `
                <div class="breakdown-item">
                    <span class="breakdown-label">أول ${calc.first90Days} يوم (75%)</span>
                    <span class="breakdown-value">${formatCurrency(calc.first90Allowance)}</span>
                </div>
                ` : ''}
                ${calc.remainingDays > 0 ? `
                <div class="breakdown-item">
                    <span class="breakdown-label">${calc.first90Days > 0 ? 'الأيام المتبقية' : 'جميع الأيام'} ${calc.remainingDays} يوم (37.5%)</span>
                    <span class="breakdown-value">${formatCurrency(calc.remainingAllowance)}</span>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    // Summary
    html += `
        <div class="result-item">
            <div class="result-label">إجمالي أيام الابتعاث</div>
            <div class="result-value">${result.totalDays} يوم</div>
        </div>
    `;
    
    // Total
    html += `
        <div class="result-item total-result">
            <div class="result-label">إجمالي بدل الابتعاث</div>
            <div class="result-value">${formatCurrency(result.totalAllowance)}</div>
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsCard.style.display = 'block';
}

// Display period details
function displayPeriodDetails(periodDetails) {
    const detailsCard = document.getElementById('periodDetails');
    const detailsContent = document.getElementById('periodDetailsContent');
    
    if (!detailsCard || !detailsContent) {
        console.error('Period details elements not found');
        return;
    }
    
    const html = `
        <div class="period-item">
            <span class="period-label">تاريخ بداية الابتعاث</span>
            <span class="period-value">${formatDateArabic(periodDetails.startDate)}</span>
        </div>
        <div class="period-item">
            <span class="period-label">تاريخ نهاية الابتعاث</span>
            <span class="period-value">${formatDateArabic(periodDetails.endDate)}</span>
        </div>
        <div class="period-item">
            <span class="period-label">إجمالي أيام الابتعاث</span>
            <span class="period-value">${periodDetails.totalDays} يوم</span>
        </div>
        <div class="period-item">
            <span class="period-label">عدد السنوات</span>
            <span class="period-value">${periodDetails.years.length} سنة</span>
        </div>
        <div class="period-item">
            <span class="period-label">نظام الحساب</span>
            <span class="period-value">30 يوم/شهر، 360 يوم/سنة</span>
        </div>
    `;
    
    detailsContent.innerHTML = html;
    detailsCard.style.display = 'block';
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateArabic(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Print results
function printResults() {
    window.print();
}

// Export to PDF
function exportToPDF() {
    if (typeof jsPDF === 'undefined') {
        alert('مكتبة PDF غير متوفرة');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    doc.text('تقرير حساب بدل الابتعاث', 105, 20, { align: 'center' });
    
    doc.save('تقرير-بدل-الابتعاث.pdf');
}

