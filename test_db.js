const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const p = await Product.findOne({});
    console.log(JSON.stringify(p, null, 2));
    process.exit(0);
}

run();
