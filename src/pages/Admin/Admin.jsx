// Admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../../components/Firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Mahanta_group");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dlsbj8nug/image/upload",
    data
  );

  return res.data.secure_url;
};

const sidebarItems = ["Dashboard", "Products", "Orders", "Categories", "Users", "Settings"];

const metricCards = [
  { label: "Active Products", value: "864", hint: "Across all categories" },
  { label: "Open Orders", value: "214", hint: "Awaiting fulfillment" },
  { label: "Today\u2019s Revenue", value: "$4,920", hint: "Live store total" },
];

const orderRows = [
  { id: "#98234", customer: "Ariana Dell", total: "$124.00", status: "Paid" },
  { id: "#98215", customer: "Michael Lee", total: "$89.00", status: "Pending" },
  { id: "#98198", customer: "Sofia Park", total: "$212.00", status: "Shipped" },
];

const statusBadgeClasses = (status) => {
  switch (status) {
    case "In Stock":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Low Stock":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Shipped":
      return "bg-sky-50 text-sky-700 border-sky-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

const Admin = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProducts(list);
  };

  const loadCategories = async () => {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCategories(list);
  };

  const loadUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);
    } catch {
      console.log("Note: Users collection may not exist yet or error fetching users");
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      loadProducts();
      loadUsers();
      loadCategories();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm font-medium tracking-wide text-[#811331] uppercase">
          {activeItem}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-slate-600">
          Store status:{" "}
          <span className="font-semibold text-slate-900">Operational</span>
        </span>
      </div>
    </header>
  );

  const renderMetricCards = () => (
    <section className="grid gap-5 md:grid-cols-3 mb-10">
      {metricCards.map((card) => (
        <article
          key={card.label}
          className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-150"
        >
          <div className="p-5">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
              {card.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {card.hint}
            </p>
          </div>
          <div className="h-1.5 w-full rounded-b-xl bg-gradient-to-r from-[#811331] via-rose-400 to-amber-300" />
        </article>
      ))}
    </section>
  );

  const renderProductsTable = () => (
    <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Products in your Firestore catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#811331] text-white text-xs font-medium shadow-sm hover:bg-[#650f27]"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-sm hover:bg-slate-800"
          >
            Bulk Import
          </button>
          <span className="px-3 py-1 rounded-full bg-[#811331]/5 text-xs font-medium text-[#811331]">
            {products.length} items
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/60">
            <tr className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Suitable For</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 text-slate-900 font-medium">
                  {row.name}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {row.category || "-"}
                </td>
                <td className="px-5 py-3 text-slate-900">
                  ₹{Number(row.price || 0).toFixed(2)}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {row.suitable_for || "-"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadgeClasses(
                      row.stock_status || "In Stock"
                    )}`}
                  >
                    {row.stock_status || "In Stock"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(row)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(row.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-xs text-slate-500"
                >
                  No products yet. Click &quot;Add Product&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderOrdersTable = () => (
    <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest customer orders from your store
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-50 text-xs font-medium text-slate-600">
          Auto-refreshed
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/60">
            <tr className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orderRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {row.id}
                </td>
                <td className="px-5 py-3 text-slate-600">{row.customer}</td>
                <td className="px-5 py-3 text-slate-900">{row.total}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadgeClasses(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderUsersTable = () => (
    <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Users</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All registered users in the system
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#811331]/5 text-xs font-medium text-[#811331]">
          {users.length} users
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/60">
            <tr className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 text-slate-900 font-medium">
                  {user.displayName || user.name || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {user.email || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {user.phone || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {user.address || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600 text-xs">
                  {user.createdAt 
                    ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString()
                    : "-"
                  }
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-100">
                    Active
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-xs text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderMainContent = () => {
    switch (activeItem) {
      case "Products":
        return (
          <>
            {renderMetricCards()}
            {renderProductsTable()}
          </>
        );
      case "Orders":
        return (
          <>
            {renderMetricCards()}
            {renderOrdersTable()}
          </>
        );
      case "Categories":
        return (
          <>
            {renderMetricCards()}
            <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage homepage collections</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#811331] text-white text-xs font-medium shadow-sm hover:bg-[#650f27]"
                  >
                    Add Category
                  </button>
                  <span className="px-3 py-1 rounded-full bg-[#811331]/5 text-xs font-medium text-[#811331]">
                    {categories.length} items
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat.id} className="relative rounded-2xl overflow-hidden border border-slate-100">
                    <img src={cat.image} alt={cat.title} className="w-full h-48 object-cover" />
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">{cat.subtitle}</p>
                        <p className="text-sm font-semibold text-slate-900">{cat.title}</p>
                      </div>
                      <button
                        onClick={async () => {
                          await deleteDoc(doc(db, "categories", cat.id));
                          setCategories(prev => prev.filter(c => c.id !== cat.id));
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full px-5 py-6 text-center text-xs text-slate-500">
                    No categories yet.
                  </div>
                )}
              </div>
            </section>
          </>
        );
      case "Users":
        return (
          <>
            {renderMetricCards()}
            {renderUsersTable()}
          </>
        );
      case "Settings":
        return (
          <>
            {renderMetricCards()}
            <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-1.5">Homepage Content</h2>
              <p className="text-xs text-slate-500 mb-4">Update hero text and video URL (Firestore: content/home)</p>
              <HomeContentForm />
            </section>
          </>
        );
      default:
        return (
          <>
            {renderMetricCards()}
            <div className="grid gap-6 lg:grid-cols-2">
              {renderProductsTable()}
              {renderOrdersTable()}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-100 bg-white/80 backdrop-blur-sm flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#811331] text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Admin
              </p>
              <p className="text-xs text-slate-500">Store Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item === activeItem;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveItem(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#811331]/10 text-[#811331]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#811331]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-medium text-slate-700">Session</p>
          <p>Changes are saved automatically</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
        {renderHeader()}
        {renderMainContent()}
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Add New Product
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in the details and upload images for this product.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5">
              <ProductForm
                onSuccess={async () => {
                  setIsProductModalOpen(false);
                  await loadProducts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Bulk Import</h2>
                <p className="text-xs text-slate-500">Upload CSV with product rows</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5">
              <BulkImportForm
                onSuccess={async () => {
                  setIsBulkModalOpen(false);
                  await loadProducts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Edit Product
                </h2>
                <p className="text-xs text-slate-500">
                  Update product details and save changes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5">
              <EditProductForm
                product={editingProduct}
                onSuccess={async () => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                  await loadProducts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Add Category</h2>
                <p className="text-xs text-slate-500">Shown on homepage</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5">
              <CategoryForm
                onSuccess={async () => {
                  setIsCategoryModalOpen(false);
                  await loadCategories();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {activeItem === "Settings" && (
        <div className="fixed inset-0 z-40 pointer-events-none" />
      )}
    </div>
  );
};

export const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      discount: 0,
      how_to_use: "",
      ingredients: "",
      net_quantity: "",
      original_price: 0,
      price: 0,
      rating: 0,
      stock_status: "In Stock",
      suitable_for: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Cleansers", "Serums", "Moisturizers", "Treatments", "Sunscreen", "Eye Care"];

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      const files = values.images?.[0] ? Array.from(values.images) : [];
      const uploadUrls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploadUrls.push(url);
      }

      const docData = {
        name: values.name,
        category: values.category,
        description: values.description,
        discount: Number(values.discount) || 0,
        how_to_use: values.how_to_use,
        images: uploadUrls,
        image: uploadUrls[0] || "",
        ingredients: values.ingredients,
        net_quantity: values.net_quantity,
        original_price: Number(values.original_price) || 0,
        price: Number(values.price) || 0,
        rating: Number(values.rating) || 0,
        stock_status: values.stock_status,
        suitable_for: values.suitable_for,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "products"), docData);
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Name</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="e.g. Vitamin C Radiance Serum"
            {...register("name", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm appearance-none bg-white"
            {...register("category", { required: true })}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</label>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm min-h-[100px]"
          placeholder="Describe the product benefits and key features..."
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Original Price (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="0.00"
            {...register("original_price")}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sale Price (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="0.00"
            {...register("price", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Suitable For</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="e.g. All Skin Types"
            {...register("suitable_for")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Images</label>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#811331] transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#811331]/10 file:text-[#811331] cursor-pointer"
            {...register("images")}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {formState.isSubmitted && !loading && !error && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in slide-in-from-right-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Product Created Successfully
          </span>
        )}
        {error && (
          <span className="text-xs font-bold text-red-600">
            Error: {error}
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl bg-[#811331] text-white text-sm font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#650f27] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </span>
          ) : "Publish Product"}
        </button>
      </div>
    </form>
  );
};

const EditProductForm = ({ product, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      description: product?.description || "",
      original_price: product?.original_price || 0,
      price: product?.price || 0,
      suitable_for: product?.suitable_for || "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Cleansers", "Serums", "Moisturizers", "Treatments", "Sunscreen", "Eye Care"];

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        original_price: product.original_price || 0,
        price: product.price || 0,
        suitable_for: product.suitable_for || "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (values) => {
    if (!product?.id) return;
    setError("");
    setLoading(true);
    try {
      let uploadUrls = product.images || [];
      const files = values.images?.[0] ? Array.from(values.images) : [];
      if (files.length > 0) {
        uploadUrls = [];
        for (const file of files) {
          const url = await uploadToCloudinary(file);
          uploadUrls.push(url);
        }
      }

      const updateData = {
        name: values.name,
        category: values.category,
        description: values.description,
        original_price: Number(values.original_price) || 0,
        price: Number(values.price) || 0,
        suitable_for: values.suitable_for,
        images: uploadUrls,
        image: uploadUrls[0] || product.image || "",
      };

      await updateDoc(doc(db, "products", product.id), updateData);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Product Name</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="e.g. Vitamin C Radiance Serum"
            {...register("name", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Category</label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm appearance-none bg-white"
            {...register("category", { required: true })}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</label>
        <textarea
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm min-h-[100px]"
          placeholder="Describe the product benefits..."
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Original Price (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="0.00"
            {...register("original_price")}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sale Price (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="0.00"
            {...register("price", { required: true })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Suitable For</label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#811331] focus:ring-1 focus:ring-[#811331] outline-none transition-all text-sm"
            placeholder="e.g. Oily Skin"
            {...register("suitable_for")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Update Images (Optional)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#811331] transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#811331]/10 file:text-[#811331] cursor-pointer"
          {...register("images")}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {error && (
          <span className="text-xs font-bold text-red-600">
            {error}
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl bg-[#811331] text-white text-sm font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#650f27] transition-all disabled:opacity-60"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default Admin;

const BulkImportForm = ({ onSuccess }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categories = ["Cleansers", "Serums", "Moisturizers", "Treatments", "Sunscreen", "Eye Care"];

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const row = {};
      headers.forEach((h, idx) => row[h] = cols[idx] || "");
      rows.push(row);
    }
    return rows;
  };

  const guessCategory = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("wash")) return "Cleansers";
    if (n.includes("serum")) return "Serums";
    if (n.includes("moist")) return "Moisturizers";
    if (n.includes("sunscreen") || n.includes("spf")) return "Sunscreen";
    if (n.includes("cream")) return "Treatments";
    return "Treatments";
  };

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      const file = values.csv?.[0];
      if (!file) {
        setError("CSV required");
        setLoading(false);
        return;
      }
      const text = await file.text();
      const rows = parseCsv(text);
      for (const r of rows) {
        const name = r["product name"] || r["name"] || "";
        if (!name) continue;
        const docData = {
          name,
          category: values.defaultCategory || guessCategory(name),
          description: r["variant / type"] || "",
          net_quantity: r["net qty"] || "",
          original_price: Number(r["mrp (₹)"] || r["mrp"] || r["mrp (rs)"] || 0),
          price: Number(r["rate (₹)"] || r["rate"] || r["rate actual"] || 0),
          suitable_for: "",
          rating: 4.5,
          images: [],
          image: "",
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "products"), docData);
      }
      if (onSuccess) onSuccess();
    } catch {
      setError("Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">CSV File</label>
        <input
          type="file"
          accept=".csv,text/csv"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          {...register("csv")}
        />
        <p className="text-[10px] text-slate-500">Headers: Product Name, Variant / Type, Net Qty, Rate, MRP</p>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Default Category</label>
        <select
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          {...register("defaultCategory")}
        >
          <option value="">Auto</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {error && <span className="text-xs font-bold text-red-600">{error}</span>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </div>
    </form>
  );
};

const CategoryForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: "", subtitle: "", order: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      let imageUrl = "";
      const file = values.image?.[0];
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }
      const docData = {
        title: values.title,
        subtitle: values.subtitle,
        image: imageUrl,
        order: Number(values.order) || 0,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "categories"), docData);
      reset();
      if (onSuccess) onSuccess();
    } catch {
      setError("Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("title", { required: true })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Subtitle</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("subtitle")} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Order</label>
          <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("order")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Image</label>
          <input type="file" accept="image/*" className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("image")} />
        </div>
      </div>
      {error && <span className="text-xs font-bold text-red-600">{error}</span>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#811331] text-white text-sm font-bold hover:bg-[#650f27] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Category"}
        </button>
      </div>
    </form>
  );
};

const HomeContentForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, "content", "home");
        // Attempt to read specific doc
        const specific = await (await import("firebase/firestore")).getDoc(ref);
        if (specific.exists()) {
          reset(specific.data());
        }
      } catch {
        // ignore
      }
    };
    load();
  }, [reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    setSaved(false);
    try {
      const ref = doc(db, "content", "home");
      await setDoc(ref, values, { merge: true });
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Preloader Text</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("preloader_text")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Tag Text</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("tag_text")} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Headline (Line 1)</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("headline_line1")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Highlight</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("headline_highlight")} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Subline</label>
        <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("subline")} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">CTA Primary</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("cta_primary")} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">CTA Secondary</label>
          <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("cta_secondary")} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Hero Video URL</label>
        <input placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200" {...register("hero_video_url")} />
      </div>
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-xs font-bold text-emerald-600">Saved</span>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#811331] text-white text-sm font-bold hover:bg-[#650f27] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Content"}
        </button>
      </div>
    </form>
  );
};



