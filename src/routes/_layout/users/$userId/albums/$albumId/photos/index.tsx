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
import { z } from "zod"
import { getUserById } from "../.."
import {
	AlbumsService,
	AllAlbumPhotosService,
} from "../../../../../../../client"
import { CustomFooter } from "../../../../../../../components/common/CustomFooter"
import {
	BreadcrumbCurrentLink,
	BreadcrumbLink,
	BreadcrumbRoot,
} from "../../../../../../../components/ui/breadcrumb"
import { formatDate } from "../../../../../../../utils"
import { Route as PhotoDetail } from "./$photoId/index"

const albumPhotosSchema = z.object({
	page: z.number().catch(1),
})

export const Route = createFileRoute(
	"/_layout/users/$userId/albums/$albumId/photos/",
)({
	component: AlbumPhotos,
	validateSearch: (search) => albumPhotosSchema.parse(search),
	loader: async ({ params }) => {
		return { userId: params.userId, albumId: params.albumId }
	},
})

const photos_per_page = 8

export function getAlbumDetail({ albumId }: { albumId: string }) {
	return {
		queryFn: () => AlbumsService.getAlbum({ id: albumId }),
		queryKey: ["album", { albumId }],
	}
}

function getAlbumPhotos({
	userId,
	albumId,
	page,
}: {
	userId: string
	albumId: string
	page: number
}) {
	return {
		queryFn: () =>
			AllAlbumPhotosService.getAllAlbumPhotos({
				userId: userId,
				albumId: albumId,
				skip: (page - 1) * photos_per_page,
				limit: photos_per_page,
			}),
		queryKey: ["photos", { page, userId, albumId }],
	}
}

function AlbumPhotos() {
	const navigate = useNavigate({ from: Route.fullPath })
	const { userId } = Route.useParams()
	const { albumId } = Route.useParams()
	const { page } = Route.useSearch()
	const queryClient = useQueryClient()

	const setPage = (page: number) =>
		navigate({
			search: (prev: { [key: string]: string }) => ({ ...prev, page }),
		})
	const {
		data: photos,
		isPending,
		isPlaceholderData,
	} = useQuery({
		...getAlbumPhotos({ userId, albumId, page }),
	})
	const count = photos?.data.length

	const hasNextPage =
		!isPlaceholderData && photos?.data.length === photos_per_page

	const hasPreviousPage = page > 1
	const { data: user } = useQuery(getUserById({ userId }))

	useEffect(() => {
		if (hasNextPage) {
			queryClient.prefetchQuery(
				getAlbumPhotos({ userId, albumId, page: page + 1 }),
			)
		}
	}, [userId, albumId, page, queryClient, hasNextPage])

	const { data: album } = useQuery(getAlbumDetail({ albumId }))

	const userTitle = user?.username || "user"
	const albumTitle = album?.title || "album"

	return (
		<Container maxW={"100%"}>
			<Flex
				w="full"
				gap={8}
				p={6}
				mt={24}
				direction={"column"}
				minH={"100vh"}
				position={"relative"}
				alignItems={"center"}
				justifyContent={"center"}
			>
				<Box>
					<BreadcrumbRoot>
						<BreadcrumbLink href="/users">Dashboard</BreadcrumbLink>
						<BreadcrumbLink href={`/users/${userId}/albums?page=1`}>
							{userTitle}
						</BreadcrumbLink>
						<BreadcrumbCurrentLink>{albumTitle}</BreadcrumbCurrentLink>
					</BreadcrumbRoot>
				</Box>
				<Flex
					w="full"
					direction={{ base: "column-reverse", md: "row" }}
					alignItems={"center"}
					justifyContent={"space-between"}
				>
					<Box className="albumInfo">
						<Text className="" fontWeight={"bold"} fontSize={"3xl"}>
							{album?.title}({count})
						</Text>
						<VStack>
							<Text fontSize={"md"}>Last Updated At:</Text>
							<Text>
								({album?.updated_at ? formatDate(album.updated_at) : "N/A"}){" "}
							</Text>
						</VStack>
					</Box>
					<VStack alignSelf={"center"}>
						<Image
							src={user?.avatar || "empty"}
							alt="user-profile"
							w={24}
							h={24}
							rounded={"full"}
						/>
						<Box>
							<Text fontSize={"2xl"} fontWeight={"light"}>
								{user?.username}
							</Text>
						</Box>
					</VStack>
				</Flex>

				<Box
					w={"full"}
					alignItems={"center"}
					justifyContent={"center"}
					bg={"bg.panel"}
					textAlign={"center"}
				>
					<Text fontWeight={"bold"} fontSize={"5xl"}>
						Photos
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
							{photos?.data.map((photo) => (
								<GridItem
									key={photo.id}
									display={"flex"}
									w="full"
									flexDir={"column"}
									bg={"honeydew"}
								>
									<Link
										to={PhotoDetail.fullPath}
										className="w-full"
										params={{
											userId: photo.owner_id,
											albumId: photo.album_id,
											photoId: photo.id,
										}}
									>
										<Box
											w="full"
											h={96}
											position={"relative"}
											display={"flex"}
											bg={`url(${photo.image_url || "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2t8ZW58MHx8MHx8fDA%3D"})`}
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
												<Text fontSize={"2xl"} fontWeight={"semibold"}>
													{photo.photo_title}
												</Text>
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
	)
}
