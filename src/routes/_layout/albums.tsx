import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/albums")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_layout/albums"!</div>
}
