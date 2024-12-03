import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { Route as UserAlbums } from "./$userId/albums/index";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { useEffect } from "react";
import userAuth from "../../../auth/user_auth";
import { UsersService } from "../../../client";
import { CustomFooter } from "../../../components/common/CustomFooter";

const userSearchSchema = z.object({
  page: z.number().catch(1),
});
export const Route = createFileRoute("/_layout/users/")({
  component: ActiveUsers,
  validateSearch: (search) => userSearchSchema.parse(search),
});

const total_users_per_page = 20;

function getAllUsers({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.getAllUsers({
        skip: (page - 1) * total_users_per_page,
        limit: total_users_per_page,
      }),
    queryKey: ["users", { page }],
  };
}

function ActiveUsers() {
  const { user } = userAuth();
  const currentUser = user;
  const queryClient = useQueryClient();

  const navigate = useNavigate({ from: Route.fullPath });
  const { page } = Route.useSearch();

  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const {
    data: users,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getAllUsers({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage =
    !isPlaceholderData && users?.data.length === total_users_per_page;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getAllUsers({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);
  return (
    <Container maxW={"100%"}>
      <Flex
        mt={24}
        p={6}
        direction={"column"}
        minH={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
        gap={6}
      >
        <Box
          display={"flex"}
          w="full"
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Heading fontSize={"4xl"} fontWeight={"bold"}>
            Welcome to SIL Studio
          </Heading>
        </Box>
        <Grid
          mb={8}
          w="full"
          placeItems={"center"}
          templateColumns={{
            base: "repeat(1,1fr)",
            sm: "repeat(2,1fr)",
            md: "repeat(4,1fr)",
            lg: "repeat(5,1fr)",
          }}
        >
          {isPending ? (
            <GridItem alignSelf={"center"}>
              {new Array(10).fill(null).map((_, index) => (
                <Box key={index}>
                  <Skeleton />
                </Box>
              ))}
            </GridItem>
          ) : (
            <>
              {users?.data.map((user) => (
                <GridItem
                  display={"flex"}
                  w="full"
                  alignItems={"stretch"}
                  justifyContent={"center"}
                  key={user.id}
                  opacity={isPlaceholderData ? 0.5 : 1}
                >
                  <Link to={UserAlbums.fullPath} params={{ userId: user.id }}>
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Image
                        src={user.avatar || ""}
                        alt={user.username}
                        w={16}
                        h={16}
                        rounded={"full"}
                      />

                      <Box
                        w="full"
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Flex gap={"2"} position={"relative"}>
                          {user.id === currentUser?.id && (
                            <Box bg={"cyan.500"} borderRadius={"1em"}>
                              <Text fontWeight={"light"} px={2}>
                                You
                              </Text>
                            </Box>
                          )}
                          <Text>{user.username}</Text>
                          {}
                        </Flex>
                        <Text>Joined:</Text>
                      </Box>
                    </Box>
                  </Link>
                </GridItem>
              ))}
            </>
          )}
        </Grid>
        <CustomFooter
          page={page}
          onChangePage={setPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </Flex>
    </Container>
  );
}
