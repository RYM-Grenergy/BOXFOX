const XLSX = require('xlsx');
const workbook = XLSX.readFile('NQ v2.8.xlsx');
// let's look at the "Price" sheet or similar to find how price maps
const sheetNames = workbook.SheetNames;
console.log("Sheets:", sheetNames);
const mainSheet = workbook.Sheets['Main'];
const data = XLSX.utils.sheet_to_json(mainSheet, { header: 1 });
console.log("Main Sheet Row 1 (Headers):");
console.log(data[0]);

// Let's find any cell with a formula in the first few rows
for (let R = 1; R <= 5; R++) {
    for (let C = 0; C < 50; C++) {
        let cell_addr = XLSX.utils.encode_cell({r:R, c:C});
        let cell = mainSheet[cell_addr];
        if (cell && cell.f) {
            console.log(`Cell ${cell_addr}: Formula: `, cell.f);
        }
    }
}
