import nextPWA from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

const withNextIntl = createNextIntlPlugin("./i18n.ts");

export default withNextIntl(
  withPWA({
    reactStrictMode: true,
    typedRoutes: true
  })
);
