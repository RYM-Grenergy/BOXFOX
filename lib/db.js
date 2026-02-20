import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

export const db = {
    read: (filename) => {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        if (!fs.existsSync(filePath)) return null;
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`Error reading ${filename}.json:`, e);
            return null;
        }
    },
    write: (filename, data) => {
        const filePath = path.join(DATA_DIR, `${filename}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (e) {
            console.error(`Error writing ${filename}.json:`, e);
            return false;
        }
    }
};
