import React from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react"

type EmptyTablesProps ={
    title: string;
    description: string;
    imageSrc: string;
}
const EmptyTables:React.FC<EmptyTablesProps> = ({title, description, imageSrc}: EmptyTablesProps) => {
  return (
    <Box display={"flex"} w="100%" alignItems={"center"} justifyContent={"center"} minH={"60vh"}>
        <Box>
            <Heading as={"h2"} size={"md"}>{title}</Heading>
            <Box display={"flex"} maxW={64}>
                <Image src={imageSrc} alt="surprisedAnimation" objectFit={"cover"} flex={1}/>
            </Box>
            <Text>{description}</Text>
        </Box>


    </Box>
  )
}

export default EmptyTables;