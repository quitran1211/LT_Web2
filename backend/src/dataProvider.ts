import axios from "axios";
import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from "react-admin";

const apiUrl = "http://localhost:8080/api";

// -----------------------------
// ✅ HTTP Client wrapper
// -----------------------------
const httpClient = {
    get: async (url: string) => {
        const token = localStorage.getItem("jwt-token");
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return { json: response.data };
        } catch (error) {
            console.error("❌ API GET failed:", error);
            throw error;
        }
    },

    post: async (url: string, data: any) => {
        const token = localStorage.getItem("jwt-token");
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return { json: response.data };
        } catch (error) {
            console.error("❌ API POST failed:", error);
            throw error;
        }
    },

    put: async (url: string, data: any) => {
        const token = localStorage.getItem("jwt-token");
        try {
            const response = await axios.put(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return { json: response.data };
        } catch (error) {
            console.error("❌ API PUT failed:", error);
            throw error;
        }
    },

    delete: async (url: string) => {
        const token = localStorage.getItem("jwt-token");
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            return { json: response.data };
        } catch (error) {
            console.error("❌ API DELETE failed:", error);
            throw error;
        }
    },
};

// -----------------------------
// ✅ React-Admin Data Provider
// -----------------------------
export const dataProvider: DataProvider = {
    // 🟢 GET LIST
    getList: (resource: string, { pagination = {}, sort = {}, filter = {} }) => {
        const { page = 0, perPage = 10 } = pagination;
        const { field = "id", order = "ASC" } = sort;

        const idFieldMapping: { [key: string]: string } = {
            products: "productId",
            categories: "categoryId",
            carts: "cartId",
            users: "userId", // 🔹 dùng userId làm id
        };
        const idField = idFieldMapping[resource] || "id";

        const query: any = {
            pageNumber: page.toString(),
            pageSize: perPage.toString(),
            sortBy: field,
            sortOrder: order,
            ...filter,
        };

        let url: string;

        if (resource === "products" && filter.categoryId && filter.search) {
            const categoryId = filter.categoryId;
            const keyword = filter.search;
            delete query.categoryId;
            delete query.search;
            url = `${apiUrl}/public/categories/${categoryId}/products?search=${encodeURIComponent(
                keyword
            )}&${new URLSearchParams(query).toString()}`;
        } else if (resource === "products" && filter.categoryId) {
            const categoryId = filter.categoryId;
            delete query.categoryId;
            url = `${apiUrl}/public/categories/${categoryId}/products?${new URLSearchParams(
                query
            ).toString()}`;
        } else if (filter.search) {
            const keyword = filter.search;
            delete query.search;
            url = `${apiUrl}/public/${resource}?search=${encodeURIComponent(
                keyword
            )}&${new URLSearchParams(query).toString()}`;
        } else if (resource === "carts") {
            url = `${apiUrl}/admin/carts?${new URLSearchParams(query).toString()}`;
        } else if (resource === "users") {
            url = `${apiUrl}/admin/users?${new URLSearchParams(query).toString()}`;
        } else {
            url = `${apiUrl}/public/${resource}?${new URLSearchParams(query).toString()}`;
        }
        console.log(`🔹 [getList] Resource: ${resource}`);
        console.log("🔹 Request URL:", url);
        console.log("🔹 Query params:", query);


        return httpClient
            .get(url)
            .then(({ json }) => {
                console.log(`🔹 [getList] Raw JSON for ${resource}:`, json);

                const items: any[] = Array.isArray(json.content) ? json.content : [];
                const data = items.map((item: any) => {
                    if (resource === "users") {
                        return {
                            id: item.userId, // 🔹 map userId -> id cho React Admin
                            ...item,
                        };
                    }
                    const baseUrl = "http://localhost:8080/api/public/products/image/";
                    return {
                        id: item[idField],
                        ...item,
                        image: item.image ? `${baseUrl}${item.image}` : null,
                    };
                });
                return {
                    data,
                    total: typeof json.totalElements === "number" ? json.totalElements : data.length,
                };
            })
            .catch((error) => {
                console.error("Error in getList:", error);
                return { data: [], total: 0 };
            });
    },



    // 🟢 GET ONE
    getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
        console.log("getOne called for resource:", resource, "with params:", params);

        let url: string;

        if (resource === "carts") {
            const email = params.meta?.email || localStorage.getItem("userEmail");
            if (!email) throw new Error("Missing valid email for cart request");
            console.log("📦 Fetching cart:", { email, id: params.id });
            url = `${apiUrl}/public/users/${email}/carts/${params.id}`;
        } else {
            url = `${apiUrl}/public/${resource}/${params.id}`;
        }

        const result = await httpClient.get(url);
        console.log("API Response:", result.json);

        const idFieldMapping: { [key: string]: string } = {
            products: "productId",
            categories: "categoryId",
            carts: "cartId",
        };
        const idField = idFieldMapping[resource] || "id";
        const baseUrl = "http://localhost:8080/api/public/products/image/";

        let data;
        if (resource === "carts") {
            const products = (result.json.products || []).map((product: any) => ({
                id: product.productId,
                productId: product.productId,
                productName: product.productName,
                image: product.image ? `${baseUrl}${product.image}` : null,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                discount: product.discount,
                specialPrice: product.specialPrice,
                category: product.category
                    ? {
                        categoryId: product.category.categoryId,
                        categoryName: product.category.categoryName,
                    }
                    : null,
            }));

            data = {
                id: result.json[idField],
                cartId: result.json[idField],
                totalPrice: result.json.totalPrice,
                products,
            };
        } else {
            data = { id: result.json[idField], ...result.json };
        }

        return { data };
    },

    // 🟢 CREATE
    create: async (resource, params: CreateParams): Promise<CreateResult> => {
        try {
            let url: string;
            if (resource === "products") {
                url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}`;
                delete params.data.categoryId;
                params.data.image = "default.png";
            } else {
                url = `${apiUrl}/admin/${resource}`;
            }

            const { json } = await httpClient.post(url, params.data);

            const idFieldMapping: Record<string, string> = {
                products: "productId",
                categories: "categoryId",
            };
            const idField = idFieldMapping[resource] || "id";

            return { data: { id: json[idField] || json.id, ...json } };
        } catch (error) {
            console.error("❌ Error creating resource:", error);
            throw error;
        }
    },

    // 🟢 UPDATE
    update: async (resource, params: UpdateParams): Promise<UpdateResult> => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        const { json } = await httpClient.put(url, params.data);
        return { data: { id: params.id, ...json } };
    },

    // 🟢 DELETE
    delete: async (resource, params: DeleteParams): Promise<DeleteResult> => {
        const url = `${apiUrl}/admin/${resource}/${params.id}`;
        await httpClient.delete(url);
        return { data: params.previousData };
    },

    // 🟢 DELETE MANY
    deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> => {
        const { ids } = params;
        await Promise.all(ids.map((id) => httpClient.delete(`${apiUrl}/admin/${resource}/${id}`)));
        return { data: ids };
    },

    // 🟡 CHƯA DÙNG
    getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
        const ids = params.ids.join(",");
        const url = `${apiUrl}/public/${resource}?ids=${ids}`;
        const { json } = await httpClient.get(url);

        const idFieldMapping: Record<string, string> = {
            products: "productId",
            categories: "categoryId",
        };
        const idField = idFieldMapping[resource] || "id";

        const data = json.content.map((item: any) => ({
            id: item[idField],
            ...item,
        }));

        return { data };
    },

    getManyReference: async <RecordType extends RaRecord = any>(
        resource: string,
        params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> => {
        throw new Error("getManyReference not implemented.");
    },

    updateMany: async <RecordType extends RaRecord = any>(
        resource: string,
        params: UpdateManyParams
    ): Promise<UpdateManyResult<RecordType>> => {
        throw new Error("updateMany not implemented.");
    },
};
