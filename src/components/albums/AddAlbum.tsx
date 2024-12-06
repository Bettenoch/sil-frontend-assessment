import { Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { CustomToast } from "../../Toast/CustomToast";
import { AlbumCreate, AlbumsService, type ApiError } from "../../client";
import { handleError } from "../../utils";
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
import { Field } from "../ui/field";

const CreateAlbum = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const showToast = CustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<AlbumCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      cover_photo: "https://images.unsplash.com/photo-1711314166194-ecd3887a26ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG9sZCUyMGJvb2tzfGVufDB8fDB8fHww",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AlbumCreate) =>
      AlbumsService.createAlbum({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Album created successfully.", "success");
      setOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.refetchQueries({
        queryKey: ["album", { userId }],
      });
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<AlbumCreate> = async (data) => {
    mutation.mutate(data);
  };
  const onCancel = () => {
    reset();
  };

  return (
    <>
      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline">ADD ALBUM</Button>
        </DialogTrigger>

        <DialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>CREATE ALBUM</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Field
              label="Photo title"
              errorText={errors.title?.message}
              invalid={!!errors.title}
            >
              <Input
                id="album_title"
                minLength={3}
                type="text"
                required
                placeholder="Album title"
                {...register("title", {
                  required: "Please include the album title",
                })}
              />
            </Field>
            <Field
              label="description"
              errorText={errors.description?.message}
              invalid={!!errors.description}
            >
              <Input
                id="Album description"
                minLength={3}
                type="text"
                placeholder="Album description"
                {...register("description")}
              />
            </Field>
            <Field
              label="cover_photo"
              errorText={errors.cover_photo?.message}
              invalid={!!errors.cover_photo}
            >
              <Input
                id="Album cover_photo"
                minLength={3}
                type="text"
                placeholder="Album cover_photo"
                {...register("cover_photo")}
              />
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
              type={"submit"}
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty}
            >
              Create
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default CreateAlbum;
