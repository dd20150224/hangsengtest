import { useRouter } from 'next/router';
import { Center, Spinner } from '@chakra-ui/react';

export default function Dashboard(props) {
    const router = useRouter();
    if (process.browser) {
        router.push('/dashboard/show');
    }
    return (
        <Center h="50%" w="full">
            <Spinner size="xl" />
        </Center>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            url: '/dashboard/show'
        }
    }
}