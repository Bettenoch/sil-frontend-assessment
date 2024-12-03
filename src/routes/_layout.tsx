import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Toaster } from "../components/ui/toaster"

export const Route = createFileRoute("/_layout")({
	component: Layout,
})

function Layout() {
	return (
		<Flex maxW="large" h="auto" position="relative">
			<Toaster />
			<Outlet />
		</Flex>
	)
}
