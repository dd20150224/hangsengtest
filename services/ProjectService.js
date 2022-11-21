import { findAll, findOne } from '../helpers/dbHelper';

const ProjectService = {
    get: async (id) => {
        console.log('ProjectService.get   id = ' + id);
        const row = await findOne('projects', {_id: id});
        console.log('ProjectService row: ', row);
        return row;
    },
    getByName: async (name) => {
        return await findOne('projects', {name});
    },
    getAll: async () => {
        return await findAll('projects');
    }
}

export default ProjectService;
