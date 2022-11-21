import {
    Button,
    Icon,
    Text
} from '@chakra-ui/react';

export default function UserBoardButton(props) {
    return (
        <Button minWidth="120px" onClick={()=>props.onClick(props.command)}
            colorScheme={props.colorScheme}
            color="white">
            <Icon mr={3} as={props.icon} w={5} h={5}></Icon>
            <Text>{props.label}</Text>
        </Button>
    )
}