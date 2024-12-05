import { Link } from "@tanstack/react-router"
// src/components/common/Breadcrumb.tsx
import type React from "react"
import {
	BreadcrumbCurrentLink,
	BreadcrumbLink,
	BreadcrumbRoot,
} from "../ui/breadcrumb"

interface BreadcrumbItem {
	label: string
	href?: string
}

interface ReusableBreadcrumbProps {
	items: BreadcrumbItem[]
}

const Breadcrumb: React.FC<ReusableBreadcrumbProps> = ({ items }) => {
	return (
		<BreadcrumbRoot>
			{items.map((item, index) =>
				item.href ? (
					<BreadcrumbLink as={Link} key={index} href={item.href}>
						{item.label}
					</BreadcrumbLink>
				) : (
					<BreadcrumbCurrentLink key={index}>
						{item.label}
					</BreadcrumbCurrentLink>
				),
			)}
		</BreadcrumbRoot>
	)
}

export default Breadcrumb
