"use client";
import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import styles from "./header.module.scss";

export default function Navbar({ settingTask }) {
  return (
    <nav className={styles.navbar} role="navigation" aria-label="Ana navigasyon">
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo} aria-label="StudyTimer Ana Sayfa">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>StudyTimer</span>
        </Link>

        <div className={styles.navActions}>
          <Link href="/report" className={styles.navBtn} aria-label="Rapor sayfası">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Rapor</span>
          </Link>

          <button
            onClick={settingTask}
            className={styles.navBtn}
            aria-label="Ayarları aç"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>Ayarlar</span>
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className={styles.navBtn} aria-label="Giriş yap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Giriş</span>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 32, height: 32 },
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
