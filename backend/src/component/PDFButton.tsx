import React, { useEffect, useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { HiOutlinePrinter } from "react-icons/hi";
import MyDocument from "./MyDocument";

interface CartData {
    products: {
        productId: number;
        productName: string;
        price: number;
        quantity: number;
    }[];
    totalPrice: number;
}

interface PDFButtonProps {
    cartId: string;
}

const PDFButton: React.FC<PDFButtonProps> = ({ cartId }) => {
    const [data, setData] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwt-token");
            const email = localStorage.getItem("userEmail");

            if (!cartId) {
                setError(new Error("No cart ID provided"));
                setLoading(false);
                return;
            }
            if (!email) {
                setError(new Error("No email found in localStorage"));
                setLoading(false);
                return;
            }
            if (!token) {
                setError(new Error("No token found in localStorage"));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/public/users/${email}/carts/${cartId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Network response error: ${response.statusText}`);
                }

                const result: CartData = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cartId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error.message}</div>;
    if (!data) return <div style={{ color: "red" }}>No data available</div>;

    const styles: { btn: React.CSSProperties; hover: React.CSSProperties } = {
        btn: {
            borderRadius: "3px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 10px",
            fontSize: "12px",
            color: "#ffd700",
            fontWeight: 700,
            cursor: "pointer",
            userSelect: "none",
            backgroundColor: "transparent",
            textDecoration: "none",
            transition: "background-color 0.3s, color 0.3s",
        },
        hover: {
            backgroundColor: "#ffd70010",
            color: "#ffd700",
        },
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = styles.hover.backgroundColor!;
        e.currentTarget.style.color = styles.hover.color!;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = styles.btn.backgroundColor!;
        e.currentTarget.style.color = styles.btn.color!;
    };

    return (
        <BlobProvider document={<MyDocument data={data} />}>
            {({ url }) => (
                <a
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.btn}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <HiOutlinePrinter size={17} />
                    <span style={{ textDecoration: "none" }}>PRINT</span>
                </a>
            )}
        </BlobProvider>
    );
};

export default PDFButton;
