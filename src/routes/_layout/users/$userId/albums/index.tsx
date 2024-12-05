import {
	Box,
	Container,
	Flex,
	Grid,
	GridItem,
	Image,
	Skeleton,
	Text,
	VStack,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { LuArrowBigLeft } from "react-icons/lu"
import { z } from "zod"
import { UserAlbumsService, UsersService } from "../../../../../client"
import Breadcrumb from "../../../../../components/common/Breadcrumb"
import { CustomFooter } from "../../../../../components/common/CustomFooter"
import { Route as AlbumPhotos } from "./$albumId/photos/"
const albumSearchSchema = z.object({
	page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/users/$userId/albums/")({
	component: UserAlbum,
	validateSearch: (search) => albumSearchSchema.parse(search),
	loader: async ({ params }) => {
		return { userId: params.userId }
	},
})
const total_albums_per_page = 20

function getUserAlbums({ userId, page }: { userId: string; page: number }) {
	return {
		queryFn: () =>
			UserAlbumsService.getAllUserAlbums({
				userId: userId,
				skip: (page - 1) * total_albums_per_page,
				limit: total_albums_per_page,
			}),
		queryKey: ["user_albums", { userId, page }],
	}
}
export function getUserById({ userId }: { userId: string }) {
	return {
		queryFn: () => UsersService.getUserById({ userId: userId }),
		queryKey: ["user", userId],
	}
}
function UserAlbum() {
	const navigate = useNavigate({ from: Route.fullPath })
	const { userId } = Route.useParams()
	const { page } = Route.useSearch()
	const queryClient = useQueryClient()

	const breadcrumbItems = [{ label: "dasboard", href: "/users" }]
	const setPage = (page: number) =>
		navigate({
			search: (prev: { [key: string]: string }) => ({ ...prev, page }),
		})

	const {
		data: albums,
		isPending,
		isPlaceholderData,
	} = useQuery({
		...getUserAlbums({ userId, page }),
	})
	const count = albums?.data.length

	const hasNextPage =
		!isPlaceholderData && albums?.data.length === total_albums_per_page
	const hasPreviousPage = page > 1

	useEffect(() => {
		if (hasNextPage) {
			queryClient.prefetchQuery(getUserAlbums({ userId, page: page + 1 }))
		}
	}, [userId, page, queryClient, hasNextPage])

	const { data: user } = useQuery(getUserById({ userId }))

	return (
		<Container maxW={"100%"}>
			<Box
				w="full"
				p={6}
				mt={24}
				display={"flex"}
				minH={"100vh"}
				flexDirection={"column"}
				gap={12}
			>
				<Box w="full">
					<Breadcrumb items={breadcrumbItems} />
				</Box>
				<Flex
					w="full"
					alignItems={"center"}
					gap={6}
					direction={{ base: "column-reverse", md: "row" }}
					justifyContent={"space-around"}
				>
					<Box className="">
						{user && (
							<Flex direction={"column"} gap={4}>
								<Text fontSize={"2xl"} fontWeight={"semibold"}>
									{count} Albums
								</Text>
								<Link to={"/users"} className="flex">
									<Flex>
										<LuArrowBigLeft />
										<Text textDecoration={"underline"}>Back to home</Text>
									</Flex>
								</Link>
							</Flex>
						)}
					</Box>
					<Flex
						border={"1px solid"}
						borderRadius={"2em"}
						alignItems={"center"}
						direction={"column"}
					>
						<Box p={4}>
							{user && (
								<Box>
									<Image
										src={user.avatar || ""}
										alt={user.username}
										w={24}
										h={24}
										rounded={"full"}
									/>
								</Box>
							)}
						</Box>
						<VStack p={4}>
							<Box
								w="full"
								display={"flex"}
								alignItems={"center"}
								justifyContent={"end"}
							>
								<Text>{}</Text>
							</Box>
							<Box
								display={"flex"}
								flexDir={"column"}
								alignItems={"flex-start"}
							>
								<Text fontSize={"4xl"} fontWeight={"bold"}>
									{user?.name}
								</Text>
								<Text fontSize={"md"} fontWeight={"light"} fontStyle={"italic"}>
									USERNAME: {user?.username}
								</Text>
								<Text
									fontSize={"sm"}
									fontWeight={"semibold"}
									textDecoration={"underline"}
								>
									EMAIL: {user?.email}
								</Text>
							</Box>
						</VStack>
					</Flex>
				</Flex>
				<Flex
					w="full"
					position={"relative"}
					minH={"80vh"}
					direction={"column"}
					gap={4}
				>
					<Box
						w={"full"}
						alignItems={"center"}
						justifyContent={"center"}
						bg={"bg.panel"}
					>
						<Text fontWeight={"bold"} fontSize={"5xl"}>
							Albums
						</Text>
					</Box>
					<Grid
						w="full"
						placeItems={"center"}
						gap={6}
						templateColumns={{
							base: "repeat(1,1fr)",
							sm: "repeat(2,1fr)",
							md: "repeat(4,1fr)",
							lg: "repeat(4,1fr)",
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
								{albums?.data.map((album) => (
									<GridItem
										key={album.id}
										display={"flex"}
										w="full"
										flexDir={"column"}
									>
										<Link
											to={AlbumPhotos.fullPath}
											params={{ userId: album.owner_id, albumId: album.id }}
										>
											<Box
												borderTopStartRadius={"3em"}
												w={"full"}
												h={64}
												position={"relative"}
												display={"flex"}
												bg={`url(${album.cover_photo || "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2t8ZW58MHx8MHx8fDA%3D"})`}
												backgroundPosition={"center"}
												backgroundSize={"cover"}
												backgroundRepeat={"no-repeat"}
											>
												<Box
													position={"absolute"}
													bottom={0}
													display={"flex"}
													w="full"
													flexDirection={"column"}
													alignItems={"center"}
													justifyContent={"center"}
												>
													<Box
														position={"relative"}
														display={"flex"}
														maxW={"max-content"}
													>
														<Box
															position={"absolute"}
															inset={0}
															bg={"black"}
															opacity={0.6}
														/>
														<Text
															position={"relative"}
															px={2}
															color={"#F5F5F5"}
															fontSize={"2xl"}
															fontWeight={"semibold"}
														>
															{album.title}
														</Text>
													</Box>
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
			</Box>
		</Container>
	)
}
