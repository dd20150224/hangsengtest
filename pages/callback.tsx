import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { Center, Spinner } from '@chakra-ui/react';

import BankApiService from 'services/BankApiService';
import BankQueryService from 'services/BankQueryService';
import UserService from 'services/UserService';
import ProjectService from 'services/ProjectService';

import { createApiConfig } from 'helpers/apiConfigHelper';

// import clientPromise from "../../lib/mongodb";

export default function Callback({projectId, userId}) {
    const router = useRouter();
    console.log('Callback starts');

    if (process.browser) {
        const url = 'https://yoovplus.i234.me/dashboard/show/'
            + userId + '/' 
            + projectId;

        // console.log('callback: url = ' + url);
        // return {
        //     props: {
        //         url
        //     }
        // };

        console.log('process.browser => url = ' + url);

        console.log('process.browser => push url = ' + url);
        router.push(url); // 'https://www.google.com');
    }

    return (
        <Center h="50%" w="full">
            <Spinner size="xl" />
        </Center>
    );
};

const propsWithErrorUrl = () => {
    return {
        props: {
            url: '' // 'dashboard/error/internal-error'
        }
    }
};

export async function getServerSideProps(context) {
    console.log('callback: getServerSideProps: context.req.params: ', context.query);
    const { state, id_token, code, scope } = context.query;

    console.log('callback: getServerSideProps: state = ' + state);
    console.log('callback: getServerSideProps: id_token = ' + id_token);
    console.log('callback: getServerSideProps: code = ' + code);
    console.log('callback: getServerSideProps: scope = ' + scope);

    const queryId = new ObjectId(state);
    console.log('callback: queryId = ' + queryId);
    const queryItem = await BankQueryService.getQuery(queryId);
    console.log('queryItem: ', queryItem);
    // if (!queryItem) return propsWithErrorUrl();

    const userId = new ObjectId(queryItem.userId);
    const projectId = new ObjectId(queryItem.projectId);

    if (queryItem.handled) {
        return {
            props: {
                userId: userId.toString(),
                projectId: projectId.toString()
            }
        }
    }

    const project = await ProjectService.get(projectId);
    const apiConfig = createApiConfig(project);
    apiConfig.clientAssertion = queryItem.clientAssertion;

    console.log('callback: queryItem.clientAssertion = ' + queryItem.clientAssertion);

    let user = await UserService.get(userId);
    let userBankApiInfo = user.bankApiInfo;
    console.log('');

    // 4. get access token
    console.log('4. getAccessToken');
    let tokenInfo = await BankApiService.getTokenInfo({code, apiConfig});
    console.log('access_token = ' + tokenInfo.access_token);

    // await UserService.updateBankApiInfo(
    //     userId,
    //     {
    //         tokenInfo,
    //         TokenInfo(userId, tokenInfo);
    // userBankApiInfo = await UserService.getBankApiInfo(userId);

    let updateUser = await UserService.updateBankApiInfo(
        userId,
        {
            tokenInfo,
            clientAssertion: queryItem.clientAssertion
        }
    );
    // userBankApiInfo = await UserService.getBankApiInfo(userId);

    // checking
    userBankApiInfo = await UserService.getBankApiInfo(userId);
    console.log('4.1. get access token after update tokenInfo: userbankApiInfo: ', userBankApiInfo);
    

    // console.log('4.2. get access token after update tokenInfo: userbankApiInfo: ', userBankApiInfo);
    console.log('');
    
    // 5. Refresh token
    console.log('5. Refresh token');
    tokenInfo = await BankApiService.refreshAccessToken(userBankApiInfo, apiConfig);
    // console.log('5. Refresh token : tokenInfo: ', tokenInfo);
    await UserService.updateTokenInfo(userId, tokenInfo);
    userBankApiInfo = await UserService.getBankApiInfo(userId);
    // console.log('5. Refresh token after update tokenInfo: userbankApiInfo: ', userBankApiInfo);

    //  UserService.refreshToken(userId, apiConfig);
    console.log('new access token = ' + tokenInfo.access_token);
    console.log('');

    // 6. Get user bank accounts
    console.log('6. Get user bank accounts');
    // console.log('6. Get user bank accounts: userBankApiInfo: ', userBankApiInfo);
    const accounts = await BankApiService.getCustomerAccounts(userBankApiInfo, apiConfig);

    // const accountsResult = await UserService.getCustomerAccounts(userId, apiConfig);
    console.log('user accounts: ' + accounts.map(a => a.accountId).join(', '));
    user = await UserService.updateBankAccounts(userId, accounts);
    console.log('');

    // 7. Refresh token
    console.log('7. Refresh token');

    tokenInfo = await BankApiService.refreshAccessToken(userBankApiInfo, apiConfig);
    console.log('7. Refresh token : tokenInfo: ', tokenInfo);
    await UserService.updateTokenInfo(userId, tokenInfo);
    userBankApiInfo = await UserService.getBankApiInfo(userId);
    console.log('7. Refresh token after update tokenInfo: userbankApiInfo: ', userBankApiInfo);

    console.log('');

    // tokenInfo = await UserService.refreshAccessToken(userBankApiInfo, apiConfig);
    // await UserService.updateTokenInfo(userId, tokenInfo);
    // console.log('new access token = ' + tokenInfo.access_token);

    // 8. Get account transaction
    // console.log('8. Get account transactions');
    // const account = user.bankAccounts[0];
    // const transactionResult = await BankApiService.getTransactions(userId, account.accountId, apiConfig);
    // await UserService.updateAccountTransactions(userId, account.accountId, transactionResult);
    // console.log('transactions: ', transactionResult);
    // console.log('');
    
    // clear query
    await BankQueryService.updateQuery(queryId, {handled: true});

    return {
        props: {
            userId: userId.toString(),
            projectId: projectId.toString()
        }
    }
    // await BankQueryService.removeQuery(queryId);

    // const url = 'https://yoovplus.i234.me/dashboard/show/' + userId.toString() + '/' + projectId.toString();
    // console.log('callback: url = ' + url);
    // return {
    //     props: {
    //         url
    //     }
    // };
}



// grant_type=authorization_code
// &
// code=QW0GLOZMYIG4iO2q1kpGR4jZFVZOGHF7AJaGmbwFsDGcXo0qotCljFNCgASVgVUeR5AxpmK1CAMTR7nn8UzjVTejJLorRLYxmgumrARd6h7qCdtruCZ6CjXgANNdGbAvwFxh1D2IKFmjbR1pAxarGlw7lYtaAnA0GBSIApb4XNLOOaqYPxHmqZRXo5GLtFzgN1TGAuYgM0P9nam0tIZAO41CGh6GFKnxPmIGh1SwDsNq3tAF8Cp3m7L1zYhWtHyN4XZdficJH0VUi83EObUTeTMbD79qZpPYPH6W4HQmFpFmwcY4zM73xa245oBWwUQ4GxQWqMPS7cZ6FfYsEUuTlLSVLL7nY0hR8bY5r0tuz95OFGUN2B0Qpu0iSyUZMwG0dKXorXYyNpbDCfkuEcAUXggJJGB3f9qovDGcojkEUIebTPrAFu1GbwjNKk8Ez7wOPGJ4hJFnTVy031I6EuyLG44oAOLDA7pKLO3E0UQFPnNGF1n0vmSuJREeXrPmmF78
// &
// client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer
// &
// client_assertion=eyJhbGciOiJQUzI1NiIsImtpZCI6IjkyOTgzM2M3LWY3MWMtNDAxNC05OWYxLWM0ZGY2MTBkMTM5OSJ9.eyJpc3MiOiJaOUx4cEpyb1F4R2pBb0o4OXdJVDdMWER6TGtLazFwaCIsImF1ZCI6Imh0dHBzOi8vc2VjdXJlLnNhbmRib3gub2IuYnVzaW5lc3MuaGFuZ3NlbmcuY29tL29wZW4tYmFua2luZy92MS4xL29hdXRoMi90b2tlbiIsInN1YiI6Ilo5THhwSnJvUXhHakFvSjg5d0lUN0xYRHpMa0trMXBoIiwiZXhwIjoxNjY2MTQ5MTk1fQ.Bwk01-HkL9ulmopaUvPZOZdpLbK3JrLKYjTC11qsDzfzluXdNquGm83M4lN1YhWiqW1ZmDULpIg1VETePidzbbKMNhbh1zrh3u1wRc8kRJsR8d-oj-DC5zQiYS9DiZFDFxCmzwdQu9Ii5SLejZGrtEnNc713Dxf02r0ZQb9hpsDwtuxFb0ffNspc0K0nkhVZ1jlC9chz6HDns2CEuxrxux_Ry_ASC4xfei-McT7g3SZOAXGVQZ3okJ1Nkkl8wyvjuhsCmmo9WkEBVyxuNRIJTl1AkuT-ACoCJsa29XQeicAhagAWvbyuZITFhmLtKYEcp3Ob0brprtIffcer91Lmow
// &
// redirect_uri=https%3A%2F%2Fyoovplus.i234.me%2Fcallback',