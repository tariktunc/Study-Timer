import Link from "next/link";
import "./globals.css";
import Head from "next/head";

export const metadata = {
  title: {
    default: "Pomodoro Clock",
    template: " %s | My Pomodoro Clock",
  },
  description: "Generated by create next app",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}