import {
	Box,
	Button,
	Container,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Image,
	ListItem,
	ListRoot,
	Text,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import AddAlbum from "../../../components/albums/AddAlbum"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { LuMemoryStick } from "react-icons/lu"
import { z } from "zod"
import { AlbumsService, UsersService } from "../../../client"
import {
	slideUpVariant,
	slideUpVariantWithDelay,
} from "../../../components/animations/variants"
import EmptyTables from "../../../components/common/EmptyTables"
import {
	useColorMode,
	useColorModeValue,
} from "../../../components/ui/color-mode"
import { formatDate } from "../../../utils"
import userAuth from "../../../auth/user_auth"

const albumSearchSchema = z.object({
	page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/albums/")({
	component: AlbumsHome,
	validateSearch: (search) => albumSearchSchema.parse(search),
})

const total_albums_per_page = 20

function getAlbums({ page }: { page: number }) {
	return {
		queryFn: () =>
			AlbumsService.getAlbums({
				skip: (page - 1) * total_albums_per_page,
				limit: total_albums_per_page,
			}),
		queryKey: ["albums"],
	}
}

function getUsersQueryOptions(userIds: string[]) {
	return {
		queryFn: async () => {
			const userPromises = userIds.map((id) =>
				UsersService.getUserById({ userId: id }),
			)
			return Promise.all(userPromises)
		},
		queryKey: ["users", userIds.join(",")],
	}
}
function AlbumsPage() {
	const navigate = useNavigate({ from: Route.fullPath })
	const { page } = Route.useSearch()
	const { colorMode } = useColorMode()
	
	const textColor = useColorModeValue("ui.secondary", "ui.primary")
	const queryClient = useQueryClient()

	const setPage = (page: number) =>
		navigate({
			search: (prev: { [key: string]: string }) => ({ ...prev, page }),
		})

	const { data: albums, isPlaceholderData } = useQuery({
		...getAlbums({ page }),
	})

	const userIds = albums?.data.map((post) => post.owner_id).filter(Boolean)
	const uniqueUserIds = [...new Set(userIds)]

	const { data: users } = useQuery(getUsersQueryOptions(uniqueUserIds))

	const count = albums?.data.length
	const hasNextPage =
		!isPlaceholderData && albums?.data.length === total_albums_per_page
	const hasPreviousPage = page > 1

	useEffect(() => {
		if (hasNextPage) {
			queryClient.prefetchQuery(getAlbums({ page: page + 1 }))
		}
	}, [page, queryClient, hasNextPage])

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
						Albums({count})
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
							md: "repeat(2, 1fr)",
							lg: "repeat(3, 1fr)",
						}}
						gap={6}
						w="100%"
						p={4}
					>
						{albums?.data.map((album) => {
							const user = users?.find((u) => u.id === album.owner_id)
							const avatarUrl =
								user?.avatar ||
								useColorModeValue(
									"/images/profiles/dummyUserDark.svg",
									"/images/profiles/dummyUserLight.svg",
								)
							const albumOwner = user?.username || "Uknown"
							const randomNumber = Math.floor(Math.random() * 10) + 3

							return (
								<Link
									key={album.id}
									to={`/users/${user?.id}/albums/${album.id}/photos?page=1`}
								>
									<GridItem
										position={"relative"}
										bg={"transparent"}
										border={1}
										boxShadow="md"
										borderRadius="md"
										p={4}
										display="flex"
										flexDirection="column"
										justifyContent="space-between"
										alignItems="center"
										transition="transform 0.2s ease"
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
											display={"flex"}
											position={"relative"}
											flexDirection={"column"}
										>
											<Box
												display={"flex"}
												maxW={{ base: "100%", md: "96" }}
												maxH={{ base: "96", md: "64" }}
											>
												<Image
													src={album.cover_photo || ""}
													alt={album.title}
													flex={1}
													borderRadius="md"
													objectFit="cover"
													mb={4}
												/>
											</Box>
											<Box className="items-center justify-start">
												<Heading
													size="md"
													textAlign="start"
													mb={4}
													maxW={"280px"}
												>
													<Text fontSize={"md"} fontWeight={"semibold"}>
														{album.title}
													</Text>
												</Heading>
												<Box>
													<HStack fontWeight="semibold" color={textColor}>
														<Image
															src={avatarUrl}
															alt="avatar"
															boxSize="30px" // Set the size of the avatar image
															borderRadius="full" // Make the image circular
														/>
														<Text>{albumOwner}</Text>
													</HStack>
													<Box
														display={"flex"}
														alignItems={"center"}
														justifyContent={"space-between"}
														gap={4}
													>
														<Text>{formatDate(album.created_at)}</Text>
														<Box
															bg={useColorModeValue("#231D0D", "#EEE6D2")}
															display={"flex"}
															maxW={"max-content"}
															textAlign={"center"}
															borderRadius={"2em"}
														>
															<Text
																px={2}
																color={useColorModeValue("#EEE6D2", "#231D0D")}
															>
																{randomNumber} stars
															</Text>
														</Box>
													</Box>
												</Box>
											</Box>
										</Box>
									</GridItem>
								</Link>
							)
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
	)
}

function AlbumsHome() {
	const {user} = userAuth()
	const userId = user?.id || "null"
	const linearBg0 = useColorModeValue(
		"linear(to-r, #D3AF85, #8E5915)",
		"linear(to-r, #FED053, #423738)",
	)
	const textColor = useColorModeValue("ui.secondary", "ui.primary")
	const { colorMode } = useColorMode()
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
							  A Gallery of {" "}
								<Box as="span" bgGradient={linearBg0} fontWeight="extrabold">
								Timeless & memorable
								</Box>{" "}
								Moments{" "}
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
							&quot;Your Memories, Beautifully Captured&quot;
							Showcase your albums, a collection of moments frozen in time.
							 Relive the joy, laughter, and love through stunning visuals.
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
										Artistic
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
										Stunning
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
										Timeless
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
										Futuristic
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
						<AddAlbum userId= {userId}/>
					</Box>
					<AlbumsPage />
				</Box>
			</Box>
		</Container>
	)
}
