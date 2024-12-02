"use client"
import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import { system } from "../../theme"
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={system}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	)
}
