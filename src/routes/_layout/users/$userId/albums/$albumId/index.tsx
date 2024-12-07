import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/users/$userId/albums/$albumId/")(
	{
		component: RouteComponent,
	},
)

function RouteComponent() {
	return <div>Hello "/_layout/users/$userId/albums/$albumId/"!</div>
}
