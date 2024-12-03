
import userAuth from "../auth/user_auth";
import { UserRegister } from "../client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../components/ui/field";
import { Button } from "../components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PasswordInput } from "../components/ui/password-input";
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
} from "../components/ui/dialog";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { confirmPasswordRules, emailPattern } from "../utils";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

const userAvatars = [
  "/images/profiles/avatar1.png",
  "/images/profiles/avatar2.png",
  "/images/profiles/avatar3.png",
  "/images/profiles/avatar4.png",
  "/images/profiles/avatar5.png",
  "/images/profiles/avatar6.png",
  "/images/profiles/avatar7.png",
  "/images/profiles/avatar8.png",
  "/images/profiles/avatar9.png",
  "/images/profiles/avatar10.png",
];

interface CreateAccountProp extends UserRegister {
  confirm_password: string;
}

function SignUpPage() {
  const { createAccount } = userAuth();
  const { open, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountProp>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      avatar: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<CreateAccountProp> = (data) => {
    createAccount.mutate(data);
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setValue("avatar", avatarUrl);
    onClose();
  };
  return (
    <>
      <Container maxW={"100%"}>
        <Box
          maxW={"full"}
          display={"flex"}
          w="full"
          minH={"100vh"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <VStack gap={6} align={"stretch"} mt={16}>
            <Text fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              CREATE ACCOUNT
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={4}>
                <Field
                  label="Name"
                  errorText={errors.name?.message}
                  invalid={!!errors.name}
                >
                  <Input
                    id="full name"
                    minLength={3}
                    type="text"
                    placeholder="Full Name"
                    required
                    {...register("name", {
                      required: "Please enter your full name",
                    })}
                  />
                  {errors.name && <small>{errors.name.message}</small>}
                </Field>
                <Field
                  label="Username"
                  errorText={errors.username?.message}
                  invalid={!!errors.name}
                >
                  <Input
                    id="user_name"
                    minLength={3}
                    type="text"
                    placeholder="Username"
                    required
                    {...register("username", {
                      required: "Please enter your username",
                    })}
                  />
                </Field>
                <Field
                  label="Email"
                  id="email"
                  errorText={errors.username?.message}
                  invalid={!!errors.email}
                >
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    required
                    {...register("email", {
                      required: "Email is required",
                      pattern: emailPattern,
                    })}
                  />
                </Field>
                <Field
                  label="Avatar"
                  errorText={errors.avatar?.message}
                  invalid={!!errors.avatar}
                >
                  <Flex alignItems="center">
                    <Image
                      boxSize="50px"
                      borderRadius="full"
                      src={
                        getValues("avatar") ||
                        "/images/profiles/dummyUserDark.svg"
                      }
                      alt="Selected Avatar"
                      mr={4}
                    />
                    <Button onClick={onOpen}>Choose Avatar</Button>
                  </Flex>
                </Field>
                <Field
                  label="Password"
                  errorText={errors.password?.message}
                  invalid={!!errors.password}
                >
                  <PasswordInput
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                </Field>
                <Field id="confirm_password" errorText={errors.confirm_password?.message} invalid={!!errors.confirm_password}>
                    <PasswordInput
                    id="confirm_password"
                    placeholder="Repeat Password"
                    required
                    {
                    ...register("confirm_password", confirmPasswordRules(getValues))
                    }
                    />

                </Field>
                <Button type="submit" colorScheme={"blue"} width={"full"} loading={isSubmitting}>
                        Signup
                </Button>
                <Text mb={12}>
                  Already have an account? {" "}
                  <Link to={"/login"} className="teal-200">
                  Log In
                  </Link>

                </Text>
              </Stack>
            </form>
          </VStack>
        </Box>
      </Container>
      <DialogRoot open={open}  size={"md"}>
        <DialogTrigger asChild>
          <Button variant="outline" size={"md"}>
            Choose Avatar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avatars</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Grid templateColumns={{base:"repeat(2, 1fr)", sm:"repeat(3, 1fr)", lg:"repeat(4, 1fr)"}} gap={4}>
              {userAvatars.map((avatar, index) => (
                <GridItem
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <Image
                    boxSize={{base:"70px", sm:"70p", md:"100px"}}
                    objectFit="cover"
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    cursor="pointer"
                    rounded={"full"}
                  />
                </GridItem>
              ))}
            </Grid>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogActionTrigger>
            <Button onClick={onClose}>Save</Button>
          </DialogFooter>
          <DialogCloseTrigger onClick={onClose}/>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
