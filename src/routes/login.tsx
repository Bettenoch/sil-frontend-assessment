import { Box, Container, Input, Stack, Text, VStack } from "@chakra-ui/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { CustomToast } from "../Toast/CustomToast"
import userAuth, { isLoggedIn } from "../auth/user_auth"
import type { Body_login_user_login_access_token as AccessToken } from "../client"
import { Button } from "../components/ui/button"
import { Field } from "../components/ui/field"
import { PasswordInput } from "../components/ui/password-input"

export const Route = createFileRoute("/login")({
	component: UserLogin,
	beforeLoad: async () => {
		if (isLoggedIn()) {
			throw redirect({
				to: "/",
			})
		}
	},
})

function UserLogin() {
	const { userLogin, error, resetError } = userAuth()
	const toast = CustomToast()
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<AccessToken>({
		mode: "onBlur",
		criteriaMode: "all",
		defaultValues: {
			username: "",
			password: "",
		},
	})

	const onSubmit: SubmitHandler<AccessToken> = async (data) => {
		if (isSubmitting) return
		resetError()

		try {
			await userLogin.mutateAsync(data)
			toast("Login successful", "Welcome back!", "success")
		} catch {
			// Error is handled in userAuth
			toast("Login failed", "Something went wrong. Please try again.", "error")
		}
	}

	return (
		<Container maxW="sm" py="8">
			<VStack gap="6" align="stretch">
				<Text fontSize="2xl" fontWeight="bold" textAlign="center">
					Login
				</Text>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack gap="4">
						<Field
							label="Username"
							errorText={errors.username?.message}
							invalid={!!errors.username}
						>
							<Input
								type="Email"
								placeholder="Email"
								required
								{...register("username", { required: "Username is required" })}
							/>
						</Field>
						<Field
							label="Password"
							errorText={errors.password?.message}
							invalid={!!errors.password}
						>
							<PasswordInput
								placeholder="Enter your password"
								{...register("password", { required: "Password is required" })}
							/>
						</Field>
						<Button
							type="submit"
							colorScheme="blue"
							loading={isSubmitting}
							width={"full"}
						>
							Login
						</Button>
					</Stack>
				</form>
				{error && (
					<Box color="red.500" textAlign="center">
						{error}
					</Box>
				)}
			</VStack>
		</Container>
	)
}

export default UserLogin
