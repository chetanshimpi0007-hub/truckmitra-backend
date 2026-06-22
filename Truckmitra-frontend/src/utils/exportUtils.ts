import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Convert to CSV string
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to Excel (.xlsx) format
 */
export const exportToExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Write and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export data to PDF format using jsPDF and jspdf-autotable
 */
export const exportToPDF = (data: any[], filename: string, title: string = 'Report') => {
    if (!data || data.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Extract headers and rows
    const headers = Object.keys(data[0]);
    const body = data.map(row => headers.map(header => row[header] ? String(row[header]) : ''));
    
    // Generate table
    autoTable(doc, {
        head: [headers],
        body: body,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [79, 70, 229] } // Indigo-600 to match TruckMitra theme
    });
    
    // Save file
    doc.save(`${filename}.pdf`);
};
