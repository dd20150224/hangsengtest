// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme';
import './global.css';

// import { connectToServer} from '../db/conn.js';

function MyApp({ Component, pageProps }) {
  // connectToServer( () => {
  //   console.log('DB connected.');
  // })
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps}/>
    </ChakraProvider>
  )
}

export default MyApp
