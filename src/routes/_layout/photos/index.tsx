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
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { LuMemoryStick } from "react-icons/lu"
import { z } from "zod"

import { AllPhotosService, UsersService } from "../../../client"
import {
	slideUpVariant,
	slideUpVariantWithDelay,
} from "../../../components/animations/variants"
import EmptyTables from "../../../components/common/EmptyTables"
import AddPhoto from "../../../components/photos/AddPhoto"
import {
	useColorMode,
	useColorModeValue,
} from "../../../components/ui/color-mode"

const albumSearchSchema = z.object({
	page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/photos/")({
	component: AlbumsHome,
	validateSearch: (search) => albumSearchSchema.parse(search),
})
const PhotoTags = [
	"nature",
	"aestethic",
	"colorful",
	"christmas",
	"science",
	"artistic",
]

const total_albums_per_page = 20

export function getAllPhotos({ page }: { page: number }) {
	return {
		queryFn: () =>
			AllPhotosService.getAllPhotos({
				skip: (page - 1) * total_albums_per_page,
				limit: total_albums_per_page,
			}),
		queryKey: ["photos"],
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
	const queryClient = useQueryClient()

	const setPage = (page: number) =>
		navigate({
			search: (prev: { [key: string]: string }) => ({ ...prev, page }),
		})

	const { data: albums, isPlaceholderData } = useQuery({
		...getAllPhotos({ page }),
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
			queryClient.prefetchQuery(getAllPhotos({ page: page + 1 }))
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
							const user = users?.find((u) => u.id === photo.owner_id)
							const avatarUrl =
								user?.avatar ||
								useColorModeValue(
									"/images/profiles/dummyUserDark.svg",
									"/images/profiles/dummyUserLight.svg",
								)

							return (
								<Link
									key={photo.id}
									to={`/users/${photo.owner_id}/albums/${photo.album_id}/photos/${photo.id}`}
								>
									<Box overflow={"hidden"}>
										<GridItem
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
												<Box
													display={"flex"}
													flexDirection={{ base: "column", sm: "row" }}
													position={"absolute"}
													bottom={0}
													right={0}
												>
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
									</Box>
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
								PHOTO{" "}
								<Box as="span" bgGradient={linearBg0} fontWeight="extrabold">
									GALLERY
								</Box>{" "}
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
								Explore our collection of captured moments, each telling its own
								story.Discover every frame, every laugh, and every cherished
								moment.
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
							listStyle={"none"}
							gridTemplateColumns={{
								base: "repeat(2, 1fr)",
								sm: "repeat(3, 1fr)",
								md: "repeat(5, 1fr)",
								lg: "repeat(6, 1fr)",
							}}
						>
							{PhotoTags.map((tag) => {
								return (
									<ListItem key={tag} cursor={"pointer"} border={"1px solid"}>
										<Box
											display={"flex"}
											alignContent={"center"}
											alignItems={"center"}
											justifyContent={"center"}
										>
											<Text px={2} color={"blue.400"} fontWeight={"bold"}>
												{tag}
											</Text>
										</Box>
									</ListItem>
								)
							})}
						</ListRoot>
					</motion.div>
					<Box
						display={"flex"}
						w={"full"}
						alignItems={"center"}
						justifyContent={{ base: "center", md: "flex-end" }}
						mr={12}
						my={8}
					>
						<AddPhoto />
					</Box>
					<AlbumsPage />
				</Box>
			</Box>
		</Container>
	)
}
