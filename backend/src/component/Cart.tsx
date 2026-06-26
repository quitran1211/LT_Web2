import React from 'react';
import {
    List, useNotify, useRefresh, useRecordContext,
    ReferenceField, TextField, Show, SimpleShowLayout,
    NumberField, ArrayField, ImageField, Datagrid
} from 'react-admin';
import PDFButton from './PDFButton';

// Custom PDF button, đảm bảo có cartId
const CustomPDFButton = () => {
    const record = useRecordContext();
    if (!record) return <span>Loading...</span>;

    const cartId = record.cartId;
    if (!cartId) return <span style={{ color: "red" }}>No cart ID</span>;

    return <PDFButton cartId={record.cartId} />;
};

export const CartList = () => {
    return (
        <List>
            <Datagrid
                rowClick={(id, resource, record) => {
                    console.log("🧾 Cart record:", record);

                    const email = localStorage.getItem("userEmail");
                    const cartId = record.id || record.cartId; // dùng cartId nếu id không có

                    if (cartId && email) {
                        localStorage.setItem("globalCartId", String(cartId));
                        console.log("✅ Saved cart & email:", { cartId, email });
                    } else {
                        console.error("❌ Thiếu cartId hoặc email hợp lệ:", { cartId, email });
                    }

                    return "show"; // luôn trả về string cho rowClick
                }}
            >
                <TextField source="cartId" label="Cart ID" />
                <TextField source="totalPrice" label="Total Price" />
            </Datagrid>
        </List>
    );
};

export const CartShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();

    const onError = (error: { message: any }) => {
        notify(`Could not load cart: ${error.message}`, { type: 'error' });
        refresh();
    };

    const email = localStorage.getItem("userEmail");
    if (!email) return <span style={{ color: "red" }}>Error: Email is required</span>;

    return (
        <Show
            queryOptions={{
                meta: { email },
                onError,
            }}
        >
            <SimpleShowLayout>
                <CustomPDFButton />
                <TextField source="cartId" label="Cart ID" />
                <NumberField source="totalPrice" label="Total Price" />
                <ArrayField source="products" label="Products">
                    <Datagrid>
                        <TextField source="productId" label="Product ID" />
                        <TextField source="productName" label="Product Name" />
                        <ImageField source="image" label="Image" />
                        <TextField source="description" label="Description" />
                        <NumberField source="quantity" label="Quantity" />
                        <NumberField source="price" label="Price" />
                        <NumberField source="discount" label="Discount" />
                        <NumberField source="specialPrice" label="Special Price" />
                        <ReferenceField
                            source="category.categoryId"
                            reference="categories"
                            label="Category"
                        >
                            <TextField source="categoryName" />
                        </ReferenceField>
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};
