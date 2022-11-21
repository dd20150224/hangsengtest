import { useRouter } from 'next/router';
import { ObjectId } from 'mongodb';
import { Center, Spinner } from '@chakra-ui/react';

// import BankQueryService from "services/BankQueryService";

// helpers
import { config } from 'helpers/apiConfigHelper';

// services
import UserService from 'services/UserService';
import ProjectService from 'services/ProjectService';
import BankApiService from 'services/BankApiService';
import BankQueryService from 'services/BankQueryService';
import { createApiConfig } from 'helpers/apiConfigHelper';

// const createApiConfig = (project) => {
//     var result = JSON.parse(JSON.stringify(config));
//     console.log('createApiConfig: (before transform) result: ', result);
//     result.clientId = project.clientId;
//     result.kid = project.kid;
//     result.transportCert = project.transportCert;
//     result.privateKey = project.privateKey;
//     result.authorize_callbackURL = project.callbackUrl;
//     result.PKCS8PEM = project.privateKey;
//     result.clientAssertion = BankApiService.getClientAssertion(result);

//     // result.transportCert = project.transportCert;
//     // result.privateKey = project.privateKey;
//     return result;
// }

const bankApiLogin = async (projectId, userId) => {
    await BankQueryService.removeQueryByUser(
        projectId,
        userId
    );

    console.log('bankApiLogin: userId (' + (typeof userId) + ')= ' + userId);
    console.log('bankApiLogin: projecttId (' + (typeof projectId) + ')= ' + projectId);

    const user = await UserService.get(userId);
    const project = await ProjectService.get(projectId);

    const apiConfig = createApiConfig(project);
    apiConfig.clientAssertion = BankApiService.getClientAssertion(apiConfig);


    const queryItem = await BankQueryService.addQuery({
        user,
        project,
        clientAssertion: apiConfig.clientAssertion
    });

    console.log('queryItem: ', queryItem);
    const apiRes = await BankApiService.process({
        state: queryItem._id.toString(),
        apiConfig
    });

    const url = apiRes && apiRes.url 
        ? apiRes.url 
        : '';

    return url;
};


function Login({url}) {
    const router = useRouter();
    console.log('Login: props.url = ' + url);

    if (process.browser) {
       router.push(url);
    }

    return (
        <Center h="100vh" w="full">
            <Spinner size="xl" />
        </Center>
    );
}

export async function getServerSideProps(context) {
    const userId = new ObjectId( context.params.userId );
    const projectId = new ObjectId( context.params.projectId );

    console.log('getServerSideProps: userId = ' + userId);
    console.log('getServerSideProps: projectId = ' + projectId);

    const url = await bankApiLogin(projectId, userId);

    console.log('getServerSideProps url = ' + url);

    return {
        props: {
            url
        }
    };
}

export default Login

