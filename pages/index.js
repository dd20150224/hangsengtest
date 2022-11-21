import { useRouter } from 'next/router';
import {
    Center,
    Text
} from '@chakra-ui/react';

export default function Dashboard({users}) {
    const router = useRouter();
    if (process.browser) {
        router.push('/dashboard');
    }

    return (
        <Center w="full" h="full">
            <Text fontSize="5xl">Loading ...</Text>
        </Center>
    )
}
