import { Box, ListItem, ListRoot, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { LuAlbum, LuBookHeadphones, LuCamera, LuDatabase } from "react-icons/lu"
import { useColorModeValue } from "../ui/color-mode"

const navlist = [
	{ icon: LuBookHeadphones, title: "Home", path: "/" },
	{ icon: LuDatabase, title: "Dashboard", path: "/users" },
	{ icon: LuAlbum, title: "Albums", path: "/albums" },
	{ icon: LuCamera, title: "Photos", path: "/photos" },
]

const NavItems = () => {
	const bgActive = useColorModeValue("#B2FFFF", "#0093AF")
	const hoverBg = useColorModeValue("#9195A2", "#B2FFFF")
	const textHover = useColorModeValue("#D9F5F0", "#042749")
	const navItems = navlist.map(({ icon: IconType, title, path }) => (
		<ListItem
			w={"full"}
			key={title}
			_hover={{
				base: { bg: hoverBg, color: textHover },
				md: { borderBottom: "2px solid", bg: "none", color: textHover },
			}}
		>
			<Link
				to={path}
				activeProps={{
					style: {
						color: bgActive,
						fontWeight: "bold",
					},
				}}
			>
				<Text
					display={"flex"}
					p={{ base: "6", md: "0" }}
					fontSize={{ base: "2xl", md: "md" }}
					gap={2}
				>
					<Box as={"span"} alignSelf={"center"}>
						<IconType />
					</Box>
					{title}
				</Text>
			</Link>
		</ListItem>
	))
	return (
		<ListRoot
			display={"flex"}
			listStyle={"none"}
			alignItems={"center"}
			justifyContent={"center"}
			gap={{ base: 2, md: 6 }}
			flexDir={{ base: "column", md: "row" }}
		>
			{navItems}
		</ListRoot>
	)
}

export default NavItems
