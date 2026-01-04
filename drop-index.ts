import connect from './lib/db';
import mongoose from 'mongoose';

async function dropIndex() {
    try {
        console.log('Connecting to database...');
        await connect();

        const collection = mongoose.connection.collection('students');

        console.log('Checking indexes on students collection...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        const hasRollNoIndex = indexes.some(idx => idx.name === 'rollNo_1');

        if (hasRollNoIndex) {
            console.log('Dropping rollNo_1 index...');
            await collection.dropIndex('rollNo_1');
            console.log('Index rollNo_1 dropped successfully.');
        } else {
            console.log('Index rollNo_1 not found.');
        }

        console.log('Success! Mongoose will recreate the index with the correct "sparse" property on the next start.');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping index:', error);
        process.exit(1);
    }
}

dropIndex();
