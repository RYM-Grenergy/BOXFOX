const fs = require('fs');
const XLSX = require('xlsx');
const workbook = XLSX.readFile('NQ v2.8.xlsx');
const mainSheet = workbook.Sheets['Main'];
let formulas = [];
for (let R = 1; R <= 10; R++) {
    for (let C = 0; C < 50; C++) {
        let cell_addr = XLSX.utils.encode_cell({r:R, c:C});
        let cell = mainSheet[cell_addr];
        if (cell && cell.f) {
            formulas.push(`Cell ${cell_addr}: Formula: ${cell.f}`);
        }
    }
}
fs.writeFileSync('formula.json', JSON.stringify(formulas, null, 2), 'utf8');
