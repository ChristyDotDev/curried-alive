import { getSession } from "next-auth/client";
import io from 'socket.io-client'
import { Stack, Text } from "@chakra-ui/layout"

const socketEndpoint = process.env.SOCKET_URL;

export async function getServerSideProps(req, res) {
  const session = await getSession(req);
  console.log(req)
  const lobbyId = req.params.id;
  
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const myUser = session.user.name;
  return {
    props: {
      socketURL: socketEndpoint,
      username: myUser,
      lobbyId: lobbyId
    },
  };
}

export default function Home({ username, socketURL, lobbyId }) {
  const socket = io(socketURL);
  
  socket.emit('joinGame', lobbyId);
  socket.on('joinedGame', gameId => {
    console.log('Joined game: ', gameId);
  });

  return (
    <div>
      <main>
        <Stack spacing={4}>
            <Text>Lobby ID: {lobbyId}</Text>
            <Text>Username: {username}</Text>
        </Stack>
      </main>
    </div>
  );
}
