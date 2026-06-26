import {
    List,
    useRecordContext,
    Link,
    Datagrid,
    TextField,
    ImageField,
    NumberField,
    Create,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ImageInput,
    ReferenceInput,
    SelectInput,
    EditButton,
    DeleteButton,
    Filter,
} from "react-admin";
import { Link as RouterLink } from "react-router-dom";

// ---- Custom Image Field ----
const CustomImageField = ({ source }: { source: string }) => {
    const record = useRecordContext();
    if (!record || !record[source]) {
        return <span>No Image</span>;
    }

    return (
        <RouterLink to={`/products/${record.productId}/update-image`}>
            <img
                src={record[source]}
                alt="Product"
                style={{ width: "100px", height: "auto", borderRadius: "6px" }}
            />
        </RouterLink>
    );
};

// ---- Filters ----
const ProductFilters = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="search" alwaysOn />
        <ReferenceInput label="Category" source="categoryId" reference="categories" allowEmpty>
            <SelectInput optionText="categoryName" />
        </ReferenceInput>
    </Filter>
);

// ---- LIST ----
export const ProductList = () => (
    <List filters={<ProductFilters />} >
        <Datagrid rowClick={false}>
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="category.categoryName" label="Category Name" />
            <CustomImageField source="image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount (%)" />
            <NumberField source="specialPrice" label="Special Price" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// ---- CREATE ----
export const ProductCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput
                source="productName"
                label="Product Name"
                helperText="(At least 3 characters)"
            />
            <TextInput
                source="description"
                label="Description"
                helperText="(At least 6 characters)"
            />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount (%)" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput
                source="categoryId"
                reference="categories"
                label="Category"
            >
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

// ---- EDIT ----
export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" disabled />
            <ReferenceInput
                source="categoryId"
                reference="categories"
                label="Category"
            >
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
            <TextInput source="productName" />
            <TextInput source="description" />
            <NumberInput source="quantity" />
            <NumberInput source="price" />
            <NumberInput source="discount" />
            <NumberInput source="specialPrice" />
            <ImageField source="image" label="Current Image" />
        </SimpleForm>
    </Edit>
);
