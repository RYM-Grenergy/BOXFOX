const XLSX = require('xlsx');

const workbook = XLSX.readFile('NQ v2.8.xlsx');
console.log('Sheets:', workbook.SheetNames);

// read the first sheet
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('--- Columns (first 2 rows) ---');
console.log(data[0]);
console.log(data[1]);

// Let's also look at how many rows we have
console.log('Total rows:', data.length);
