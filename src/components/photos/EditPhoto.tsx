import { useEffect, useState } from "react";
import {
  PhotosService,
  PhotoUpdate,
  type ApiError,
  type PhotoPublic,
} from "../../client";
import { Button } from "../ui/button";
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
} from "../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomToast } from "../../Toast/CustomToast";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Input, Text } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { handleError } from "../../utils";

interface EditPhotoProps {
  
  userId: string
  albumId: string
  photoId: string
  photo: PhotoPublic
  
}

const EditPhoto = ({userId,albumId,photoId, photo }: EditPhotoProps) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();
  const showToast = CustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<PhotoUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: photo,
  });
  useEffect(() => {
    reset(photo);
  }, [photo, reset]);

  const mutation = useMutation({
    mutationFn: (data: PhotoUpdate) =>
      PhotosService.updatePhoto({ id: photo.id, requestBody: data }),
    onSuccess: (updatedPhoto: PhotoPublic) => {
        queryClient.setQueryData(["photo", { userId, albumId, photoId }], updatedPhoto);
        showToast("Success!", "Photo updated successfully.", "success");
        setOpen(false);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["photos"] });
        queryClient.refetchQueries({ queryKey: ["photo", { userId, albumId, photoId }] });
      },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },


  });


  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  const onSubmit: SubmitHandler<PhotoUpdate> = async (data) => {
    mutation.mutate(data);
  };
  const onCancel = () => {
    reset();
    toggleEditMode();
  };

  return (
    <>
      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Photo</Button>
        </DialogTrigger>

        <DialogContent  as="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>EDIT PHOTO</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Field
              label="Photo title"
              errorText={errors.photo_title?.message}
              invalid={!!errors.photo_title}
            >
              {editMode ? (
                <Input
                  id="photo_title"
                  minLength={3}
                  type="text"
                  placeholder="Photo title"
                  {...register("photo_title")}
                />
              ) : (
                <Text
                  fontSize="md"
                  py={2}
                  color={!photo?.photo_title ? "ui.dim" : "inherit"}
                >
                  {photo?.photo_title || "N/A"}
                </Text>
              )}
            </Field>
            <Field
              label="Image url"
              errorText={errors.image_url?.message}
              invalid={!!errors.image_url}
            >
              {editMode ? (
                <Input
                  id="image_url"
                  minLength={3}
                  type="text"
                  placeholder="image url"
        
                  {...register("image_url")}
                />
              ) : (
                <Text
                  fontSize="md"
                  py={2}
                  color={!photo?.image_url ? "ui.dim" : "inherit"}
                >
                  {photo?.image_url || "N/A"}
                </Text>
              )}
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                variant="outline"
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              onClick={toggleEditMode}
              type={editMode ? "button" : "submit"}
              loading={editMode ? isSubmitting : false}
              disabled={editMode ? !isDirty : false}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default EditPhoto;
