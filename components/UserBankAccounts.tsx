import { useState, useEffect } from 'react';

import {
    Flex,
    VStack,
    HStack,
    Box,
    Tag,
    Text
} from '@chakra-ui/react';

export default function UserBankAccounts(props) {
    const accounts = props.accounts;
    const selectedAccount = props.selectedAccount;
    // const [ selectedAccount, setSelectedAccount ] = useState(props.selectedAccount);

    useEffect( () => {
        if (accounts.length > 0 && !selectedAccount) {
            const account = accounts[0];
            // setSelectedAccount(account);
            props.selectAccount(account);
        }
    }, []);

    const selectAccount = (account) => {
        // setSelectedAccount(account);
        props.selectAccount(account);
    }
    return (
        <VStack w="240px" bg="gray.400" p={2}>
            {accounts.map(account => (
                <Box w="full"
                    cursor="pointer"
                    bg={account===selectedAccount ? 'teal.500' : 'gray.200'}
                    color={account===selectedAccount ? 'white' : ''}
                    _hover={account===selectedAccount ? {bg: 'teal.600'}: {bg:'gray.300'}}
                    onClick={()=>selectAccount(account)}
                    p={1}
                    key={account.accountId}>
                    <HStack w="full" h="4" justifyContent="space-between">
                        <Text fontSize="xl">{account.accountNumber}</Text>
                        <Box bg="blue" color="white" px={1} py={0} lineHeight={1}>{account.currency}</Box>
                    </HStack>
                    
                    <HStack w="full" h="5">
                        <Text fontSize="xs" lineHeight={1}>{account.productName}</Text>
                    </HStack>

                    <HStack w="full" h="25">
                        <div>
                        <Tag colorScheme="blue" mr={1}>{account.accountType}</Tag>/ 
                        <Tag colorScheme="blue" ml={1}>{account.accountSubType}</Tag>
                        </div>
                    </HStack>

                    <HStack w="full" h="2" justifyContent="end">
                        <Text fontSize="xs" lineHeight={1}>#{account.accountId}</Text>
                    </HStack>
                </Box>
            ))}
        </VStack>
    )
}