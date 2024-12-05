import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  ListItem,
  ListRoot,
  Text,
} from "@chakra-ui/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AllPhotosService, UsersService } from "../../../client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  useColorMode,
  useColorModeValue,
} from "../../../components/ui/color-mode";
import EmptyTables from "../../../components/common/EmptyTables";
import {
  slideUpVariant,
  slideUpVariantWithDelay,
} from "../../../components/animations/variants";
import { LuMemoryStick } from "react-icons/lu";

const albumSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/photos/")({
  component: AlbumsHome,
  validateSearch: (search) => albumSearchSchema.parse(search),
});

const total_albums_per_page = 20;

function getAlbums({ page }: { page: number }) {
  return {
    queryFn: () =>
      AllPhotosService.getAllPhotos({
        skip: (page - 1) * total_albums_per_page,
        limit: total_albums_per_page,
      }),
    queryKey: ["albums"],
  };
}

function getUsersQueryOptions(userIds: string[]) {
  return {
    queryFn: async () => {
      const userPromises = userIds.map((id) =>
        UsersService.getUserById({ userId: id })
      );
      return Promise.all(userPromises);
    },
    queryKey: ["users", userIds.join(",")],
  };
}
function AlbumsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const { data: albums, isPlaceholderData } = useQuery({
    ...getAlbums({ page }),
  });

  const userIds = albums?.data.map((post) => post.owner_id).filter(Boolean);
  const uniqueUserIds = [...new Set(userIds)];

  const { data: users } = useQuery(getUsersQueryOptions(uniqueUserIds));

  const count = albums?.data.length;
  const hasNextPage =
    !isPlaceholderData && albums?.data.length === total_albums_per_page;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getAlbums({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <Flex direction={"column"} w="full">
        <Box
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
          bg={"bg.panel"}
        >
          <Text fontWeight={"bold"} fontSize={"5xl"}>
            Photos({count})
          </Text>
        </Box>
        {albums?.data.length === 0 ? (
          <EmptyTables
            title="Opps! No posts found"
            imageSrc="/images/posts/suprisedAnimation.png"
            description="Please create a new post or check back later"
          />
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
            w="100%"
            p={4}
          >
            {albums?.data.map((photo) => {
              const user = users?.find((u) => u.id === photo.owner_id);
              const avatarUrl =
                user?.avatar ||
                useColorModeValue(
                  "/images/profiles/dummyUserDark.svg",
                  "/images/profiles/dummyUserLight.svg"
                );
              

              return (
                <Link
                  to={`/users/${user?.id}/albums/${photo.id}/photos?page=1`}
                >
                  <GridItem
                    key={photo.id}
                    position={"relative"}
                    border={1}
                    boxShadow="md"
                    p={4}
                    display="flex"
                    flexDirection="column"
                    minH={96}
                    justifyContent="space-between"
                    alignItems="center"
                    transition="transform 0.2s ease"
                    bg={`url(${photo?.image_url || "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2t8ZW58MHx8MHx8fDA%3D"})`}
                    backgroundPosition={"center"}
                    backgroundSize={"cover"}
                    backgroundRepeat={"no-repeat"}
                    _hover={{ transform: "scale(1.05)" }}
                    cursor="pointer"
                  >
                    <Box
                      position={"absolute"}
                      inset={0}
                      top={0}
                      left={0}
                      w="full"
                      h="full"
                      bg={colorMode === "light" ? "whitesmoke" : "black"}
                      opacity={colorMode === "light" ? "0.2" : "0.4"}
                      bgBlendMode="multiply"
                    />
                    <Box
                      flexDirection={"column"}
                      position={"relative"}
                      display={"flex"}
                      w="full"
                      h="full"
                      
                      minH={96}
                    >
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        {photo.photo_title}
                        
                      </Text>
                      <Box display={"flex"} flexDirection={{base:"column", sm:"row"}}  position={"absolute"} bottom={0} right={0}>
                          <Text fontSize={"sm"}>{user?.username}</Text>
                          <Image
                              src={avatarUrl}
                              alt="avatar"
                              boxSize="30px" // Set the size of the avatar image
                              borderRadius="full" // Make the image circular
                            />
                        </Box>
                    </Box>
                  </GridItem>
                </Link>
              );
            })}
          </Grid>
        )}

        {/* Pagination Controls */}
        <Flex
          gap={4}
          alignItems="center"
          mt={8}
          direction="row"
          justifyContent="flex-end"
          px={4}
        >
          <Button onClick={() => setPage(page - 1)} disabled={!hasPreviousPage}>
            Previous
          </Button>
          <Text>Page {page}</Text>
          <Button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
            Next
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

function AlbumsHome() {
  const linearBg0 = useColorModeValue(
    "linear(to-r, #D3AF85, #8E5915)",
    "linear(to-r, #FED053, #423738)"
  );
  const textColor = useColorModeValue("ui.secondary", "ui.primary");
  const { colorMode } = useColorMode();
  return (
    <Container maxW="100%" p={0} m={0}>
      <Box
        className="modelsContainer"
        w={"100%"}
        minH={"100vh"}
        py={8}
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
        position={"relative"}
        bgImage={
          colorMode === "light"
            ? "url(/images/testimonials/TestimonialsBg.svg)"
            : "url(/images/testimonials/darkTestimonialBg.svg)"
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          position={"relative"}
          minH={"100vh"}
          p={4}
        >
          <Box
            textAlign="center"
            color={textColor}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            maxW={"80%"}
            mt={8}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUpVariant}
            >
              <Box fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}>
                Enjoy the Knowledge Craft{" "}
                <Box as="span" bgGradient={linearBg0} fontWeight="extrabold">
                  Blog
                </Box>{" "}
                of Magic{" "}
                <Box as="span" fontWeight="extrabold">
                  <LuMemoryStick />
                </Box>{" "}
              </Box>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUpVariantWithDelay}
            >
              <Text fontSize={"xl"} mt={4}>
                Welcome to the KCraft Blog! This space is dedicated to all
                things machine learning, artificial intelligence, and, of
                course, the cutting-edge developments of KCraft. Whether you're
                here to share insights, ask thought-provoking questions, or dive
                deep into the latest trends, you&apos;ll find something to
                inspire and challenge your curiosity
              </Text>
            </motion.div>
          </Box>
          <motion.div
            className="flex mt-6"
            initial="hidden"
            animate="visible"
            variants={slideUpVariantWithDelay}
          >
            <ListRoot
              display={"grid"}
              gridGap={4}
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
            >
              <ListItem cursor={"pointer"}>
                <Box
                  bg={useColorModeValue("#231d0d", "#F0EAD8")}
                  display={"flex"}
                  minW={32}
                  minH={16}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderTopLeftRadius={"2em"}
                  borderBottomRightRadius={"3em"}
                >
                  <Text p={2} color={"burlywood"} fontWeight={"bold"}>
                    Craft News
                  </Text>
                </Box>
              </ListItem>
              <ListItem cursor={"pointer"}>
                <Box
                  bg={useColorModeValue("#F0EAD8", "#2F2711")}
                  display={"flex"}
                  minW={32}
                  minH={16}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderTopLeftRadius={"2em"}
                  borderBottomRightRadius={"3em"}
                >
                  <Text
                    p={2}
                    color={useColorModeValue("red.300", "red.800")}
                    fontWeight={"bold"}
                  >
                    Model Selection
                  </Text>
                </Box>
              </ListItem>
              <ListItem cursor={"pointer"}>
                <Box
                  bg={useColorModeValue("#231d0d", "#F0EAD8")}
                  display={"flex"}
                  minW={32}
                  minH={16}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderTopLeftRadius={"2em"}
                  borderBottomRightRadius={"3em"}
                >
                  <Text
                    p={2}
                    color={useColorModeValue("blue.300", "purple")}
                    fontWeight={"bold"}
                  >
                    Fine Tuning
                  </Text>
                </Box>
              </ListItem>
              <ListItem cursor={"pointer"}>
                <Box
                  bg={useColorModeValue("#F0EAD8", "#2F2711")}
                  display={"flex"}
                  minW={32}
                  minH={16}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderTopLeftRadius={"2em"}
                  borderBottomRightRadius={"3em"}
                >
                  <Text p={2} color={"orange.500"} fontWeight={"bold"}>
                    Embeddings
                  </Text>
                </Box>
              </ListItem>
            </ListRoot>
          </motion.div>
          <Box
            display={"flex"}
            w={"full"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            mr={12}
          >
            Add Photo
          </Box>
          <AlbumsPage />
        </Box>
      </Box>
    </Container>
  );
}
