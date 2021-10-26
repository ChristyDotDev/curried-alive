import { getSession } from "next-auth/client";
import io from 'socket.io-client'
import { Input } from "@chakra-ui/react"
import { Stack, Text } from "@chakra-ui/layout"
import { InputLeftElement, InputGroup,InputRightElement } from "@chakra-ui/input"
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { useRouter } from "next/router";

const socketEndpoint = process.env.SOCKET_URL;

export async function getServerSideProps(req, res, context) {
  const session = await getSession(req);
  
  
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const myUser = session.user.name;
  console.log(socketEndpoint)
  const socket = io(socketEndpoint);
  return {
    props: {
      socketURL: socketEndpoint
    },
  };
}

export default function Home({ socketURL }) {
  const socket = io(socketURL);
  const router = useRouter();
  
  const handleNewGameClick = () => {
    const gameId = Math.random().toString(16).substr(2, 4)
    socket.emit('createGame', gameId);
    router.push(`/lobby/${gameId}`);
  };

  socket.on('joinedGame', gameId => {
    console.log('Joined game: ', gameId);
  });

  return (
    <div>
      <main>
        <Stack spacing={4}>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<ArrowForwardIcon color="gray.300" />}
            />
            <Input placeholder="Enter the Lobby ID as shown on the host's screen" />
            <Button>Join Game</Button>
          </InputGroup>

          <InputGroup>
            <Text>Or if you want to host a game: </Text>
            <Button onClick={() => handleNewGameClick()}>Create a New Lobby</Button>
          </InputGroup>
        </Stack>
      </main>
    </div>
  );
}
