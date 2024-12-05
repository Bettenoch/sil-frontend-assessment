import { IconButton } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { LuTrash2 } from "react-icons/lu"
import { CustomToast } from "../../Toast/CustomToast"
import { PhotosService } from "../../client"
import { Button } from "../ui/button"
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"

interface DeletePhotoProps {
	id: string
}

const DeletePhoto = ({ id }: DeletePhotoProps) => {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()
	const showToast = CustomToast()

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm()

	const deletePhoto = async (id: string) => {
		await PhotosService.deletePhoto({ id })
	}

	const mutation = useMutation({
		mutationFn: deletePhoto,
		onSuccess: () => {
			showToast("Success", "The photo was deleted successfully.", "success")
		},
		onError: () => {
			showToast(
				"An error occurred.",
				"An error occurred while deleting the photo.",
				"error",
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["photos"],
			})
		},
	})

	const onSubmit = async () => {
		mutation.mutate(id)
	}
	return (
		<>
			<DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
				<DialogTrigger asChild>
					<IconButton aria-label="Delete Photo">
						<LuTrash2 />
					</IconButton>
				</DialogTrigger>

				<DialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>DELETE PHOTO</DialogTitle>
					</DialogHeader>
					<DialogBody>
						Are you sure? You will not be able to undo this action
					</DialogBody>
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button disabled={isSubmitting} variant="outline">
								Cancel
							</Button>
						</DialogActionTrigger>
						<Button
							type={"submit"}
							loading={isSubmitting}
							disabled={isSubmitting}
						>
							Delete
						</Button>
					</DialogFooter>
					<DialogCloseTrigger />
				</DialogContent>
			</DialogRoot>
		</>
	)
}
