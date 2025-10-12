import Logo from "./images/logo/logo.svg";

export const MAIN_LOGO = {
  LOGO: Logo,
} as const;

export const MAIN_LOGO_META = {
  LOGO: {
    width: 32,
    height: 32,
    alt: "Tailflow Logo",
  },
} as const;
