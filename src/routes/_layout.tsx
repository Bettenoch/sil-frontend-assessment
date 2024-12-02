import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout")({
	component: Layout,
})

function Layout() {
	return (
		<Flex maxW="large" h="auto" position="relative">
			<Outlet />
		</Flex>
	)
}
