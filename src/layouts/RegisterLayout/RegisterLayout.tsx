import React from "react";
import RegisterHeader from "../../components/RegisterHeader.tsx";
import Footer from "../../components/Footer";

interface Props {
    children?: React.ReactNode;
}

export default function RegisterLayout({ children }: Props) {
    return (
        <div>
            <RegisterHeader />
            {children}
            <Footer />
        </div>
    );
}
