import { useRouter } from "next/router";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/client";
import React from "react";
import { Heading, Flex, Text, Button } from "@chakra-ui/react";

export default function Header() {
  const router = useRouter();
  const [session] = useSession();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      background="#202736"
    >
      <Flex align="center" mr={4}>
        <Heading
          as="h1"
          size="lg"
          letterSpacing={"tighter"}
          cursor="pointer"
          onClick={() => router.push("/")}
        >
          Curried Alive
        </Heading>
      </Flex>

      {session ? (
        <Flex align="center">
          <Text margin="10px">{session.user.name || session.user.email}</Text>
          <Image
            src={session.user.image}
            width="32px"
            height="32px"
            margin="10px"
          />
          <Button
            variant="outline"
            _hover={{ bg: "#2c354a", borderColor: "#2c354a" }}
            margin="10px"
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </Flex>
      ) : (
        <Button
          variant="outline"
          _hover={{ bg: "#2c354a", borderColor: "#2c354a" }}
          onClick={() => signIn()}
        >
          Log In
        </Button>
      )}
    </Flex>
  );
}
