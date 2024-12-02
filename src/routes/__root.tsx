//src/routes/__root.tsx
// src/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router"
import React, { Suspense, useEffect } from "react"

import { useRouter } from "@tanstack/react-router" // Import the router hook
import WrongRoute from "../components/common/WrongRoute"

const loadDevtools = () =>
	Promise.all([
		import("@tanstack/router-devtools"),
		import("@tanstack/react-query-devtools"),
	]).then(([routerDevtools, reactQueryDevtools]) => {
		return {
			default: () => (
				<>
					<routerDevtools.TanStackRouterDevtools />
					<reactQueryDevtools.ReactQueryDevtools />
				</>
			),
		}
	})

const TanStackDevtools =
	process.env.NODE_ENV === "production" ? () => null : React.lazy(loadDevtools)

export const Route = createRootRoute({
	component: () => {
		const router = useRouter()

		useEffect(() => {
			const unsubscribe = router.subscribe("onBeforeNavigate", () => {
				window.scrollTo(0, 0)
			})

			return () => unsubscribe()
		}, [router])

		return (
			<>
				<Outlet />
				<Suspense>
					<TanStackDevtools />
				</Suspense>
			</>
		)
	},
	notFoundComponent: () => <WrongRoute />,
})
