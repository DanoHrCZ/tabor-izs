import Navbar from "../../components/BackButton"

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
