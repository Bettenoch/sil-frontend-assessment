import { Box, Grid, Input, Text, VStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { CustomToast } from "../../Toast/CustomToast";
import {
  type ApiError,
  CreatePhotoData,
  PhotosService,
  UserAlbumsService,
} from "../../client";
import { handleError } from "../../utils";
import { Button } from "../ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog";
import userAuth from "../../auth/user_auth";
import { Field } from "../ui/field";

function getUserAlbums({ userId }: { userId: string }) {
  return {
    queryFn: () =>
      UserAlbumsService.getAllUserAlbums({
        userId: userId,
      }),
    queryKey: ["user_albums", { userId }],
  };
}

const AddPhoto = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = userAuth();
  const [open, setOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const showToast = CustomToast();
  const userId = user?.id || "";

  const { data: albums } = useQuery(getUserAlbums({ userId }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<CreatePhotoData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      requestBody: {
        photo_title: "",
        image_url: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePhotoData) =>
      PhotosService.createPhoto({ ...data, albumId: selectedAlbumId! }),
    onSuccess: () => {
      showToast("Success!", "Photo created successfully.", "success");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
    onError: (err: ApiError) => {
      handleError(err, showToast("Error", "Something went wrong. Please try again.", "error"));
    },
  });

  const onSubmit = (data: CreatePhotoData) => {
    if (!selectedAlbumId) {
      showToast("Error", "Please select an album.", "error");
      return;
    }
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Photo</Button>
        </DialogTrigger>

        <DialogContent
          ref={contentRef}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>CREATE PHOTO</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack align="start" gap="4" width="100%">
              <Field label={"Album"} invalid={!!errors.albumId} required display={"flex"} flexDir={"column"} w="full" alignItems={"center"} justifyContent={"center"}>
               
                <Grid maxH={48} overflowY={"auto"} w={"full"} templateColumns={{base:"repeat(2, 1fr)", sm:"repeat(2, 1fr)", md:"repeat(3, 1fr)"}} gap="4">
                  {albums?.data.map((album: any) => (
                    <Box
                      key={album.id}
                      p="2"
                      borderWidth="1px"
                      borderRadius="md"
                      cursor="pointer"
                      bg={selectedAlbumId === album.id ? "blue.100" : "white"}
                      onClick={() => setSelectedAlbumId(album.id)}
                    >
                      <Text fontSize="sm" textAlign="center">
                        {album.title}
                      </Text>
                    </Box>
                  ))}
                </Grid>
                {errors.albumId && (
                  <Text color="red.500" fontSize="sm" mt="2">
                    {errors.albumId.message}
                  </Text>
                )}
              </Field>

              <Field w="full" label="Photo Title" errorText={errors.requestBody?.photo_title?.message}  invalid={!!errors.requestBody?.photo_title}>
                
                <Input
                  id="photo_title"
                  minLength={3}
                  type="text"
                  required 
                  placeholder="Photo title"
                  {...register("requestBody.photo_title", {
                    required: "please add a photo title"
                  })}
                />
               
              </Field>

              <Field w="full" label="image_url" errorText={errors.requestBody?.image_url?.message} invalid={!!errors.requestBody?.image_url}>
                
                <Input
                  id="image_url"
                  type="text"
                  required
                  placeholder="Image URL"
                  {...register("requestBody.image_url", {
                    required: "Please add a photo image url "
                  })}
                />
             
              </Field>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button onClick={onCancel} disabled={isSubmitting} variant="outline">
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || !isDirty || !selectedAlbumId}
            >
              Create Photo
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default AddPhoto;
