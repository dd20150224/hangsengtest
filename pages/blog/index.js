import { useEffect } from 'react';
import io from 'socket.io-client';

import { StylesProvider } from '@chakra-ui/react';
import styles from './blog.module.css';
import Link from 'next/link';
// import ClientPromise from '../../lib/mongodb';
import UserService from '../../services/UserService';

import {
    Text
} from '@chakra-ui/react';

let socket;

function Blog({users}) {
    // useEffect( () => {
    //     socketInitializer()
    // }, []);
    
    // const socketInitializer = async () => {
    //     await fetch('/api/socket');
    //     socket = io();
    //     socket.on('connect', () => {
    //         console.log('connected');            
    //     });
    // };

    return (
        <div className={styles.container}>
            <Text fontSize="5xl">BLOG</Text>
            <div>users count: {users ? users.length : 0}</div>
        </div>
    );
}

export default Blog


export async function getServerSideProps() {
    try {
        const users = await UserService.getAll();
        // console.log('getServerSideProps: users: ', users);
        return {
            props: {
                users: JSON.parse(JSON.stringify(users))
            }
        };
        // const client = await ClientPromise;
        // const db = client.db(process.env.DB_NAME);
        // const users = await db.collection('users')
    } catch (err) {
        console.error(err);
        return {
            props: {
                users: []
            }
        }
    }
    // const userCollection = await getDb().collection('users');
    // const userCursor = userCollection.find({});
    // const users = userCursor.toArray();
    // return {
    //     props: {
    //         users
    //     }
    // };
}
// export async function getServerSideProps(context) {
//     const session = await getSession(context);
//     return {
//         props: {
//             data: session ? 'List of 100 personized blogs' 
//                 : 'List of free blogs',
//         },
//     }
// }