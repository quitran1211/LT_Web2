// User.tsx
import React from "react";
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    ArrayField,
    SingleFieldList,
    ChipField,
    DeleteButton,
} from "react-admin";

// ==========================
// 🔹 User List (xem + xóa)
// ==========================
export const UserList = () => (
    <List>
        <Datagrid rowClick={false}> {/* Không cần click show */}
            <TextField source="id" label="ID" /> {/* 🔹 dùng id, dataProvider đã map userId -> id */}
            <TextField source="firstName" label="First Name" />
            <TextField source="lastName" label="Last Name" />
            <EmailField source="email" label="Email" />
            <TextField source="mobileNumber" label="Mobile" />
            <ArrayField source="roles" label="Roles">
                <SingleFieldList>
                    <ChipField source="roleName" /> {/* hoặc source="role" nếu backend trả string */}
                </SingleFieldList>
            </ArrayField>
            <DeleteButton /> {/* Nút xóa */}
        </Datagrid>
    </List>
);
