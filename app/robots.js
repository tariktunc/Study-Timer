export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: "https://tariktunc.com/sitemap.xml",
  };
}
