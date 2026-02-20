const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/boxfox";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const count = await mongoose.connection.db.collection('products').countDocuments();
    console.log('Total Products in MongoDB:', count);
    const sample = await mongoose.connection.db.collection('products').findOne();
    console.log('Sample Product:', JSON.stringify(sample, null, 2));
    await mongoose.disconnect();
}
check();
