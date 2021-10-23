import { getSession } from "next-auth/client";

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

  const myUser = session.user.name;
  return {
    props: {
      username: myUser
    },
  };
}

export default function Home({ username }) {
  return (
    <div>
      <main>
        <h1>Welcome {username}</h1>
        <p>Enter your game ID as shown on the game screen</p>
        <p>Or host a new game</p>
      </main>
    </div>
  );
}
