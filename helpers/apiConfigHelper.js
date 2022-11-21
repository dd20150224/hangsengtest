/*
{"data":{"permissions":["ReadAccountAvailability","ReadAccountStatus","ReadAccountBalance","ReadAccountTransaction"],"expirationDate":"2023-06-20T15:37:31.699Z","transactionFromDate":"2022-06-20T15:37:31.699Z","transactionToDate":"2022-06-20T15:37:31.699Z","balanceFromDate":"2022-06-20T15:37:31.699Z","balanceToDate":"2022-06-20T15:37:31.699Z"}}
*/
// import fs from 'fs';

const wKConfig = {
    "version": 1.0,
    "issuer": "https://secure.sandbox.ob.business.hangseng.com",
    "authorization_endpoint": "https://sandbox.ob.business.hangseng.com/open-banking/v1.1/oauth2/authorize",
    "registration_endpoint": "https://secure.sandbox.ob.business.hangseng.com/open-banking/v3.2/oauth2/register",
    "token_endpoint": "https://secure.sandbox.ob.business.hangseng.com/open-banking/v1.1/oauth2/token",
    "jwks_uri": "https://sandbox.ob.business.hangseng.com/jwks/public.jwks",
    "scopes_supported": ["openid", "accounts"],
    "claims_supported": ["openbanking_intent_id"],
    "response_types_supported": ["code id_token", "code"],
    "grant_types_supported": ["authorization_code", "client_credentials", "refresh_token"],
    "subject_types_supported": ["pairwise"],
    "id_token_signing_alg_values_supported": ["PS256"],
    "request_object_signing_alg_values_supported": ["PS256"],
    "token_endpoint_auth_methods_supported": ["private_key_jwt"],
    "claims_parameter_supported": true,
    "request_parameter_supported": true,
    "request_uri_parameter_supported": false,
    "token_endpoint_auth_signing_alg_values_supported": ["PS256"],
    "tls_client_certificate_bound_access_tokens": true
};

// const readCertKeyFile = (path) => {
//     var s = fs.readFileSync(path, 'utf8');
//     s = s.replaceAll(/[\r\n]/ig, '');
//     var segs = s.split('-----').filter(item => item !== '');
//     // console.log('sgs: ', segs);
//     segs[1] = '\n' + segs[1] + '\n';
//     const result = '-----' + segs[0] + '-----' + segs[1] + '-----' + segs[2] + '-----'; 
//     console.log('readCertKeyFile: ', result);
//     return result;
// };

const API_PROJECT_FOLDER = 'apiProjects';
const API_DOC_FOLDER =  process.env.API_DOC_FOLDER;

// TestProject2
const CLIENT_ID = process.env.CLIENT_ID; // 'LS5eHQFuGmgPadAGDj0b7DGbw77Fqgy7';
const KID = process.env.KID; //  '9cafba5a-4204-43e9-8eea-5aa4424f1291';
const CALLBACK_URL = process.env.CALLBACK_URL;  //  'https://test.wowstk.com/callback';

console.log('')
const API_ENDPOINT = '/open-banking/v1.0/aisp';
const API_ENDPOINT_ACCOUNT_CONSENTS = '/open-banking/v1.0/aisp/account-consents';
const API_ENDPOINT_ACCOUNTS = '/open-banking/v1.0/aisp/accounts';
// var TRANSPORT_CERT = '-----BEGIN CERTIFICATE-----\n' +
// 'MIIDRTCCAi0CCQCCAzEfSK2D8jANBgkqhkiG9w0BAQsFADBUMQswCQYDVQQGEwJHQjEaMBgGA1UECgwRSFNCQyBIb2xkaW5ncyBwbGMxEjAQBgNVBAsMCUhTQkMgUFNEMjEVMBMGA1UEAwwMd3d3LmhzYmMuY29tMB4XDTIyMTAxMDEwMjIxN1oXDTI0MTAwOTEwMjIxN1owdTEaMBgGA1UECgwRRW5hYmxlIEJhbmtpbmcgT3kxDjAMBgNVBAcMBUVzcG9vMQswCQYDVQQGEwJGSTEeMBwGA1UEYQwVUFNERkktRklORlNBLTI5ODg0OTk3MRowGAYDVQQDDBFlbmFibGViYW5raW5nLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAO3EoqoLXCbF7dplvaGiaEY4/qsunY/eO3Z72qW4hRbk+fvDEv9nc+prVUVOKoIVACXFXbTRQ96x5TANwXuVO2DlE0yyW4TBl+cd+4pZdx5/McjSso2aL5uygy1lTGbySaQVI6FcL9WLzk5zHIDnEBY9yjxLzrInbyIMYoTm1Z3aRFZSB86AG6TCQP82E8VLbcPmJcIFIUE+MEybn9BUfyeNDAOdahgop/E2y64xtoRNC920GrFaRL7vVdTBmL6pDIaZ2kCgxYWrcHw6cBAUDg/dWth87eBC793lY/Wxp9MjQfg1Btp6tzQLA+YHgjcpIwPPCwLRQtbK6sg9KFXJlzUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAaPFuqOmXetMnUA9IU5As1uC+nnpVQuguFBNfT+p2pBMQWk5pLow0LAFkcR1MroG98R5VnjWOT9dK5hggTD9/+jptx3t9WBwzP/xV9KgCE63Fl8bZf1PCV+rM3TLZB/nOdrEnzPTDTxMuKoKj2HGsaiA2gWkaYZANl5dIrMSpv81/tQSH1rQ2CpyqBfnIGBOeAXod0Y61qge3XSCy/W8Zsd5r2DkPulMJTrabeK1RjmqnHWcys1P9BQnCXHESClBbIqA0QsxcZoTkRUvoF5SfgfPe6nYnliZcK68vxarWn3mdGOuXGudtvIZ55ONOTMdhDl8DH/c/xvSsdV8Oaez0zg==' +
// '\n-----END CERTIFICATE-----';
// var PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n' +
// 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtxKKqC1wmxe3aZb2homhGOP6rLp2P3jt2e9qluIUW5Pn7wxL/Z3Pqa1VFTiqCFQAlxV200UPeseUwDcF7lTtg5RNMsluEwZfnHfuKWXcefzHI0rKNmi+bsoMtZUxm8kmkFSOhXC/Vi85OcxyA5xAWPco8S86yJ28iDGKE5tWd2kRWUgfOgBukwkD/NhPFS23D5iXCBSFBPjBMm5/QVH8njQwDnWoYKKfxNsuuMbaETQvdtBqxWkS+71XUwZi+qQyGmdpAoMWFq3B8OnAQFA4P3VrYfO3gQu/d5WP1safTI0H4NQbaerc0CwPmB4I3KSMDzwsC0ULWyurIPShVyZc1AgMBAAECggEBAKsAhvTBIs+H/p7aGV5MTa5jg1VeO1ejPyThwsj5Qk7K87dL/zfNEaMA+tzTcOMJc4e2wMQw1R0u2GSNICBfncr8Nbstc4CxMyy3dZd07KT0WbvTPTN2NtNFue5GMoK/spLd2ThN8uEkoYXuaAuVIw679d0TsF6U2eqk+Z4X3n6dfzKJdCkFaX9qL9DBcHdFGS1WJSV0huc44klUCq6eW2zBLj5efNbvPl6VzCHa/8K0qkMeE41nQpmA+S/wxnn3Gk7MB/4u0a9uqgp4U40k3Pngf2YGQBEmZMT70rbHYgvDd6h//0vxgb4a6tfMJIIGBX9IGq2ZS+85gdH4lS/ZSQECgYEA98OT3jkYcrMdVDlQnOvfNvwfJ7UXBXZZS5hwlq1xJ3JZgbP779tPtlXvA9UaCTgVV1gWORXTBr7lDAGIgtGO73M3wK4ffPuVlPR7YAm/0sCrhqz3gckIL+sMGnewtdq12tx5vgzLoiCy3wP7Cb1hwH2DMyq7HIjWTFwSTCkEalUCgYEA9av+tFnx8xDuLQgFdX+c2r/qm77nzmiORDT/UEAdIbQcnVsQrsXIEScSJdrxoI60ns8GT6Yi/aVLw8DavcWTOwkSnRXO61593shrqLlMvF1MFnY/SuBDEi6nwUsGVuZgU8iqsr9GkxLRvwqzxoMV056QyeBXnw/NcUTzedrPGWECgYBOG/1hAJUBjBBB/jO41O+xEPjtdrzEPxRVrcBI8HMM4ZLwPgK+EmDl9d99UNB9eY3Y1G9lHclChioFh/I2c8RhHuzDtOE+cL4ukIjYtRohYhZxRdRduTf4i1xsd7FhE4tjbUCANt53xWE+x61725WWrrsPBXipvUX6Gsi18/RtZQKBgBqOGN4NyuVnMxeTAmQNAztx+z4SiKP7EUW2JNLb20pFWcJ4kXkSz+lqu79zxyJ/ym5QGnKJlsasE2B5fCt/K8b52BU6wj8W26w1Jc37GZxSyWK0LWs+ioFwoZl3Lpw+ErN7wVfI7SwAoMNxuLUAfl99iFEJ+u6qmp5fwaGuUSyBAoGAMr0IxSz5YVRPShjkCzoy4jjJqvQoEeZieEHnV/LhEVwm549NkcbHIXA9vUfGKen5sfsHmUkTtdBCp4vk55c1g5Qc3EsGCNf4GHCGussQfwz7ynUnwVqPtw1PUG6XTbXPLePFWo2hPasxYl+yeOlFWejTvxMZKGF0YNumWjy8KiM=' +
// '\n-----END PRIVATE KEY-----';

// const TRANSPORT_CERT_FILE = './' + API_PROJECT_FOLDER + '/' + API_DOC_FOLDER + '/Transport.crt';
// const PRIVATE_KEY_FILE = './' + API_PROJECT_FOLDER + '/' + API_DOC_FOLDER + '/private.key';

// var transportCertStr = fs.readFileSync(TRANSPORT_CERT_FILE, 'utf8');
// var privateKeyStr = fs.readFileSync(PRIVATE_KEY_FILE, 'utf8');

// // const transportCert = readCertKeyFile(TRANSPORT_CERT_FILE);
// // const privateKey = readCertKeyFile(PRIVATE_KEY_FILE);

// var TRANSPORT_CERT = readCertKeyFile(TRANSPORT_CERT_FILE); // const transportCert = TRANSPORT_CERT;
// var PRIVATE_KEY = readCertKeyFile(PRIVATE_KEY_FILE); 
//const privateKey = PRIVATE_KEY;

const TRANSPORT_CERT = '-----BEGIN CERTIFICATE-----\nMIIDRTCCAi0CCQCCAzEfSK2D8jANBgkqhkiG9w0BAQsFADBUMQswCQYDVQQGEwJHQjEaMBgGA1UECgwRSFNCQyBIb2xkaW5ncyBwbGMxEjAQBgNVBAsMCUhTQkMgUFNEMjEVMBMGA1UEAwwMd3d3LmhzYmMuY29tMB4XDTIyMTAxMDEwMjIxN1oXDTI0MTAwOTEwMjIxN1owdTEaMBgGA1UECgwRRW5hYmxlIEJhbmtpbmcgT3kxDjAMBgNVBAcMBUVzcG9vMQswCQYDVQQGEwJGSTEeMBwGA1UEYQwVUFNERkktRklORlNBLTI5ODg0OTk3MRowGAYDVQQDDBFlbmFibGViYW5raW5nLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAO3EoqoLXCbF7dplvaGiaEY4/qsunY/eO3Z72qW4hRbk+fvDEv9nc+prVUVOKoIVACXFXbTRQ96x5TANwXuVO2DlE0yyW4TBl+cd+4pZdx5/McjSso2aL5uygy1lTGbySaQVI6FcL9WLzk5zHIDnEBY9yjxLzrInbyIMYoTm1Z3aRFZSB86AG6TCQP82E8VLbcPmJcIFIUE+MEybn9BUfyeNDAOdahgop/E2y64xtoRNC920GrFaRL7vVdTBmL6pDIaZ2kCgxYWrcHw6cBAUDg/dWth87eBC793lY/Wxp9MjQfg1Btp6tzQLA+YHgjcpIwPPCwLRQtbK6sg9KFXJlzUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAaPFuqOmXetMnUA9IU5As1uC+nnpVQuguFBNfT+p2pBMQWk5pLow0LAFkcR1MroG98R5VnjWOT9dK5hggTD9/+jptx3t9WBwzP/xV9KgCE63Fl8bZf1PCV+rM3TLZB/nOdrEnzPTDTxMuKoKj2HGsaiA2gWkaYZANl5dIrMSpv81/tQSH1rQ2CpyqBfnIGBOeAXod0Y61qge3XSCy/W8Zsd5r2DkPulMJTrabeK1RjmqnHWcys1P9BQnCXHESClBbIqA0QsxcZoTkRUvoF5SfgfPe6nYnliZcK68vxarWn3mdGOuXGudtvIZ55ONOTMdhDl8DH/c/xvSsdV8Oaez0zg==\n-----END CERTIFICATE-----';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtxKKqC1wmxe3aZb2homhGOP6rLp2P3jt2e9qluIUW5Pn7wxL/Z3Pqa1VFTiqCFQAlxV200UPeseUwDcF7lTtg5RNMsluEwZfnHfuKWXcefzHI0rKNmi+bsoMtZUxm8kmkFSOhXC/Vi85OcxyA5xAWPco8S86yJ28iDGKE5tWd2kRWUgfOgBukwkD/NhPFS23D5iXCBSFBPjBMm5/QVH8njQwDnWoYKKfxNsuuMbaETQvdtBqxWkS+71XUwZi+qQyGmdpAoMWFq3B8OnAQFA4P3VrYfO3gQu/d5WP1safTI0H4NQbaerc0CwPmB4I3KSMDzwsC0ULWyurIPShVyZc1AgMBAAECggEBAKsAhvTBIs+H/p7aGV5MTa5jg1VeO1ejPyThwsj5Qk7K87dL/zfNEaMA+tzTcOMJc4e2wMQw1R0u2GSNICBfncr8Nbstc4CxMyy3dZd07KT0WbvTPTN2NtNFue5GMoK/spLd2ThN8uEkoYXuaAuVIw679d0TsF6U2eqk+Z4X3n6dfzKJdCkFaX9qL9DBcHdFGS1WJSV0huc44klUCq6eW2zBLj5efNbvPl6VzCHa/8K0qkMeE41nQpmA+S/wxnn3Gk7MB/4u0a9uqgp4U40k3Pngf2YGQBEmZMT70rbHYgvDd6h//0vxgb4a6tfMJIIGBX9IGq2ZS+85gdH4lS/ZSQECgYEA98OT3jkYcrMdVDlQnOvfNvwfJ7UXBXZZS5hwlq1xJ3JZgbP779tPtlXvA9UaCTgVV1gWORXTBr7lDAGIgtGO73M3wK4ffPuVlPR7YAm/0sCrhqz3gckIL+sMGnewtdq12tx5vgzLoiCy3wP7Cb1hwH2DMyq7HIjWTFwSTCkEalUCgYEA9av+tFnx8xDuLQgFdX+c2r/qm77nzmiORDT/UEAdIbQcnVsQrsXIEScSJdrxoI60ns8GT6Yi/aVLw8DavcWTOwkSnRXO61593shrqLlMvF1MFnY/SuBDEi6nwUsGVuZgU8iqsr9GkxLRvwqzxoMV056QyeBXnw/NcUTzedrPGWECgYBOG/1hAJUBjBBB/jO41O+xEPjtdrzEPxRVrcBI8HMM4ZLwPgK+EmDl9d99UNB9eY3Y1G9lHclChioFh/I2c8RhHuzDtOE+cL4ukIjYtRohYhZxRdRduTf4i1xsd7FhE4tjbUCANt53xWE+x61725WWrrsPBXipvUX6Gsi18/RtZQKBgBqOGN4NyuVnMxeTAmQNAztx+z4SiKP7EUW2JNLb20pFWcJ4kXkSz+lqu79zxyJ/ym5QGnKJlsasE2B5fCt/K8b52BU6wj8W26w1Jc37GZxSyWK0LWs+ioFwoZl3Lpw+ErN7wVfI7SwAoMNxuLUAfl99iFEJ+u6qmp5fwaGuUSyBAoGAMr0IxSz5YVRPShjkCzoy4jjJqvQoEeZieEHnV/LhEVwm549NkcbHIXA9vUfGKen5sfsHmUkTtdBCp4vk55c1g5Qc3EsGCNf4GHCGussQfwz7ynUnwVqPtw1PUG6XTbXPLePFWo2hPasxYl+yeOlFWejTvxMZKGF0YNumWjy8KiM=\n-----END PRIVATE KEY-----'

const transportCert = TRANSPORT_CERT;
const privateKey = PRIVATE_KEY;

// transportCertStr = transportCertStr.replaceAll(/[\r\n]/ig, '');
// privateKeyStr = privateKeyStr.replaceAll(/[\r\n]/ig, '');

let config = {
    api_server: wKConfig.issuer,
    token_endpoint: wKConfig.token_endpoint,
    authorize_endpoint: wKConfig.authorization_endpoint,
    api_endpoint: API_ENDPOINT,
    account_consents_path: API_ENDPOINT_ACCOUNT_CONSENTS,
    accounts_path: API_ENDPOINT_ACCOUNTS,

    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',

    scope: 'accounts',
    clientId: CLIENT_ID,
    kid: KID,
    PKCS8PEM: privateKey,
    authorize_callbackURL: CALLBACK_URL,
    accounts_consent: {
        "data": {
            "permissions": [
                "ReadAccountAvailability",
                "ReadAccountStatus",
                "ReadAccountBalance",
                "ReadAccountTransaction"
            ],
            "expirationDate": "2023-06-20T15:37:31.699Z",
            "transactionFromDate": "2022-06-20T15:37:31.699Z",
            "transactionToDate": "2022-06-20T15:37:31.699Z",
            "balanceFromDate": "2022-06-20T15:37:31.699Z",
            "balanceToDate": "2022-06-20T15:37:31.699Z"
        }
    },
    fapi: 'dummy-fapi'
};

const createApiConfig = (project) => {
    var result = JSON.parse(JSON.stringify(config));
    // console.log('createApiConfig: (before transform) result: ', result);
    result.clientId = project.clientId;
    result.kid = project.kid;
    result.transportCert = project.transportCert;
    result.privateKey = project.privateKey;
    result.authorize_callbackURL = project.callbackUrl;
    result.PKCS8PEM = project.privateKey;

    // result.transportCert = project.transportCert;
    // result.privateKey = project.privateKey;
    return result;
};

export {
    // transportCertStr,
    // privateKeyStr,
    TRANSPORT_CERT,
    PRIVATE_KEY,
    transportCert,
    privateKey,
    wKConfig,
    config,
    createApiConfig
};
