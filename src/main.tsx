import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import React from "react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { routeTree } from "./routeTree.gen"

import { OpenAPI } from "./client/index.ts"
import { Provider } from "./components/ui/provider.tsx"

OpenAPI.BASE = "https://sil-backend-assessment-wwkj.onrender.com"
OpenAPI.TOKEN = async () => {
	return localStorage.getItem("access_token") || ""
}
const queryClient = new QueryClient()
const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</Provider>
	</StrictMode>,
)
