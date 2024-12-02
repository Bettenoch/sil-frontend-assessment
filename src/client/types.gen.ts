// This file is auto-generated by @hey-api/openapi-ts

export type AlbumCreate = {
	title?: string
	description?: string | null
	cover_photo?: string | null
}

export type AlbumPublic = {
	title?: string
	description?: string | null
	cover_photo?: string | null
	id: string
	owner_id: string
	created_at: string
	updated_at: string
}

export type AlbumsPublic = {
	data: Array<AlbumPublic>
	count: number
}

export type AlbumUpdate = {
	title?: string | null
	description?: string | null
	cover_photo?: string | null
}

export type Body_login_user_login_access_token = {
	grant_type?: string | null
	username: string
	password: string
	scope?: string
	client_id?: string | null
	client_secret?: string | null
}

export type HTTPValidationError = {
	detail?: Array<ValidationError>
}

export type Message = {
	message: string
}

export type PhotoCreate = {
	photo_title?: string
	image_url?: string
}

export type PhotoPublic = {
	photo_title?: string
	image_url?: string
	id: string
	album_id: string
	owner_id: string
	created_at: string
	updated_at: string
}

export type PhotosPublic = {
	data: Array<PhotoPublic>
	count: number
}

export type PhotoUpdate = {
	photo_title?: string | null
	image_url?: string | null
}

export type Token = {
	access_token: string
	token_type?: string
}

export type UpdatePassword = {
	initial_password: string
	new_password: string
}

export type UserCreate = {
	name?: string
	username?: string
	email: string
	is_superuser?: boolean
	is_active?: boolean
	avatar?: string | null
	password: string
}

export type UserPublic = {
	name?: string
	username?: string
	email: string
	is_superuser?: boolean
	is_active?: boolean
	avatar?: string | null
	id: string
}

export type UserRegister = {
	email: string
	password: string
	name?: string
	username?: string
	avatar?: string | null
}

export type UsersPublic = {
	data: Array<UserPublic>
	count: number
}

export type UserUpdate = {
	name?: string
	username?: string
	email?: string | null
	is_superuser?: boolean
	is_active?: boolean
	avatar?: string | null
	password?: string | null
}

export type UserUpdateMe = {
	name?: string | null
	username?: string | null
	email: string | null
}

export type ValidationError = {
	loc: Array<string | number>
	msg: string
	type: string
}

export type GetAllAlbumPhotosData = {
	albumId: string
	limit?: number
	skip?: number
}

export type GetAllAlbumPhotosResponse = PhotosPublic

export type GetAlbumsData = {
	limit?: number
	skip?: number
}

export type GetAlbumsResponse = AlbumsPublic

export type CreateAlbumData = {
	requestBody: AlbumCreate
}

export type CreateAlbumResponse = AlbumPublic

export type GetAlbumData = {
	id: string
}

export type GetAlbumResponse = AlbumPublic

export type UpdateAlbumData = {
	id: string
	requestBody: AlbumUpdate
}

export type UpdateAlbumResponse = AlbumPublic

export type DeleteAlbumData = {
	id: string
}

export type DeleteAlbumResponse = Message

export type HealthCheckResponse = boolean

export type UserLoginAccessTokenData = {
	formData: Body_login_user_login_access_token
}

export type UserLoginAccessTokenResponse = Token

export type TestTokenResponse = UserPublic

export type CreatePhotoData = {
	albumId: string
	requestBody: PhotoCreate
}

export type CreatePhotoResponse = PhotoPublic

export type GetAllPhotosInAnAlbumData = {
	albumId: string
	limit?: number
	skip?: number
}

export type GetAllPhotosInAnAlbumResponse = PhotosPublic

export type GetPhotoData = {
	id: string
}

export type GetPhotoResponse = PhotoPublic

export type UpdatePhotoData = {
	id: string
	requestBody: PhotoUpdate
}

export type UpdatePhotoResponse = PhotoPublic

export type DeletePhotoData = {
	id: string
}

export type DeletePhotoResponse = Message

export type GetAllUserAlbumsData = {
	limit?: number
	skip?: number
	userId: string
}

export type GetAllUserAlbumsResponse = AlbumsPublic

export type GetAllUsersData = {
	limit?: number
	skip?: number
}

export type GetAllUsersResponse = UsersPublic

export type CreateUserData = {
	requestBody: UserCreate
}

export type CreateUserResponse = UserPublic

export type CreateAccountData = {
	requestBody: UserRegister
}

export type CreateAccountResponse = UserPublic

export type UpdateUserDetailsData = {
	requestBody: UserUpdateMe
}

export type UpdateUserDetailsResponse = UserPublic

export type UpdateUserPrivilegeData = {
	requestBody: UserUpdate
	userId: string
}

export type UpdateUserPrivilegeResponse = UserPublic

export type GetUserByIdData = {
	userId: string
}

export type GetUserByIdResponse = UserPublic

export type DeleteUserPrivilegeData = {
	userId: string
}

export type DeleteUserPrivilegeResponse = Message

export type UpdateUserPasswordData = {
	requestBody: UpdatePassword
}

export type UpdateUserPasswordResponse = Message

export type GetUserResponse = UserPublic

export type DeleteUserResponse = Message