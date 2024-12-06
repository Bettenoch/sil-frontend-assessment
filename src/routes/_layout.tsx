import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute } from "@tanstack/react-router"

import Footer from "../components/common/Footer"
import Navbar from "../components/common/Navbar"

export const Route = createFileRoute("/_layout")({
	component: Layout,
})

function Layout() {
	return (
		<Flex maxW="large" direction={"column"} h="auto" position="relative">
			<Navbar />

			<Outlet />
			<Footer />
		</Flex>
	)
}
