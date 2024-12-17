import BackButton from "../../components/BackButton"
import React from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <BackButton></BackButton>
            {children}
        </>
    );
}
