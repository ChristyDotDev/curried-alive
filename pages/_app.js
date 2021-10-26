import { ChakraProvider } from "@chakra-ui/react";
import Header from "/components/Header";
import '../styles/board.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
