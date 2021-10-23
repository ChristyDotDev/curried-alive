import { getSession } from "next-auth/client";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";

export async function getServerSideProps(req, res) {
  const session = await getSession(req);

  if (session?.user) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function Landing({ }) {
  return (
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="12px auto"
    >
      <VStack spacing={8} align="stretch">
        <Spacer />
        <Box h="40px">
          Welcome to Curried Alive. The wonky guessing game that totally isn't just pictionary because I told Josh I'd get my head round Websockets.
          You can login using your Twitch credentials using OAuth
        </Box>
        <Spacer />
      </VStack>
    </Flex>
  );
}
