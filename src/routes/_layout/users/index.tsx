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
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { Route as UserAlbums } from "./$userId/albums/index"

import { useEffect } from "react"
import { LuHandHeart } from "react-icons/lu"
import userAuth from "../../../auth/user_auth"
import { UserAlbumsService, UsersService } from "../../../client"
import { CustomFooter } from "../../../components/common/CustomFooter"
import { useColorModeValue } from "../../../components/ui/color-mode"
import { formatDate } from "../../../utils"

const userSearchSchema = z.object({
	page: z.number().catch(1),
})
export const Route = createFileRoute("/_layout/users/")({
	component: ActiveUsers,
	validateSearch: (search) => userSearchSchema.parse(search),
})

// export function getUserAlbums(userIds: string[]) {
//   return {
// 	queryFn: async () => {
// 		const userPromises = userIds.map((id) =>
// 		  UserAlbumsService.getAllUserAlbums({ userId: id })
// 		);
// 		return Promise.all(userPromises);
// 	  },
// 	  queryKey: ["users", userIds.join(",")],
//   };
// }
export function getUsersAlbumsCounts(userIds: string[]) {
	return {
		queryFn: async () => {
			const promises = userIds.map((userId) =>
				UserAlbumsService.getAllUserAlbums({ userId }).then((albums) => ({
					userId,
					count: albums.data.length,
				})),
			)
			return Promise.all(promises)
		},
		queryKey: ["albums-counts", userIds.join(",")],
	}
}

const total_users_per_page = 20

function getAllUsers({ page }: { page: number }) {
	return {
		queryFn: () =>
			UsersService.getAllUsers({
				skip: (page - 1) * total_users_per_page,
				limit: total_users_per_page,
			}),
		queryKey: ["users", { page }],
	}
}

function ActiveUsers() {
	const { user } = userAuth()
	const currentUser = user
	const queryClient = useQueryClient()
	const navigate = useNavigate({ from: Route.fullPath })
	const { page } = Route.useSearch()

	const setPage = (page: number) =>
		navigate({
			search: (prev: { [key: string]: string }) => ({ ...prev, page }),
		})

	const {
		data: users,
		isPending,
		isPlaceholderData,
	} = useQuery({
		...getAllUsers({ page }),
		placeholderData: (prevData) => prevData,
	})

	const userIds = users?.data.map((user) => user.id) || []
	const { data: albumsCounts } = useQuery({
		...getUsersAlbumsCounts(userIds),
		enabled: userIds.length > 0, // Only fetch when there are userIds
	})

	const hasNextPage =
		!isPlaceholderData && users?.data.length === total_users_per_page
	const hasPreviousPage = page > 1

	useEffect(() => {
		if (hasNextPage) {
			queryClient.prefetchQuery(getAllUsers({ page: page + 1 }))
		}
	}, [page, queryClient, hasNextPage])

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
					mb={12}
				>
					<Heading fontSize={"4xl"} fontWeight={"bold"}>
						Made for photo enthusiast{" "}
						<Box as={"span"}>
							<LuHandHeart />
						</Box>{" "}
						by enthusiast
					</Heading>
				</Box>
				<Grid
					mb={8}
					w="full"
					gap={4}
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
						users?.data.map((user) => {
							const albumCount = albumsCounts?.find(
								(album) => album.userId === user.id,
							)?.count

							return (
								<GridItem
									display={"flex"}
									w="full"
									border={"1px solid"}
									borderColor={"border.muted"}
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
												gap={8}
												py={6}
												display={"flex"}
												flexDirection={"column"}
												alignItems={"center"}
												justifyContent={"center"}
											>
												<Flex
													gap={"2"}
													position={"relative"}
													direction={"column"}
												>
													{user.id === currentUser?.id && (
														<Box bg={"cyan.500"} borderRadius={"1em"}>
															<Text fontWeight={"light"} px={2}>
																You
															</Text>
														</Box>
													)}
													<Text
														fontSize={"md"}
														fontWeight={"bold"}
														textDecor={"underline"}
														color={useColorModeValue("#219EBC", "#0855B1")}
													>
														{user.username}
													</Text>
													<Text>
														Albums:{" "}
														<Box
															as="span"
															fontSize={"xl"}
															fontWeight={"semibold"}
														>
															{" "}
															{albumCount || 0}
														</Box>
													</Text>
												</Flex>
												<Box
													w="full"
													alignItems={"center"}
													justifyContent={"center"}
													gap={1}
													display={"flex"}
													flexDirection={{ base: "column", md: "row" }}
												>
													<Text color={useColorModeValue("#219EBC", "#010E54")}>
														Joined
													</Text>
													<Text fontSize={"sm"}>
														{" "}
														({user.created_at && formatDate(user.created_at)})
													</Text>
												</Box>
											</Box>
										</Box>
									</Link>
								</GridItem>
							)
						})
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
	)
}
