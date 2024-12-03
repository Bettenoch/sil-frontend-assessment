import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { ColorModeButton } from "../../components/ui/color-mode"

export const Route = createFileRoute("/_layout/")({
	component: Home,
})

function Home() {
	return (
		<>

			<Container maxW="full">
				<Box pt={12} m={4}>
					<Text fontSize="2xl">Hi, there welcome to SIL STUDIO 👋🏼</Text>
					<Text>Welcome back, nice to see you again!</Text>
				</Box>
				<Box>
					<ColorModeButton />
				</Box>
			</Container>
		</>
	)
}
