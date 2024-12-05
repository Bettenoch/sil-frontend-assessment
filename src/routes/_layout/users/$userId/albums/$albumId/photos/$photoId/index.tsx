import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { AllAlbumPhotosService } from "../../../../../../../../client";
import { useQuery } from "@tanstack/react-query";
import { getAlbumDetail } from "..";
import { getUserById } from "../../..";
import { formatDate } from "../../../../../../../../utils";

export const Route = createFileRoute(
  "/_layout/users/$userId/albums/$albumId/photos/$photoId/"
)({
  component: PhotoPage,
  loader: async ({ params }) => {
    return {
      userId: params.userId,
      albumId: params.albumId,
      photoId: params.photoId,
    };
  },
});

function getPhoto({
  userId,
  albumId,
  photoId,
}: {
  userId: string;
  albumId: string;
  photoId: string;
}) {
  return {
    queryFn: () =>
      AllAlbumPhotosService.getPhotoId({
        userId: userId,
        albumId: albumId,
        id: photoId,
      }),
    queryKey: ["photo", { userId, albumId, photoId }],
  };

}

function PhotoPage() {
  const { userId, albumId, photoId } = Route.useParams();
  const { data: photo, isLoading } = useQuery(
    getPhoto({ userId, albumId, photoId })

   
  );

  const {data: user} = useQuery(getUserById({userId}))
  const {data: album} = useQuery(getAlbumDetail({albumId}))
  return (
    <Container maxW={"full"}>
      <Flex w="100%" direction={"column"} mt={24} gap={8}>
      <Flex w="full" direction={{base:"column-reverse", md:"row"}} alignItems={"center"} justifyContent={"space-between"}>
          <Box className="albumInfo">
            <Text className="" fontWeight={"bold"} fontSize={"3xl"}>
              {album?.title}
            </Text>
            <VStack>
              <Text fontSize={"md"} >Last Updated At:</Text>
              <Text>({album?.updated_at?formatDate(album.updated_at): "N/A"}) </Text>
              
            </VStack>

          </Box>
          <VStack alignSelf={"center"}>
            <Image src={user?.avatar || "empty"} alt="user-profile" w={24} h={24} rounded={"full"}/>
            <Box>
              <Text fontSize={"2xl"} fontWeight={"light"}>{user?.username}</Text>
            </Box>
          </VStack>
        </Flex>

        <Flex w="full" direction={"column"} mb={16}>
          {isLoading ? (
            <Grid p={6} w="full">
              <GridItem>
                <Text>Photo is Loading please wait....</Text>
              </GridItem>
            </Grid>
          ) : (
            <>
              <Box
                w="full"
                borderRadius={"3em"}
                h={"100vh"}
                position={"relative"}
                display={"flex"}
                bg={`url(${photo?.image_url || "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2t8ZW58MHx8MHx8fDA%3D"})`}
                backgroundPosition={"center"}
                backgroundSize={"cover"}
                backgroundRepeat={"no-repeat"}
              >
                <Box
                  position={"absolute"}
                  top={0}
                  left={0}
                  display={"flex"}
                    mt={32}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                <Box position={"relative"}>
                    <Box position={"absolute"} inset={0} bg={"black"} opacity={0.6}/>
                <Text fontSize={"2xl"} fontWeight={"semibold"} position={"relative"}>
                    {photo?.photo_title}
                  </Text>
                </Box>
                </Box>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
