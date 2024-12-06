import { Box, Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <footer className="w-[100%] min-h-48">
      <Flex
        p={6}
        maxW={"full"}
        gap={8}
        textAlign={"center"}
        alignItems={"center"}
        direction={{base:"column", md:"row"}}
        justifyContent={"center"}
      >
        <Text fontSize={"3xl"} fontWeight={"extrabold"}>
          SIL STUDIO
        </Text>
        <Text>
          Made with <Box as="span"  color="teal.500">love</Box> by{" "}
          <Link
            href="https://www.linkedin.com/in/junisture/"
            color="teal.500"
            _hover={{ textDecoration: "underline" }}
          >
            Bett Enoch
          </Link>
        </Text>
      </Flex>
    </footer>
  );
};

export default Footer;
