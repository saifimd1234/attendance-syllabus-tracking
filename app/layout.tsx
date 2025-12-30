import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { BackgroundBeams } from "@/components/BackgroundBeams";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Attendance System",
    description: "Modern Student Attendance Management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <BackgroundBeams />
                <Navbar />
                <main className="sm:pl-20 pb-20 sm:pb-4 min-h-screen relative z-10 overflow-x-hidden">
                    {children}
                </main>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
