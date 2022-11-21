import { 
    MdRemoveFromQueue,
    MdSync,
    MdOutlinePowerSettingsNew
} from 'react-icons/md';

import {
    Flex,
    Text,
    Button,
    HStack,
    Icon
} from '@chakra-ui/react';

import UserBoardButton from './UserBoardButton';

export default function UserBoardToolbar(props) {
    const user = props.user;
    return (    
        <Flex grow={0} w="full" alignItems="center" 
            direction="row" pt={2} m={0} 
            justifyContent="space-between">
            <Text fontSize="3xl" p={0}>{user.name}</Text>
            <HStack>
                {user.bankAccounts ? (
                <UserBoardButton icon={MdRemoveFromQueue} label="Clear" onClick={()=>props.onCommand('clear')} colorScheme="orange"/>
                ):null}

                <Button minWidth="120px" onClick={()=>props.onCommand('sync')} variant="filled" bg="teal" color="white">
                    <Icon mr={2} as={user.bankAccounts ? MdSync : MdOutlinePowerSettingsNew}
                        w={5} h={5}></Icon>
                    <Text fontSize="sm">
                        { user.bankAccounts ? 'Update' : 'Connect' }
                    </Text>
                </Button>
            </HStack>
        </Flex>
    )
}