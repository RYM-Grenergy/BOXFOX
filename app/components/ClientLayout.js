"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <AnnouncementBar />
            {children}
            <Footer />
        </>
    );
}
