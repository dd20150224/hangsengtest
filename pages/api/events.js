import { ObjectId } from 'mongodb';

import ProjectService from 'services/ProjectService';
import UserService from 'services/UserService';
import BankApiService from 'services/BankApiService';

import { createApiConfig } from 'helpers/apiConfigHelper';

export default async (req, res) => {
    console.log('events: req.query: ', req.query);

    const projectId = new ObjectId(req.query.projectId);
    const userId = new ObjectId(req.query.userId);

    const project = await ProjectService.get(projectId);
    const apiConfig = createApiConfig(project);
    
    const bankApiInfo = await UserService.getBankApiInfo(userId);

    try {
        const eventResult = await BankApiService.getEvents(bankApiInfo, apiConfig);
        return res.json(eventResult.data);
    } catch(err) {
        console.log('xxx err: ', err);
        // console.error('err.status = ' + err.status);
        // console.error('err.statusText = ' + err.statusText);
        return res.json([]);
    }



    // const events = await EventService.getAll();
    // return res.json([
    //     {id: 1, name: 'event 1'},
    //     {id: 2, name: 'event 2'},
    //     {id: 3, name: 'event 3'},
    //     {id: 4, name: 'event 4'},
    //     {id: 5, name: 'event 5'},
    //     {id: 6, name: 'event 6'},
    // ]);
}