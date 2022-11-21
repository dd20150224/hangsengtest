import { ObjectId } from 'mongodb';

import ProjectService from 'services/ProjectService';
import UserService from 'services/UserService';
import BankApiService from 'services/BankApiService';

import { createApiConfig } from 'helpers/apiConfigHelper';

/*
return {
    "account": [
        {
            "accountId": "123456781",
            "balance": [
                {
                    "type": "availableBalance",
                    "creditDebitIndicator": "Debit",
                    "amount": "9255.48",
                    "currency": "HKD",
                    "datetime": "2022-10-23T13:13:37.892Z"                    
                },
                {
                    "type": "ledgerBalance",
                    "creditDebitIndicator": "Debit",
                    "amount": "9305.48",
                    "currency": "HKD",
                    "datetime": "2022-10-23T13.13.37.892Z"                    
                }
            ]
        }
    ]


}

*/

export default async (req, res) => {
    console.log('events: req.query: ', req.query);

    const accountId = req.query.accountId;
    const projectId = new ObjectId(req.query.projectId);
    const userId = new ObjectId(req.query.userId);

    const project = await ProjectService.get(projectId);
    const apiConfig = createApiConfig(project);

    try {
        let bankApiInfo = await UserService.getBankApiInfo(userId);
        console.log('bankApiInfo: ', bankApiInfo);
        if (bankApiInfo.tokenInfo === true) {
            return res.json([]);
        } else {
            const tokenInfo = await BankApiService.refreshAccessToken(bankApiInfo, apiConfig);
            if (tokenInfo) {
                console.log('Refresh token : tokenInfo: ', tokenInfo);
                await UserService.updateTokenInfo(userId, tokenInfo);
                bankApiInfo = await UserService.getBankApiInfo(userId);
                console.log('=> getTransactions');
                const eventResult = await BankApiService.getTransactions(bankApiInfo, apiConfig, accountId);
                return res.json(eventResult.data);
            } else {
                return res.json([]);
            }
        }
    } catch(err) {
        console.log('api/accounts/[accountId]/balanaces error');
        return res.json([]);
    }
}