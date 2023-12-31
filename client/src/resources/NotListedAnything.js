import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';

export default function NotListedAnything() {
  return (
<Flex
  direction="column"
  alignItems="center"
  justifyContent="center"
  minH="80vh"
>
  <Box textAlign="center" py={10} px={6}>
    <Heading
      display="inline-block"
      as="h2"
      size="2xl"
      bgGradient="linear(to-r, teal.400, teal.600)"
      backgroundClip="text"
    >
      Nothing Listed
    </Heading>
    <Text fontSize="18px" mt={3} mb={2}>
    There isn't listed anything yet
    </Text>
    <Text color={"gray.500"} mb={6}>
    Let go of what you don't use anymore
    </Text>

    <a href="/">
      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
      >
        Go to Home
      </Button>
    </a>
  </Box>
</Flex>
  );
}