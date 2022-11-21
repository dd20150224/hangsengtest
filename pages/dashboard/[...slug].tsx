import { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

// services
import UserService from 'services/UserService';
import ProjectService from 'services/ProjectService';

import {
  Spinner,
  Center,
  Divider,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  HStack,
  VStack,
  Text,
  Box,
  Flex,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab
} from '@chakra-ui/react';
import CompanyLogo from '@/components/CompanyLogo';

import UserRow from 'components/UserRow';
import ProjectRow from 'components/ProjectRow';
import UserBoard from 'components/UserBoard';
import { getCustomerAccounts } from 'helpers/bankApiHelper';

let socket;

export const SpinnerContext = createContext({
  showSpinner: false,
  setShowSpinner: (state:boolean) => {}
});

export default function Dashboard(props) {
  const projects = props.projects;
  const selectedProjectId = props.selectedProjectId;
  const command = props.command;
  const error = props.error;

  // console.log('Dashboard starts selecteduserId = ' + selectedUserId);
  console.log('Dashboard starts command = ' + command);
  console.log('Dashboard starts error = ' + error);
  const [selectedUserId, setSelectedUserId] = useState(props.selectedUserId);
  const [users, setUsers] = useState(props.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [displayMode, setDisplayMode] = useState('user');
  const [showSpinner, setShowSpinner] = useState(false);

  const router = useRouter();

  const value = useMemo(
    () => ({showSpinner, setShowSpinner}),
    [showSpinner]
  );

  useEffect(() => {
    console.log('userEffect([users]) => setSelectedUser selectedUserId = ' + selectedUserId);    
    const user = selectedUserId
      ? users.find(u => u._id.toString() === selectedUserId)
      : users[0];

    setSelectedUser(user);
  }, [users, selectedUserId]);

  useEffect(()=>{
    let project = projects.find(p => p._id.toString() === selectedProjectId);
    if (!project) {
      if (projects.length > 0) {
        project = projects[0];
      }
    }
    setSelectedProject(project);
  }, []);
  // useEffect( () => {
  //   socketInitializer()
  // }, []);

  // const socketInitializer = async () => {
  //     await fetch('/api/socket');
  //     socket = io();
  //     socket.on('connect', () => {
  //         console.log('connected');            
  //     });
  // };

  const selectUser = (user) => {
    setSelectedUser(user);
    router.push({
      pathname: '/dashboard/show/' 
        + user._id.toString() 
        + '/' + selectedProject._id.toString()
    },
    undefined,
    {shallow: true});
  }

  const selectProject = (project) => {
    setSelectedProject(project);
    router.push({
      pathname: '/dashboard/show/'
        + selectedUser._id.toString()
        + '/' + project._id.toString()
    },
    undefined,
    {shallow: true});
  }

  const getUsers = async () => {
    const options = {
      url: '/api/users',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }
    const res = await axios(options);
    console.log('onCommandHandler res: ', res);
    return res.data;
  }

  const clearAccounts = async (user) => {
    const userIndex = users.findIndex(u => u._id === user._id);

    console.log('clearAccounts: userIndex = ' + userIndex);
    const url = ' https://yoovplus.i234.me/api/users/' + user._id + '/accounts/clear'
    try {
      const res = await axios.post(url);
      console.log('clearAccounts: ', res);
      const user = res.data;
      console.log('user.bankAccounts: ' + JSON.stringify(user.bankAccounts));
      const updatedUsers = JSON.parse(JSON.stringify(users));
      console.log('user._id (' + (typeof user._id) + '): ' + user._id);
      const index = updatedUsers.findIndex(u => {
        console.log('u._id (' + (typeof u._id) + '): ' + u._id);
        return u._id === user._id
      });
      if (index >= 0) {
        updatedUsers[index] = user;
        setUsers(updatedUsers);
        setSelectedUserId(user._id);
      }
      // setUsers(prev => {
      //   const index = prev.findIndex(u => u._id === user._id);
      //   if (index >= 0) {
      //     prev[index] = {...prev[index], user}
      //     return JSON.parse(JSON.stringify(prev));;
      //   }
      //   return prev;
      // })
    } catch(err) {
      console.error(err);
    }
  }
  
  const onCommandHandler = async (payload) => {
    console.log('onCommandHandler: payload: ', payload);
    switch (payload.command) {
      case 'clear':
        clearAccounts(payload.user);
        break;
      case 'refresh':

      case 'connect':
        if (selectedProject && selectedUser) {
          const url = 
            '/projects/' + selectedProject._id.toString() + 
            '/users/' + selectedUser._id.toString() + '/login';
          console.log('connect: url = ' + url);
          router.push(url);
        }
        setShowSpinner(true);
        break;
      case 'users':
        getUsers();
        break;
    }
  }

  const back = () => {
    router.push('/dashboard');
  }

  return (
    <SpinnerContext.Provider value={value}>
      <Flex direction="column" w="full" h="full">
        <Flex color="white" py={2} px={3} bg="teal.600" justifyContent="space-between">
          <CompanyLogo />
          <Text fontSize="xl">Hang Seng Bank API Evaluation</Text>
        </Flex>
        {command==="error" ? (
          <Flex direction="column" alignItems="center"
             p={2} color="white" bg="red"
             gap={3}
             w="full" h="auto">
               <Text color="white"
                fontSize="lg">
                {error}
              </Text>
            <Button variant="filled" 
              bg="teal" onClick={()=>back()}>Return</Button>
          </Flex>
        ):(
        <Flex direction="row" w="full" grow="1">

          {/* Sidebar */}
          <Flex direction="column" w="300px" bg="white" p={3}>

            {/* Projects */}
            <Text fontSize="2xl">Projects</Text>
            <VStack spacing={1} mb={3}>
              {projects.map((project) => (
                <ProjectRow project={project}
                  key={project._id}
                  isSelected={selectedProject ? selectedProject._id===project._id : false}
                  onClick={()=>selectProject(project)}></ProjectRow>
              ))}
            </VStack>

            {/* Users */}
            <Text fontSize="2xl">Users</Text>
            <VStack spacing={1}>
              {users.map((user) => (
                <UserRow user={user}
                  key={user._id}
                  isSelected={selectedUser ? selectedUser._id===user._id : false}
                  onClick={()=>selectUser(user)}></UserRow>
              ))}
            </VStack>
          </Flex>

          <Divider orientation="vertical"></Divider>

          {/* Content */}
          <VStack w="full" p={3} alignItems="start" bg="yello.100">
            {/* <Tabs orientation="horizontal">
              <TabList>            
                  <Tab _selected={{bg: 'gray.200', color: 'black'}}>Opening</Tab>
                  <Tab _selected={{bg: 'gray.200', color: 'black'}}>ATMs</Tab>
                  <Tab _selected={{bg: 'gray.200', color: 'black'}}>Branches</Tab>
                  <Tab _selected={{bg: 'gray.200', color: 'black'}}>Foreign Currency Exchange Rates</Tab>

                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Foreign Currency Accounts</Tab>
                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Time Deposit Accounts</Tab>
                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Mortgage Loans</Tab>
                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Safe Deposit Box</Tab>
                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Secured Loans</Tab>
                  <Tab _selected={{bg: 'gray.100', color: 'black'}}>Unsecured Loeans</Tab>
              </TabList>
            </Tabs> */}

            {selectedUser ? (
              <UserBoard
                user={selectedUser}
                project={selectedProject}
                onCommand={(payload)=>onCommandHandler(payload)}></UserBoard>
            ): null}
          </VStack>
        {/* </Center> */}
        </Flex>
        )}
        {showSpinner ? (
        <Center w="full" h="full"
          bg="rgba(50,50,50,.6)" position="fixed">
            <Spinner size="xl"/>
        </Center>
        ) : null}

      </Flex>
    </SpinnerContext.Provider>
  );
}
  

export async function getServerSideProps(context) {
  console.log('getServerSideProps: context.query.slug: ', context.query.slug);
  const slug = context.query.slug;
  let command = 'show';
  let error = '';
  if (slug.length > 1) command = slug[0];
  console.log('slug.length = ' + slug.length);
  console.log('command = ' + command);
  switch (command) {
    case 'show':
      let selectedUserId = slug.length > 1 ? slug[1] : null;
      let selectedProjectId = slug.length > 2 ? slug[2] : null;
      //  context.null;
      // const [command, selectedUserId, selectedProjectId] = context.query.slug;
      try {
          const users = await UserService.getAll();
          const project = await ProjectService.getByName('TestProject2');
          const projects = project ? [project] : [];

          // console.log('getServerSideProps: projects: ', projects);
          return {
              props: {
                  users: JSON.parse(JSON.stringify(users)),
                  projects: JSON.parse(JSON.stringify(projects)),
                  selectedUserId,
                  selectedProjectId,
                  command,
                  error: ''
              }
          };
      } catch (err) {
          console.error('Dashboard getServerSideProps: error');
          return {
              props: {
                  users: [],
                  projects: [],
                  selectedUserId: null,
                  selectedProjectId: null,
                  command: 'error',
                  error: 'unknown-error'
              }
          }
      }
      break;
    case 'error':
      error = slug.length > 1 ? slug[1] : '(unknown error)';
      return {
        props: {
          users: [],
          projects: [],
          selectedUserId: null,
          selectedProjectId: null,
          command,
          error
        }
      }
      break;
  }
}
