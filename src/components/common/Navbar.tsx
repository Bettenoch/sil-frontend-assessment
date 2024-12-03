import { Box, Button, Flex, IconButton, Image, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { LuMenu } from "react-icons/lu"
import userAuth, { isLoggedIn } from "../../auth/user_auth"
import {
	ColorModeButton,
	useColorModeValue,
} from "../../components/ui/color-mode"
import {
	DrawerActionTrigger,
	DrawerBackdrop,
	DrawerBody,
	DrawerCloseTrigger,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerRoot,
	DrawerTitle,
	DrawerTrigger,
} from "../../components/ui/drawer"
import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
} from "../../components/ui/menu"
import NavItems from "./NavItems"

const Navbar = () => {
	const [open, setOpen] = useState(false)
	const { user, logout } = userAuth()
	const handleLogout = () => logout()
	const bgActive = useColorModeValue("#8A85BC", "#0093AF")
	const bgColor = useColorModeValue("#293241", "#E0FBFC")
	const textColor = useColorModeValue("#FFFFFF", "#181C14")
	return (
		<Flex as="nav" direction="column">
			{/* Mobile View*/}
			<Flex
				top={0}
				left={0}
				bg={bgColor}
				color={textColor}
				align={"center"}
				zIndex={"50"}
				w="100%"
				display={{ base: "flex", md: "none" }}
				position={"fixed"}
			>
				<Flex w="100% " justify={"space-between"} p={4}>
					<Text fontSize={"2xl"} fontWeight={"extrabold"}>
						SIL STUDIO
					</Text>
					<ColorModeButton
						color={textColor}
						_hover={{ bg: "none", color: bgActive }}
					/>

					<DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
						<DrawerBackdrop />
						<DrawerTrigger asChild>
							<IconButton
								bg={"none"}
								_hover={{ color: bgActive }}
								color={textColor}
								aria-label="Open Menu"
								variant="outline"
								size={"lg"}
							>
								<LuMenu />
							</IconButton>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Drawer Title</DrawerTitle>
							</DrawerHeader>
							<DrawerBody>
								<NavItems />
							</DrawerBody>
							<DrawerFooter display={"flex"} flexDirection={"column"}>
								{user?.avatar ? (
									<Image
										src={user.avatar}
										alt="Profile"
										rounded={"full"}
										w={20}
										h={20}
									/>
								) : (
									<Image
										src={useColorModeValue(
											"/images/profiles/dummyUserLight.svg",
											"/images/profiles/dummyUserDark.svg",
										)}
										alt="avatar"
										w="10"
										h="10"
									/>
								)}

								<DrawerActionTrigger asChild>
									<Button onClick={handleLogout}>
										<Text color={"fg.error"}>Log Out</Text>
									</Button>
								</DrawerActionTrigger>
							</DrawerFooter>
							<DrawerCloseTrigger />
						</DrawerContent>
					</DrawerRoot>
				</Flex>
			</Flex>
			<Box
				w={"100%"}
				zIndex={"50"}
				bg={bgColor}
				color={textColor}
				display={{ base: "none", md: "flex" }}
				top={0}
				position={"fixed"}
			>
				<Flex w="100%" p={4} justify={"space-between"}>
					<Box>
						<Text fontSize={"2xl"} fontWeight={"extrabold"}>
							SIL STUDIO
						</Text>
					</Box>
					<NavItems />
					<Box display={"flex"} alignItems={"center"} gap={4}>
						<ColorModeButton
							color={textColor}
							_hover={{ bg: "none", color: bgActive }}
						/>

						{isLoggedIn() ? (
							<MenuRoot>
								<MenuTrigger asChild>
									{user?.avatar ? (
										<Image
											src={user.avatar}
											alt="Profile"
											rounded={"full"}
											w={10}
											h={10}
										/>
									) : (
										<Image
											src={useColorModeValue(
												"/images/profiles/dummyUserLight.svg",
												"/images/profiles/dummyUserDark.svg",
											)}
											alt="avatar"
											w="10"
											h="10"
										/>
									)}
								</MenuTrigger>
								<MenuContent>
									<MenuItem value="Settings">User Settings</MenuItem>
									<MenuItem
										color="fg.error"
										_hover={{ bg: "bg.error", color: "fg.error" }}
										onClick={handleLogout}
										value="Log Out"
									>
										Log Out
									</MenuItem>
								</MenuContent>
							</MenuRoot>
						) : (
							<Link to={"/login"}>
								<Text>Log In</Text>
							</Link>
						)}
					</Box>
				</Flex>
			</Box>
		</Flex>
	)
}

export default Navbar
