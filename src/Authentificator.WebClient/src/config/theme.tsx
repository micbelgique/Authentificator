import { LinkProps } from "@mui/material/Link"
import { createTheme } from "@mui/material/styles"
import { forwardRef } from "react"
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom"

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>(function LinkTransition(props, ref) {
  const { href, ...other } = props
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />
})

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})

export default theme
