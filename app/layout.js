import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";

export const metadata = {
  title: {
    default: "StudyTimer - Pomodoro Çalışma Zamanlayıcısı",
    template: "%s | StudyTimer",
  },
  description:
    "Pomodoro tekniği ile üretkenliğinizi artırın. Görev yönetimi, istatistikler ve özelleştirilebilir zamanlayıcı.",
  keywords: [
    "pomodoro",
    "study timer",
    "çalışma zamanlayıcısı",
    "productivity",
    "focus timer",
  ],
  icons: {
    icon: "/focusIcon.png",
  },
  openGraph: {
    title: "StudyTimer - Pomodoro Çalışma Zamanlayıcısı",
    description:
      "Pomodoro tekniği ile üretkenliğinizi artırın. Görev yönetimi, istatistikler ve özelleştirilebilir zamanlayıcı.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr" suppressHydrationWarning>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
