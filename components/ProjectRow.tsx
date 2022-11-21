import { MdBook } from 'react-icons/md';
import {
    HStack,
    Text,
    Icon,
    Button
} from '@chakra-ui/react';

export default function ProjectRow(props) {
    const project = props.project;
    return (
        <HStack key={project._id}      
            cursor="pointer" 
            onClick={()=>props.onClick()}     
            alignItems="center" h={10} w="full" 
            bg={props.isSelected?"teal.500":"teal.100"}
            color={props.isSelected?'white':'black'}
            justifyContent="space-between"
            _hover={{bg:'teal.300', color:'white'}} px={2}> 
            <HStack>
                <Icon as={MdBook} color={props.isSelected?"teal.100":"teal.500"} width={6} height={6} />
                <Text ml={0} mr="auto">{project.name}</Text>
            </HStack>
            {/* <HStack w="auto">
            <Button aria-label="connect" 
                ml="auto"
                size="sm"
                color="white" bg="teal.500"
                onClick={()=>props.onClick()}
                _hover={{bg:'teal.700'}}>
                <Icon as={MdOutlinePowerSettingsNew}
                    width={5} height={5}></Icon>
            </Button>
            </HStack> */}
        </HStack>
    );
}

