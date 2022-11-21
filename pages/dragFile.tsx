import DropZone from 'components/DropZone';
import { Formik, useFormik } from 'formik';
import axios from 'axios';

import { useFormikContext } from 'formik';
// Then inside the component body
import {
    Box,
    HStack,
    Button,
    VStack,
    Input
} from '@chakra-ui/react';

export default function DragFile(props) {
    // const formik = useFormik({
    // });
    const formik = useFormik({
        initialValues: {
            clientId: '',
            kid: '',
            transportCert: '',
            privateKey: '',
            callbackUrl: ''
        },
        onSubmit: (values) => {
            let data = new FormData();
            data.append('clientId', values.clientId);
            data.append('kid', values.kid);
            data.append('callbackUrl', values.callbackUrl);
            if (values.transportCert) data.append('transportCert', values.transportCert);
            if (values.privateKey) data.append('privateKey', values.privateKey);
            console.log('transportCert (' + (typeof values.transportCert) + '): ', values.transportCert);
            const url = '/api/upload';
            axios.post(url, data).then(res => {
                console.log('res.data: ', res.data);
            })
        }
    })

    const onFileUploadHandler = payload => {
        console.log('onFileUploadHandler: payload: ', payload);
    };

    return (
        <Box w="80%" bg="blue.200" mx="auto" p={3}>
            <form onSubmit={formik.handleSubmit}>
                <HStack w="full">
                    <VStack w="full" bg="blue.300" p={3} alignItems="left">
                                <label htmlFor="clientId">Client ID</label>
                                {JSON.stringify(formik.values)}
                                <Input
                                    id="clientId"
                                    name="clientId"
                                    type="text"
                                    onChange={val=>formik.setFieldValue('clientId',val)}
                                    value={formik.values.clientId}/>

                                <label htmlFor="kid">KID</label>
                                <Input
                                    id="kid"
                                    name="kid"
                                    type="text"
                                    onChange={value=>formik.setFieldValue('kid', value)}
                                    value={formik.values.kid}/>

                                <label htmlFor="kid">Callback URL</label>
                                <Input
                                    id="callbackUrl"
                                    name="callbackUrl"
                                    type="text"
                                    onChange={value=>formik.setFieldValue('callbackUrl', value)}
                                    value={formik.values.callbackUrl}/>

                                <label>Transport Certificate</label>
                                <Box minHeight="300px" className="drag-file">
                                    <DropZone onInput={payload=>formik.setFieldValue('transportCert', payload)}>
                                        <p>
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                            sflksdkfjdslfkjdslksadsadfkdsjhfjkdshfkdshfdksjfhdsfdsfdsfd
                                        </p>
                                    </DropZone>
                                </Box>
                    </VStack>
                    <VStack>
                        <Button onClick={()=>formik.handleSubmit()}>sdfds</Button>
                    </VStack>
                </HStack>
            </form>    
        </Box>
    );
}
