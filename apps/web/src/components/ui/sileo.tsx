"use client"
import { useTheme } from "next-themes"
import { Toaster as Sileo, type SileoOptions, type SileoPosition } from "sileo"

export interface SileoToasterProps {
  position?: SileoPosition
  offset?: number | string | Record<string, number | string>
  defaultOptions?: SileoOptions
}
function SileoToaster({
  position = "top-right",
  offset = 16,
  defaultOptions }: SileoToasterProps) {
  const { theme = "system" } = useTheme()

    const fillColor =
    theme === "dark"
      ? "#111827"
      : theme === "light"
      ? "#fff"
      : undefined


  return (
    <Sileo
      position={position}
      offset={offset}
      // className="toaster group"
      options={{
        fill: fillColor,
        styles: {
          title: "var(--popover)",
          description: "var(--popover-foreground)",
          badge: "var(--popover-foreground)",
          button: "var(--popover-foreground)",

        },
        ...defaultOptions
      }}
    />
  )
}

export { SileoToaster }

