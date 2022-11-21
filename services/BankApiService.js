// import { getDb } from '../db/conn.js';
// import { autoGet, authPost } from '../helpers/dbHelper';

import {
    getClientAssertion,

    getClientCredentialsToken,
    createAccountAccessConsent,
    InitiateConsentAuthorisation,
    getAccessToken2,
    getCustomerAccounts,
    refreshAccessToken,

    getConsents,

    authGet,
    authPost,
    authDelete
} from '../helpers/bankApiHelper.js';

const bankApiService = {
    getClientAssertion: (project) => {
        return getClientAssertion(project);
    },

    process: async (params) => {
        const apiConfig = params.apiConfig;
        var credentialsToken = null;
        var consentId = null;
        try {
            // STEP 1
            console.log('1. getClientCredentialsToken');
            const tokenInfo = await getClientCredentialsToken(apiConfig);
            credentialsToken = tokenInfo.access_token;
            console.log('credentials token = ' + credentialsToken);
            console.log('');

            // STEP 2
            console.log('2. createAccountAccessConsent');
            const {data, links} = await createAccountAccessConsent({
                access_token: credentialsToken,
                apiConfig
            });
            // console.log('data: ', data);
            // console.log('links: ', links);
            consentId = data.consentId;
            console.log('consent id = ' + consentId);
            console.log('');

            // STEP 3
            console.log('3. InitiateConsentAuthorisation');
            console.log('state = ' + params.state);
            const consentRes = await InitiateConsentAuthorisation({
                consentId, 
                state: params.state,
                apiConfig
            });
            console.log('');

            if (consentRes) {
                return {
                    command: 'redirect',
                    url: consentRes.url
                }
            }
        } catch(err) {
            console.error('process error');
            // console.log('err: ', err.message);
        }
    },

    getTokenInfo: async(payload) => {
        const res = await getAccessToken2(payload);
        // console.log('BankApiService.getTokenInfo: res: ', res);
        return res.data;
    },

    refreshAccessToken: async (bankApiInfo, apiConfig) => {
        const options = {
            url: apiConfig.token_endpoint,
            api_server: apiConfig.api_server,
            api_endpoint: apiConfig.api_endpoint,
            certKey: {
                cert: apiConfig.transportCert,
                key: apiConfig.privateKey
            }
        };
        const submitPayload = {
            refresh_token: bankApiInfo.tokenInfo.refresh_token,
            client_assertion: bankApiInfo.clientAssertion,
            client_assertion_type: apiConfig.client_assertion_type,
            redirect_uri: apiConfig.authorize_callbackURL
        };
        try {
            const res = await refreshAccessToken({
                paramInfo: submitPayload,
                options: options
            })
            return res;
        } catch( err) {
            throw err;
        }
    },

    // refreshAccessToken0: async (payload) => {
    //     // console.log('BankApiService.refreshAccessToken: payload: ', payload);
    //     // console.log('BankApiService.refreshAccessToken: config: ', config);
    //     const bodyInfo = payload.bodyInfo;
    //     const options = payload.options;

    //     const tokenPayload = {
    //         refresh_token: bodyInfo.refreshToken,
    //         client_assertion_type: bodyInfo.clientAssertionType,
    //         client_assertion: bodyInfo.clientAssertion,
    //         redirect_uri: bodyInfo.callbackUrl
    //     };
    //     console.log('BankApiService.refreshAccessToken: tokenPayload: ', tokenPayload);

    //     const res = await refreshAccessToken({
    //         paramInfo: tokenPayload,
    //         options: options
    //     });

    //     return res;
    // },

    getAccountBalances: async (bankApiInfo, apiConfig, accountId) => {
        const accessToken = bankApiInfo.tokenInfo.access_token;
        const urlCommand = '/accounts/' + accountId + '/balances';
        const headers = {
            'Accept': 'application/json',
            'x-fapi-financial-id': apiConfig.fapi
        };
        const apiOptions = {
            api_server: apiConfig.api_server,
            api_endpoint: apiConfig.api_endpoint,
            certKey: {
                cert: apiConfig.transportCert,
                key: apiConfig.privateKey
            }
        };
        const result = await authGet(urlCommand, accessToken, headers, apiOptions);
        return result;
    },

    getTransactions: async (bankApiInfo, apiConfig, accountId) => {
        console.log('getTransactions 1');
        const accessToken = bankApiInfo.tokenInfo.access_token;
        const urlCommand = '/accounts/' + accountId + '/transactions';
        const headers = {
            'Accept': 'application/json',
            'x-fapi-financial-id': apiConfig.fapi
        };
        const apiOptions = {
            api_server: apiConfig.api_server,
            api_endpoint: apiConfig.api_endpoint,
            certKey: {
                cert: apiConfig.transportCert,
                key: apiConfig.privateKey
            }
        };
        const query = {
            fromDate: '2022-01-01',
            toDate: '2022-09-30'
        };
        var result = null;
        try {
            result = await authGet(urlCommand, accessToken, headers, apiOptions, query);            
        } catch(err) {
            console.log('getTransactions: error: ', err);
        }
        console.log('getTransactions: result: ', result);
        return result;
    },

    getEvents: async  (bankApiInfo, apiConfig) => {
        const accessToken = bankApiInfo.tokenInfo.access_token;
        const urlCommand = '/events';
        const headers = {
            'Content-Type': 'application/json',
            // 'x-fapi-auth-date': '',
            // 'x-fapi-customer-ip-address': '',
            // 'x-fapi-interaction-id': '',
            // 'Accept-Language': ''
        };
        const apiOptions = {
            api_server: apiConfig.api_server,
            api_endpoint: apiConfig.api_endpoint,
            certKey: {
                cert: apiConfig.transportCert,
                key: apiConfig.privateKey
            }
        };
        const data = {
            "ack": ["string"],
            "returnImmediately": true,
            "maxEvents": 0
        };
        try {
            const result = await authPost(
                urlCommand, 
                accessToken, 
                headers, 
                apiOptions,
                data);

            console.log('getEvents: result: ', result);

            return result.data
        } catch(err) {
            console.error('getEvents error');
            throw err;
        }
    },

    getCustomerAccounts: async (bankApiInfo, apiConfig) => {
        const accessToken = bankApiInfo.tokenInfo.access_token;
        const headers = {
            'Accept': 'application/json',
            'x-fapi-financial-id': apiConfig.fapi
        };
        const apiOptions = {
            api_server: apiConfig.api_server,
            api_endpoint: apiConfig.api_endpoint,
            certKey: {
                cert: apiConfig.transportCert,
                key: apiConfig.privateKey
            }
        };
        const result = await authGet(
            '/accounts',
            accessToken,
            headers,
            apiOptions
        );
        console.log('getCustomerAccounts: result.data: ', result.data);
        return result.data.account;
    },

    getConsents: async (accessToken) => {
        return await getConsents(accessToken);
    },

    deleteApi: async (userId, url) => {

    }

}

export default bankApiService;