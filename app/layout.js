import "./globals.css";

export const metadata = {
  title: {
    default: "Study Timeer",
    template: " %s | My Study Clock",
  },
  description: "Generated by lazy next app",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
