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
import { AllPhotosService } from "../../client"

export const Route = createFileRoute("/_layout/")({
	component: Home,
})

export function getAllPhotos() {
	return {
		queryFn: () =>
			AllPhotosService.getAllPhotos({
				limit: 10,
			}),
		queryKey: ["photos"],
	}
}

export const homeList = [
	{
		id: 1,
		name: "Quality",
		descp: "Quality pictures for you",
		image:
			"https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
	},
	{
		id: 2,
		name: "Aesthetic",
		descp: "Quality pictures for you",
		image:
			"https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
	},
	{
		id: 3,
		name: "Talent",
		descp: "Quality pictures for you",
		image:
			"https://plus.unsplash.com/premium_photo-1669584523537-bcad5027a07f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
	},
	{
		id: 4,
		name: "Art",
		descp: "Quality pictures for you",
		image:
			"https://images.unsplash.com/photo-1618367588411-d9a90fefa881?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
	},
]

function Home() {
	const { data: photos, isLoading } = useQuery(getAllPhotos())

	const photosGrid = Array.from({ length: 4 }, (_, i) =>
		photos?.data.filter((_, index) => index % 4 === i),
	)
	return (
		<>
			<Container maxW="full" m={0} p={0}>
				<VStack
					minH={"100vh"}
					w="full"
					textAlign={"center"}
					alignItems={"center"}
					justifyContent={"center"}
					bgImage={"url(/images/home/darkBg.jpg)"}
					backgroundPosition={"center"}
					backgroundSize={"cover"}
					backgroundRepeat={"no-repeat"}
				>
					<Flex mt={24} p={6} w="full" direction={"column"}>
						<Text
							fontSize={{ base: "3xl", sm: "5xl", md: "7xl" }}
							fontWeight={"extrabold"}
						>
							Your next gen photo STUDIO{" "}
						</Text>
						<Text fontSize={"md"}>Hello 👋🏼</Text>
					</Flex>

					<Box
						p={6}
						display={"flex"}
						flexDirection={"column"}
						w="full"
						textAlign={"center"}
						justifyContent={"center"}
						alignItems={"center"}
					>
						<Text fontSize={"2xl"} fontWeight={"light"}>
							The internet&apos;s source for visuals. Powered by creators
							everywhere.
						</Text>
						<Box maxW={"lg"} mt={12} fontSize={"sm"}>
							<Text>
								Our app offers a seamless way to create, organize, and share
								beautiful photo albums. Whether it&apos;s a wedding, family
								reunion, vacation, or any special event, we empower you to
								transform your photos into stunning, professional-looking
								albums.
							</Text>
						</Box>
					</Box>
				</VStack>
				<Flex w="full" direction={"column"}>
					<Grid
						mt={16}
						p={6}
						w="full"
						templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
					>
						{homeList.map((item, index) => {
							return (
								<GridItem
									key={index}
									bg={`url(${item.image})`}
									backgroundPosition={"center"}
									backgroundSize={"cover"}
									backgroundRepeat={"no-repeat"}
									display={"flex"}
									h={48}
									alignItems={"center"}
									justifyContent={"center"}
								>
									<Box>
										<Text>{item.name}</Text>
									</Box>
								</GridItem>
							)
						})}
					</Grid>
				</Flex>

				<Flex w="full" direction={"column"}>
					<VStack
						gap={4}
						w="full"
						alignItems={"center"}
						justifyContent={"center"}
					>
						<Text fontSize={"2xl"} fontWeight={"bold"}>
							Designers Favourite studio
						</Text>

						<Text fontSize={"normal"} maxW="md">
							Your memories deserve more than a gallery—they deserve a
							masterpiece. Create stunning albums and preserve your precious
							moments effortlessly.
						</Text>
					</VStack>
					{isLoading ? (
						<Grid>
							<GridItem>
								<Text>Loading Photos....</Text>
							</GridItem>
						</Grid>
					) : (
						<Grid
							p={6}
							templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
							gap={4}
						>
							{photosGrid.map((column, colIndex) => (
								<GridItem key={colIndex}>
									<Grid gap={4}>
										{column?.map((image, imgIndex) => (
											<Box key={imgIndex} overflow={"hidden"}>
												<Image
													src={image.image_url}
													alt={`Masonry image ${imgIndex + 1}`}
													rounded="lg"
													transition="transform 0.3s ease"
													_hover={{
														transform: "scale(1.05)",
													}}
													w="100%"
													h="auto"
												/>
											</Box>
										))}
									</Grid>
								</GridItem>
							))}
						</Grid>
					)}
				</Flex>
			</Container>
		</>
	)
}
