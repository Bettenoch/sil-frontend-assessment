export const emailPattern = {
	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	message: "Invalid email address",
}
export const passwordRules = (isRequired = true) => {
	const rules: any = {
		minLength: {
			value: 8,
			message: "Password must be at least 8 characters",
		},
	}

	if (isRequired) {
		rules.required = "Password is required"
	}

	return rules
}

export const confirmPasswordRules = (
	getValues: () => any,
	isRequired = true,
) => {
	const rules: any = {
		validate: (value: string) => {
			const password = getValues().password || getValues().new_password
			return value === password ? true : "The passwords do not match"
		},
	}

	if (isRequired) {
		rules.required = "Password confirmation is required"
	}

	return rules
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	})
}
