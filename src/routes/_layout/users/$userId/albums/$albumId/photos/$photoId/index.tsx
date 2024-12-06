import {
	Box,
	Container,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
	VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { getAlbumDetail } from ".."
import { getUserById } from "../../.."
import userAuth from "../../../../../../../../auth/user_auth"
import { AllAlbumPhotosService } from "../../../../../../../../client"
import EditPhoto from "../../../../../../../../components/photos/EditPhoto"
import {
	BreadcrumbCurrentLink,
	BreadcrumbLink,
	BreadcrumbRoot,
} from "../../../../../../../../components/ui/breadcrumb"
import { useColorModeValue } from "../../../../../../../../components/ui/color-mode"
import { formatDate } from "../../../../../../../../utils"

export const Route = createFileRoute(
	"/_layout/users/$userId/albums/$albumId/photos/$photoId/",
)({
	component: PhotoPage,
	loader: async ({ params }) => {
		return {
			userId: params.userId,
			albumId: params.albumId,
			photoId: params.photoId,
		}
	},
})

function getPhoto({
	userId,
	albumId,
	photoId,
}: {
	userId: string
	albumId: string
	photoId: string
}) {
	return {
		queryFn: () =>
			AllAlbumPhotosService.getPhotoId({
				userId: userId,
				albumId: albumId,
				id: photoId,
			}),
		queryKey: ["photo", { userId, albumId, photoId }],
	}
}

function PhotoPage() {
	const { userId, albumId, photoId } = Route.useParams()
	const { data: photo, isLoading } = useQuery(
		getPhoto({ userId, albumId, photoId }),
	)

	const { data: owner } = useQuery(getUserById({ userId }))
	const { data: album } = useQuery(getAlbumDetail({ albumId }))

	const { user } = userAuth()
	const userTitle = user?.username || "user"
	const albumTitle = album?.title || "album"
	const photoTitle = photo?.photo_title || "photo_title"
	const canManagePhoto = user?.is_superuser || album?.owner_id === user?.id
	return (
		<Container maxW={"full"}>
			<Flex w="100%" direction={"column"} mt={24} gap={8}>
				<Box>
					<BreadcrumbRoot>
						<BreadcrumbLink href="/users">Dashboard</BreadcrumbLink>
						<BreadcrumbLink href={`/users/${userId}/albums?page=1`}>
							{userTitle}
						</BreadcrumbLink>
						<BreadcrumbLink
							href={`/users/${userId}/albums/${albumId}/photos?page=1`}
						>
							{albumTitle}
						</BreadcrumbLink>
						<BreadcrumbCurrentLink>{photoTitle}</BreadcrumbCurrentLink>
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
							{album?.title}
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
							src={owner?.avatar || "empty"}
							alt="user-profile"
							w={24}
							h={24}
							rounded={"full"}
						/>
						<Box>
							<Text fontSize={"2xl"} fontWeight={"light"}>
								{owner?.username}
							</Text>
						</Box>
					</VStack>
				</Flex>

				<Flex w="full" direction={"column"} gap={4} mb={16}>
					<Box>
						{photo && canManagePhoto && (
							<EditPhoto
								userId={userId}
								albumId={albumId}
								photoId={photoId}
								photo={photo}
							/>
						)}
					</Box>
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
										<Box
											position={"absolute"}
											inset={0}
											bg={"black"}
											opacity={0.6}
										/>
										<Text
											fontSize={"2xl"}
											fontWeight={"semibold"}
											position={"relative"}
											color={useColorModeValue("#DAEAF7", "#DAEAF7")}
										>
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
	)
}
