import { ObjectId } from 'mongodb';
import UserService from 'services/UserService';

export default async (req, res) => {
    try {
        const userId = new ObjectId(req.query.id);
        await UserService.clearBankAccounts(userId);
        const result = await UserService.get(userId);
        console.log('clear: result: ', result);
        return res.json(result);
    } catch (e) {
        console.error(e);
    }
 };
 