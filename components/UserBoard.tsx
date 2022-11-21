import { MdSync, MdOutlinePowerSettingsNew, MdRemoveFromQueue } from 'react-icons/md';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import {
    Flex,
    Divider,
    Text,
    Button,
    Icon,
    IconButton,
    Switch,
    Box,
    HStack,
    VStack,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import UserBankAccounts from './UserBankAccounts';
import UserBoardToolbar from './UserBoardToolbar';
import { SpinnerContext } from '../pages/dashboard/[...slug]';

export default function UserBoard(props) {
    const user = props.user;
    const project = props.project;

    const [auto, setAuto] = useState(false);
    const [balance, setBalance] = useState<any>({});
    const [balanceAccounts, setBalanceAccounts] = useState([]);

    const [allTransactions, setAllTransactions] = useState<any>({});
    const [transactions, setTransactions] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [loadingBalance, setLoadingBalance] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const {showSpinner, setShowSpinner} = useContext(SpinnerContext);

    useEffect(() => {
        console.log('useEffect([user] user.name = ' + user.name);
        var index = 0;
        if (selectedAccount) {
            if (user.bankAccounts) {
                index = user.bankAccounts.findIndex(account => account.accountId === selectedAccount.accountId);
                console.log('useEffect([user] index = ' + index);
                if (index === -1) {
                    index = 0;
                }
            }
        }
        if (user.bankAccounts && user.bankAccounts.length > 0) {
            setSelectedAccount(user.bankAccounts[index]);
        } else {
            setSelectedAccount(null);
        }
    }, [user]);

    useEffect(() => {
        setSelectedTab(0);
    }, [user]);

    useEffect(() => {
        var accounts = [];
        console.log('balance: ', balance);
        
        if (selectedAccount) {
            const accountBalance = balance[selectedAccount.accountId];
            if (accountBalance) {
                accounts = accountBalance.account;
            }
        }
        setBalanceAccounts(accounts);
        // if (selected)
        // if (balance && balance.account) {
        //     setBalanceAccounts(balance.account);
        // }
    }, [balance, selectedAccount]);

    useEffect(() => {
        var accountTransactions = [];
        if (selectedAccount && allTransactions[selectedAccount.accountId]) {
            accountTransactions = allTransactions[selectedAccount.accountId];
        }
        setTransactions(accountTransactions);

    }, [allTransactions, selectedAccount])

    useEffect(() => {
        const state: boolean = loadingBalance || loadingTransactions;
        setShowSpinner(state);
    }, [loadingBalance, loadingTransactions]);

    const getBalance = async (account) => {
        setLoadingBalance(true);
        const balanceResult:any = await axios.get(
            '/api/accounts/' + account.accountId + '/balances?' +
            'projectId=' + project._id + '&' +
            'userId=' + user._id);
        console.log('get balance from axios: balanceResult.data: ', balanceResult.data);
        console.log('get balance from axios: balanceResult:', balanceResult);
        setLoadingBalance(false);
        if (balanceResult.data && !Array.isArray(balanceResult.data)) {
            setBalance(prev => {
                prev = {...prev};
                prev[selectedAccount.accountId] = balanceResult.data;
                console.log('setBalance: prev: ', prev);
                return prev;
            });
        }
    };

    const getTransactions = async (account) => {
        setLoadingTransactions(true);
        const result:any = await axios.get(
            '/api/accounts/' + account.accountId + '/transactions?' +
            'projectId=' + project._id + '&' +
            'userId=' + user._id);
        console.log('result: ', result.data);
        var updatedTransactions = [];
        if (result && result.data && result.data.transaction) {
            updatedTransactions = result.data.transaction;
        }
        setLoadingTransactions(false);
        setAllTransactions(prev => {
            prev[selectedAccount.accountId] = updatedTransactions;
            return prev;
        });
    };

    useEffect(() => {
        const getData = async () => {
            console.log('selectedAccount: ', selectedAccount);
            if (selectedAccount && auto) {
                await getBalance(selectedAccount);
                await getTransactions(selectedAccount);
            }
        }
        getData();
    }, [selectedAccount])
    const loadEvents = async () => {
        setLoadingEvents(true);
        const res = await axios.get('/api/events?' +
            'projectId=' + project._id + '&' +
            'userId=' + user._id);
        
        setEvents(res.data);
    };

    const setTabIndex = (tabIndex: number) => {
        setSelectedTab(tabIndex);
        // loadEvents();
    };

    const onCommandHandler = (command) => {
        switch (command) {
            case 'sync':
                props.onCommand({
                    command: user.bankAccounts ? 'refresh' : 'connect',
                    user: user
                })
                break;
            case 'clear':
                props.onCommand({
                    command: 'clear',
                    user: user
                })        
                break;
        }
    }

    const selectAccount = (account) => {
        setSelectedAccount(account);
    };

    const balanceType = (type) => {
        switch (type) {
            case 'availableBalance':
                return 'Available Balance';
            case 'ledgerBalance':
                return 'Ledger Balance';
        }
        return '';
    };

    const formatAmount = (amountStr) => {
        const amount = parseFloat(amountStr);
        const formatter = new Intl.NumberFormat('zh-HK');
        return formatter.format(amount);
    };

    const refreshBalance = () => {
        if (selectedAccount) {
            getBalance(selectedAccount);
        }        
    };

    const refreshTransactions = () => {
        if (selectedAccount) {
            getTransactions(selectedAccount);
        }
    };

    const onToggle = (event) => {
        setAuto(event.target.checked);
    };

    return (
        <>
        <UserBoardToolbar
            user={user}
            onCommand={onCommandHandler}></UserBoardToolbar>

        <HStack w="full" justifyContent="space-between">
            <Tabs orientation="horizontal" bg="white"
                onChange={(index) => {setTabIndex(index)}}>
                <TabList>
                    <Tab _selected={{bg: 'gray.300', color: 'black'}}>Accounts</Tab>
                    {/* <Tab _selected={{bg: 'gray.300', color: 'black'}}>Events</Tab> */}
                </TabList>
            </Tabs>
            <HStack alignItems="center">
                <Text mr={1}>AUTO</Text>
                <Switch colorScheme='teal' size='lg' onChange={event=>onToggle(event)} />
            </HStack>
            
        </HStack>

        {selectedTab===0 ? 
            user.bankAccounts ? (
                <Flex grow="1" w="full" direction="row" p={0} m={0} bg="purple.100">
                    <UserBankAccounts
                        selectAccount={account=>selectAccount(account)}
                        selectedAccount={selectedAccount}
                        accounts={user.bankAccounts}></UserBankAccounts>
                    <Divider orientation="vertical" width="2"></Divider>
                    <Flex grow="1" direction="column" bg="gray.300" gap={1}>
                        <Flex bg="blue.500" direction="column" p={2}>
                            <HStack width="full" justifyContent="space-between">
                                <Text width="full" fontSize="2xl" color="white">BALANCE</Text>                                
                                <IconButton colorScheme="gray"
                                    py={0} minWidth={70} 
                                    size="lg"
                                    h={10}
                                    onClick={()=>refreshBalance()}
                                    aria-label='Refresh Balance' 
                                    icon={<MdSync />} />

                                {/* <Button variant="primary" onClick={()=>refreshBalance()}>
                                    <Icon size="xl" color="white" as={MdSync}></Icon>
                                </Button> */}
                            </HStack>
                            <Flex width="full" direction="column" gap={2}>
                                {balanceAccounts.map(account => (
                                    <Box key={account.accountId} width="full">
                                        {/* <Text color="gray.300" fontSize="xl">{account.accountId}</Text> */}
                                        <Flex width="full" direction="row" gap={2}>
                                            {account.balance.map((balance, index) => (
                                            <Box key={index} width={300} bg="blue.100" p={2}>
                                                <HStack justifyContent="center">
                                                    <Text color="blue.900" display="inline" fontWeight="bold" fontSize="lg">
                                                        {balanceType(balance.type)}
                                                    </Text>
                                                    <Box mx={1} color="white" px={1} display="inline" bg="blue.500">
                                                        {balance.creditDebitIndicator}
                                                    </Box>
                                                </HStack>
                                                <HStack justifyContent="center">
                                                    <Text color="blue.800" display="inline"
                                                        fontSize="3xl"
                                                        mr={2}
                                                        fontWeight="bold">
                                                        {balance.currency}
                                                    </Text>
                                                    <Text color="blue.500" display="inline"
                                                        fontSize="3xl"
                                                        fontWeight="bold">
                                                        {formatAmount(balance.amount)}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            ))}                                        
                                        </Flex>
                                    </Box>
                                ))}

                                {/* <Box width={480} bg="blue.100" p={2}>
                                    sldfkdsjfds
                                </Box>*/}
                            </Flex>
                            {/* Balance: {balance? JSON.stringify(balance) : '(unknown)'} */}
                        </Flex>
                        <Flex direction="column" bg="white" p={2}>
                            <HStack width="full" justifyContent="space-between">
                                <Text width="full" fontSize="2xl" color="black">TRANSACTIONS</Text>
                                <IconButton colorScheme="teal"
                                    py={0} minWidth={70} 
                                    size="lg"
                                    h={10}
                                    onClick={()=>refreshTransactions()}
                                    aria-label='Refresh Transactions' 
                                    icon={<MdSync />} />

                                {/* <Button variant="primary" onClick={()=>refreshBalance()}>
                                    <Icon size="xl" color="white" as={MdSync}></Icon>
                                </Button> */}
                            </HStack>
                            <VStack alignItems="center">
                                {transactions.length > 0 ? (
                                    <Text fontSize="2xl">{transactions.length} transactions</Text>
                                ):(
                                    <Text fontSize="2xl">No transactions!</Text>
                                )}
                            </VStack>
                        </Flex>
                        <Flex grow={1} direction="row" bg=""></Flex>
                    </Flex>
                </Flex>
            ):(
                <Box>
                    Not connected yet.
                </Box>
            )
        :(
            (events && events.length>0) ? (
                <Flex grow="1" w="full" direction="row" p={3} m={0} bg="purple.100">
                    <Text fontSize="3xl">Events: {events.length }</Text>
                </Flex>
            ):(
                <Box>
                    Not connected yet.
                </Box>
            )            
        )}
        </>
    );
}

function state(state: any) {
    throw new Error('Function not implemented.');
}
