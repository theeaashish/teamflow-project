import Logo from "./images/logo/logo.svg";
import HeroScreenShot from "./images/hero-app/app-screenshot.png";

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

export const HERO_APP_SCREENSHOT = {
  HERO_SCREENSHOT: HeroScreenShot,
} as const;

export const HERO_APP_SCREENSHOT_META = {
  HERO_SCREENSHOT: {
    width: 1200,
    height: 800,
    alt: "Tailflow Hero App Screenshot",
  },
} as const;
