import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import NoSSR from "@/app/utils/NoSSR";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Flow UI",
    description: "Flow UI",
};

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>
    );
}
