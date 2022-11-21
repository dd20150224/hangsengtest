import { 
    dbDeleteMany,
    dbDeleteOne,
    findAll, findOne, dbUpdateOne
} from '../helpers/dbHelper';

import clientPromise from '../lib/mongodb';

const BankQueryService = {
    addQuery: async(payload) => {        
        const client = await clientPromise;        
        const db = client.db(process.env.DB_NAME);
        
        const user = payload.user;
        const project = payload.project;

        // console.log('addUser user: ', user);
        const res = await db.collection('bankQuery').insertOne({
            handled: false,
            userId: user._id,
            projectId: project._id,
            clientAssertion: payload.clientAssertion
        });
        const queryItem = await db.collection('bankQuery').findOne({_id: res.insertedId});
        // console.log('addUser: queryItem: ', queryItem);
        return queryItem;
    },

    updateQuery: async(objId, payload) => {
        console.log('BankQueryService updateQuery objId (' +
            (typeof objId) + '): ' + objId);
        console.log('BankQuerySerivce: updateQuery: payload: ', payload);
        const res = await dbUpdateOne('bankQuery', {_id: objId}, payload);
    },

    getQuery: async (objId) => {
        return await findOne( 'bankQuery', {_id: objId});
    },
    // getQuery: async(objId) => {
    //     const db = getDb();
    //     const query = await db.collection('bankQuery').findOne({_id: objId});
    //     return query;
    // },

    removeQuery: async (objId) => {
        return await dbDeleteOne('bankQuery', {_id:objId});    
    },
    // removeQuery: async(objId) => {
    //     const db = getDb();
    //     const query = await db.collection('bankQuery').deleteOne({_id: objId});
    //     return query;
    // },

    removeQueryByUser: async(projectId, userId) => {
        return await dbDeleteMany(
            'bankQuery',
            {
                projectId,
                userId
            }
        );
    }
}

export default BankQueryService;
