import { Filter, Document, UpdateFilter } from 'mongodb';
import clientPromise from '../lib/mongodb';

export const dbDeleteMany = async(collectionName) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    const result = await collection.deleteMany({});
    return result;
}

export const dbDeleteOne = async(collectionName, criteria) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(criteria);
    return result;
}

export const findAll = async(collectionName: string) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    const cursor = collection.find();
    const result = await cursor.toArray();
    return result;
}

export const findOne = async(collectionName: string, criteria: { name?: any; _id?: any; }) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    const row = collection.findOne(criteria);
    return row;
}

export const dbUpdateOne = async(collectionName: string, criteria: Filter<Document>, setData: Partial<Document> | UpdateFilter<Document>) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    await collection.updateOne(
        criteria,
        { $set: setData},
        { upsert: true }
    );
    const row = collection.findOne(criteria);
    return row;
}

export const dbUpdateOneUnset = async(collectionName: string, criteria: Filter<Document>, setData: Partial<Document> | UpdateFilter<Document>) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collectionName);
    await collection.updateOne(
        criteria,
        { $unset: setData}
    );
    const row = collection.findOne(criteria);
    return row;
}




// function collectionName(collectionName: any) {
//     throw new Error('Function not implemented.');
// }
