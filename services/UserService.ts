// import { Console } from 'console';
// import clientPromise from '../lib/mongodb';
import { 
    findAll, 
    findOne, 
    dbUpdateOne,
    dbUpdateOneUnset
} from '../helpers/dbHelper';
import { authGet } from '../helpers/bankApiHelper';

// services
import BankApiService from './BankApiService.js';

const UserService = {
    getAll: async () => {
        return await findAll('users');
    },

    getByName: async (name) => {
        return await findOne('users', {name});
    },

    get: async (id) => {
        return await findOne('users', {_id: id});
    },

    getFirst: async()=>{
        return await findOne('users', {});
    },

    getDemoUser: async() => {
        return await findOne('users', {name: 'User 1'});
    },

    updateBankApiInfo: async(userId, bankApiInfo) => {
        return await dbUpdateOne('users', 
            {_id: userId}, 
            {bankApiInfo}
        );
    },    
    
    updateTokenInfo: async(userId, tokenInfo) => {
        return await dbUpdateOne('users', 
            {_id: userId},
            {'bankApiInfo.tokenInfo': tokenInfo},
        );
    },

    updateBankAccounts: async(userId, bankAccounts) => {
        return await dbUpdateOne('users',            
            {_id: userId}, 
            {'bankAccounts': bankAccounts}    
        );        
    },

    clearBankAccounts: async(userId) => {
        return await dbUpdateOneUnset('users',
            {_id: userId},
            {'bankAccounts': 1}
        );
    },

    updateAccountTransactions: async (userId, accountId, transactions) => {
        return await dbUpdateOne('users', 
            {_id: userId, 'bankAccounts.accountId': accountId},
            {'bankAccounts.0.transactions': transactions}
        );
    },

    clearBankApiInfo: async(userId) => {
        return await dbUpdateOne('users',
            {_id: userId},
            {bankApiInfo: null}
        );
    },

    getBankApiInfo: async (userId) => {
        const user = await findOne('users', {_id: userId});
        return user ? user.bankApiInfo : null;
    },

    getTokenInfo: async(userId) => {
        const result = await UserService.getBankApiInfo(userId);
        return result ? result.tokenInfo : null;
    },

    getUserAccessToken: async (userId) => {
        const tokenInfo = await UserService.getTokenInfo(userId);
        console.log('getUserAccessToken: ', tokenInfo);
        return tokenInfo ? tokenInfo.access_token : null;
    },

}

export default UserService;
