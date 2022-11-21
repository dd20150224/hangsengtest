import https from 'https';
import axios from 'axios';
// import { 
//     config
// } from '../apiConst.js';
import { KEYUTIL, KJUR } from 'jsrsasign';

const getRequestJwt = (options) => {
    const config = options.apiConfig;
    const joseHeader = {
        alg: "PS256",
        kid: config.kid        
    };
    const exp = Math.round(new Date().getTime()/1000) + 1200; // 20 min
    const payload = {
        claims: {
            userinfo: {
                openbanking_intent_id: {
                    value: options.consentId,
                    essential: true
                }
            },
            id_token: {
                openbanking_intent_id: {
                    value: options.consentId,
                    essential: true
                },
                acr: {
                    essential: false,
                    values: [
                        'urn:openbanking:psd2:sca',
                        'urn:openbanking:psd2:ca'
                    ]
                }
            }
        },
        iss: config.clientId,
        aud: config.api_server,
        response_type: options.responseType,
        client_id: config.clientId,
        state: options.state,
        exp: exp,
        redirect_uri: config.authorize_callbackURL,
        nonce: options.nonce,
        scope: 'openid ' + config.scope
    };

    // console.log('getRequestJwt: payload; ', JSON.stringify(payload,4));
    const prvKey = KEYUTIL.getKey(config.PKCS8PEM);
    // console.log('getRequestJwt: prvKey: ', prvKey);
    var requestJwt = KJUR.jws.JWS.sign(
        "PS256",
        JSON.stringify(joseHeader),
        JSON.stringify(payload),
        prvKey
    );
    // console.log('requestJwt: ', requestJwt);
    return requestJwt;
};

const getClientAssertion = (config) => {

    var validPeriodInSec = 200;
    var expiryTime = Math.round(new Date().getTime()/1000) + 3600; // 1200;
    var joseHeader = {
        alg: "PS256",
        kid: config.kid
    };
    var payload = {
        iss: config.clientId,
        aud: config.token_endpoint,
        sub: config.clientId,
        exp: expiryTime
    };
    const prvKey = KEYUTIL.getKey(config.PKCS8PEM);
    // console.log('joseHeader: ', joseHeader);
    // console.log('payload: ', payload);
    const clientAssertion = KJUR.jws.JWS.sign(
        "PS256",
        JSON.stringify(joseHeader),
        JSON.stringify(payload),
        prvKey);
    return clientAssertion;
};

const getClientCredentialsToken = async (apiConfig) => {
    //payload) => {
    var result = null;
    // console.log('Step 1: get client credentials token');

    const clientAssertion = apiConfig.clientAssertion; //  getClientAssertion();

    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', apiConfig.scope);
    params.append('client_assertion_type', clientAssertionType);
    params.append('client_assertion', clientAssertion);
    const options = {
        url: apiConfig.token_endpoint,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'POST',
        data: params.toString(),
        httpsAgent: new https.Agent({
            cert: apiConfig.transportCert, //  transportCertStr,
            key: apiConfig.privateKey // privateKeyStr
        })
    };
    // console.log('getClientCredentialsToken: options: ', options);
    try {
        const res = await axios(options);
        result = res.data;
    } catch(err) {
        console.error('getClientCredentialsToken error: err.message = ' + err.message);
        console.error('getClientCredentialsToken error: err.code = ' + err.code);
        throw err;
    }
    return result;
};

const createAccountAccessConsent = async (payload) => {
    var result = null;
    const config = payload.apiConfig;
    const options = {
        url: config.api_server + '/' + config.account_consents_path,
        headers: {
            'Authorization': 'Bearer ' + payload.access_token,
            'x-fapi-financial-id': config.fapi,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        data: config.accounts_consent,
        httpsAgent: new https.Agent({
            cert: config.transportCert, //  transportCertStr,
            key: config.privateKey // privateKeyStr
        })
    };
    try {
        const res = await axios(options)
        result = res.data;
    } catch (err) {
        console.error('createAccountAccessConsent error: err.message = ' + err.message);
        console.error('createAccountAccessConsent error: err.code = ' + err.code);
        throw err;
    }
    return result;
};

const InitiateConsentAuthorisation = async (payload) => {
    var result = null;
    const config = payload.apiConfig;
    const authorizeResponseType = 'code id_token';
    const authorizeState = payload.state;
    const authorizeNonce = 'dummy-nonce';    

    const authorizeRequestJwt = getRequestJwt({
        consentId: payload.consentId,
        responseType: authorizeResponseType,
        state: authorizeState,
        nonce: authorizeNonce,
        apiConfig: config
    });

    const url = config.authorize_endpoint + 
        '?response_type=' + encodeURIComponent(authorizeResponseType) + 
        '&client_id=' + config.clientId +
        '&state=' + authorizeState +
        '&scope=' + encodeURIComponent('openid ' + config.scope) +
        '&nonce=' + authorizeNonce +
        '&redirect_uri=' + config.authorize_callbackURL +
        '&request=' + authorizeRequestJwt;
    
    // console.log('url = ' + url);

    const options = {
        url: url,
        method: 'GET',
        httpsAgent: new https.Agent({
            cert: config.transportCert, //  transportCertStr,
            key: config.privateKey // privateKeyStr
        })
    };

    // console.log('options');
    try {
        const res = await axios(options);
        // console.log('res.status = ' + res.status);
        // console.log('res.config.url = ' + res.config.url);
        result = {
            url: res.config.url
        };
    } catch (err) {
        console.error('InitiateConsentAuthorisation error: err.message = ' + err.message);
        console.error('InitiateConsentAuthorisation error: err.code = ' + err.code);
        throw err;
    }
    return result;
};

const getAccessToken2 = async (payload) => {
    const config = payload.apiConfig;
    const params = new URLSearchParams();

    params.append('grant_type', 'authorization_code');
    params.append('code', payload.code);
    params.append('client_assertion_type', config.client_assertion_type);
    params.append('client_assertion', config.clientAssertion);    
    params.append('redirect_uri', config.authorize_callbackURL);

    // console.log('getAccessToken: params.toString() = ' + params.toString());
    // console.log('getAccessToken: config.transportCert: ', config.transportCert);
    // console.log('getAccessToken: config.privateKey: ' + config.privateKey);
    
    const options = {
        url: config.token_endpoint,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'POST',
        data: params.toString(),
        httpsAgent: new https.Agent({
            cert: config.transportCert, //  transportCertStr,
            key: config.privateKey // privateKeyStr
        })
    };
    // console.log('bankApiHelper getAccessToken  options: ', options);
    try {
        const res = await axios(options);
        return res;
        console.log('getAccessToken: result: ', result);
    } catch(err) {
        console.error('getAccessToken error: err.message = ' + err.message);
        console.error('getAccessToken error: err.code = ' + err.code);
        throw err;
    }
};



const getConsents = async (accessToken) => {
    const options = {
        url: config.api_server + '/account-consents',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            'x-fapi-financial-id': config.fapi
        },
        method: 'POST',
        httpsAgent: new https.Agent({
            cert: config.transportCert, //  transportCertStr,
            key: config.privateKey // privateKeyStr
        })
    };
    try {
        const res = await axios(options);
        console.log('getConsents: res: ', res);
        return res.data;
    } catch(err) {
        console.error('getConsents error: err.message = ' + err.message);
        console.error('getConsents error: err.code = ' + err.code);
        throw err;
    }
    return true;

};

const getCustomerAccounts = async (accessToken) => {
    const options = {
        url: config.api_server + '/' + config.accounts_path,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Accept': 'application/json',
            'x-fapi-financial-id': config.fapi
        },
        method: 'GET',
        httpsAgent: new https.Agent({
            cert: config.transportCert, //  transportCertStr,
            key: config.privateKey // privateKeyStr
        })
    };
    try {
        const res = await axios(options);
        return res.data;
        // console.log('getAccessToken: result: ', result);
    } catch(err) {
        console.error('getCustomerAccounts error: err.message = ' + err.message);
        console.error('getCustomerAccounts error: err.code = ' + err.code);
        throw err;
    }
    return true;
};

const refreshAccessToken = async (payload) => {
    console.log('bankApiHelper.refreshAccessToken');
    try {
        const res =  await getToken('refresh_token', payload);
        return res;
    } catch (err) {
        throw err;
    }
};

const getToken = async (grantType, payload) => {
    const paramInfo = payload.paramInfo;
    const payloadOptions = payload.options;

    console.log('bankApiHelper.getToken: paramInfo: ', paramInfo);
    console.log('bankApiHelper.getToken: payloadOptions: ', payloadOptions);

    // console.log('getToken: payload: ', payload);
    const params = new URLSearchParams();
    params.append('grant_type', grantType);

    for (let key in paramInfo) {
        params.append(key, paramInfo[key]);
    }
    // console.log('getToken: params.toString() = ' + params.toString());
    const options = {
        url: payloadOptions.url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'POST',
        data: params.toString(),
        httpsAgent: new https.Agent(payloadOptions.certKey)
    };
    console.log('gettoken: grantType = ' + grantType);
    // console.log('getToken: options: ', options);

    try {
        const res = await axios(options);
        return res.data;
        console.log('getAccessToken: result: ', result);
    } catch(err) {
        console.error('getToken error: err.message = ' + err.message);
        console.error('getToken error: err.code = ' + err.code);
        throw err;
    }
    return null;
};

const authPost = async(urlCommand, accessToken, inputHeaders={}, apiOptions, data={}) => {
    
    console.log('authPost: urlCommand = ' + urlCommand);
    console.log('authPost: accessToken = ' + accessToken);

    const headers = {
        'Authorization': 'Bearer ' + accessToken,
        ...inputHeaders
    };
    const url = apiOptions.api_server + apiOptions.api_endpoint + urlCommand;
    const options = {
        url,
        headers,
        method: 'POST',
        httpsAgent: new https.Agent(apiOptions.certKey),
        data
    };
    try {
        const res = await axios(options);
        return res.data;
    } catch(err) {
        console.error('authPost error');
        throw new Error(err.response.status);
    }
};

const authGet = async(urlCommand, accessToken, inputHeaders={}, apiOptions, params=null) => {
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
        ...inputHeaders
    };
    console.log('authGet: headers: ', headers);
    const url = apiOptions.api_server + apiOptions.api_endpoint + urlCommand;
    console.log('authGet: url = ' + url);
    const options = {
        url: url,
        headers,
        method: 'GET',
        httpsAgent: new https.Agent(apiOptions.certKey)
    };
    if (params) {
        options['params'] = params;
    }
    console.log('options');
    try {
        console.log('=>axios');
        const res = await axios(options);
        console.log('after axios: res: ', res);

        return res.data;
    } catch(err) {
        console.log('authGet error err.data.status = ' + err.data.status);
        throw err;
    }
};

const authDelete = async(urlCommand, accessToken) => {

};
export {
    getClientAssertion,

    getClientCredentialsToken,
    createAccountAccessConsent,
    InitiateConsentAuthorisation,

    getAccessToken2,
    refreshAccessToken,

    getCustomerAccounts,

    getConsents,

    authPost,
    authGet,
    authDelete
}