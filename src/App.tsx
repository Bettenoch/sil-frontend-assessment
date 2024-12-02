import React from "react"
import "./App.css"
import { Box, Container, Heading } from "@chakra-ui/react"
import { ColorModeButton } from "./components/ui/color-mode"

function App() {
	return (
		<>
			<Container maxW={"100%"}>
				<Box>
					<Heading colorPalette={"brand"}>WELCOME HOME</Heading>
				</Box>
				<Box>
					<ColorModeButton />
				</Box>
			</Container>
		</>
	)
}

export default App
