import { getSession } from "next-auth/client";
import io from 'socket.io-client'
import { Input } from "@chakra-ui/react"
import { Stack, Text } from "@chakra-ui/layout"
import { InputLeftElement, InputGroup,InputRightElement } from "@chakra-ui/input"
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { useRouter } from "next/router";
import React, { useState } from "react";

const socketEndpoint = process.env.SOCKET_URL;

export async function getServerSideProps(req, res) {
  const session = await getSession(req);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      socketURL: socketEndpoint
    },
  };
}

export default function Home({ socketURL }) {
  const socket = io(socketURL);
  const router = useRouter();
  const [joinLobbyId, setJoinLobbyId] = useState("");

  const updateJoinLobbyId = e => {
    setJoinLobbyId(e.target.value);
  };
  
  const handleNewGameClick = () => {
    const gameId = Math.random().toString(16).substr(2, 4)
    socket.emit('createGame', gameId);
    router.push(`/lobby/${gameId}`);
  };

  const handleJoinLobbySubmit = () => {
    if(joinLobbyId){
      router.push(`/lobby/${joinLobbyId}`);
    }
  };

  return (
    <div>
      <main>
        <Stack spacing={4}>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<ArrowForwardIcon color="gray.300" />}
            />
            <Input onChange={updateJoinLobbyId} placeholder="Enter the Lobby ID as shown on the host's screen" />
            <Button onClick={() => handleJoinLobbySubmit()}>Join Game</Button>
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
