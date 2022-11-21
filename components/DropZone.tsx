import { useCallback } from 'react';

import { MdFileUpload } from 'react-icons/md';
import { StylesProvider } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

import {
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Box,
  Icon
} from '@chakra-ui/react';

import styles from './DropZone.module.css';

function Dropzone({ open, children, onInput }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      onInput(acceptedFiles[0]);
    }  
  }, []);
  const { getRootProps, isDragActive, getInputProps, acceptedFiles } =
    useDropzone({onDrop});
  const files = acceptedFiles.map((file, index) => (
    <li key={index}>
      file.path - {file.size} bytes
    </li>
  ));

  const onClickHandler = e => {
    e.stopPropagation();
  }
  return (
    <Box w="100%" m="auto" p={0}
      onClick={e=>e.stopPropagation()}>
      
      <Flex direction="row" w="full" h="full"
        {...getRootProps({ className: "dropzone" })}>
        <Flex grow={1} w="full" minHeight="300px" h="100%"  bg={isDragActive?'red':'yellow'}
              onClick={e=>e.stopPropagation()}
          className={'container' + styles['drop-zone']}>
          <input {...getInputProps()} />
          {children}
        </Flex>
        <Button w="80px" 
          ml={1}
          colorScheme="teal" onClick={open}>
            <Icon as={MdFileUpload}></Icon>
        </Button>
      </Flex>
      {/* <aside>
        <Text fontSize="xl">File List</Text>
        <ul>{files}</ul>
      </aside> */}
    </Box>
  );
}
export default Dropzone;