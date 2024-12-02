import { Container, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"

const WrongRoute = () => {
	return (
		<>
			<Container
				h="100vh"
				alignItems="stretch"
				justifyContent="center"
				textAlign="center"
				maxW="sm"
				centerContent
			>
				<Text
					fontSize="8xl"
					color="ui.main"
					fontWeight="bold"
					lineHeight="1"
					mb={4}
				>
					404
				</Text>
				<Text fontSize="md">Oops!</Text>
				<Text fontSize="md">Page not found.</Text>
				{/* <Button
          as={Link}
          to="/"
          color="ui.main"
          borderColor="ui.main"
          variant="outline"
          mt={4}
        >
          Go back
        </Button> */}
				<Button>
					<Link to="/">Back to Home</Link>
				</Button>
			</Container>
		</>
	)
}

export default WrongRoute
