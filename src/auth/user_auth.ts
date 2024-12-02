import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { CustomToast } from "../Toast/CustomToast"
import { useState } from "react"
import { type Body_login_user_login_access_token as AccessToken, type ApiError, LoginService, type UserPublic, type UserRegister, UsersService } from "../client"
import { AxiosError } from "axios"

const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null
  }

const userAuth = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const showToast = CustomToast()
    const [error, setError] = useState<string | null>(null)

    const {data: user, isLoading} = useQuery<UserPublic | null, Error>({
        queryKey: ["currentUser"],
        queryFn: UsersService.getUser,
        enabled: isLoggedIn(),
    })
    

    const createAccount = useMutation({
        mutationFn: (data: UserRegister) => 
            UsersService.createAccount({requestBody: data}),

        onSuccess:() => {
            navigate({to: "/login"})
            showToast(
                "Sign up",
                "Your have signed up successfully",
                "success"
            )
        },
        onError: (error: ApiError) => {
            let errMessage = (error.body as any)?.detail

            if (error instanceof AxiosError) {
                errMessage = error.message
            }
            showToast("Something went wrong.", errMessage, "error")
        },

        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["users"]})
        }
    })
    const login = async(data: AccessToken) => {
        const res = await LoginService.userLoginAccessToken({
            formData: data,
        })
        localStorage.setItem("access_token", res.access_token)
    }
    const userLogin = useMutation({
        mutationFn:login,
        onSuccess: () => {
            navigate({to: "/"})
        },
        onError: (err: ApiError) => {
            let errMessage = (err.body as any)?.detail

            if (err instanceof AxiosError) {
                errMessage = err.message
            }

            if (Array.isArray(errMessage)) {
                errMessage = "Something went wrong"
              }
        
            setError(errMessage)
        }
       
    })
    const logout = () => {
        localStorage.removeItem("access_token")
        navigate({ to: "/login" })  
    }

    return {
        createAccount,
        userLogin,
        isLoading,
        user,
        error,
        logout,
        resetError: () => setError(null)
    }
}

export {isLoggedIn}
export default userAuth
