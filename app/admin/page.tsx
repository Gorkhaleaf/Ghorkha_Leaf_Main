'use client'

import React, { useEffect, useState, ChangeEvent } from "react";

type Product = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  mainImage?: string;
};

type Blog = {
  id: number;
  title: string;
  description: string;
  image?: string;
  slug: string;
  date?: string;
  readTime?: string;
  content?: string;
};

export default function AdminPage() {
  const [section, setSection] = useState<"products" | "blogs" | "add">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Blogs state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [savingBlogId, setSavingBlogId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProducts();
    loadBlogs();
  }, []);

  function loadProducts() {
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error("Failed to load products", err);
        setProducts([]);
      });
  }

  function loadBlogs() {
    fetch("/api/admin/blogs")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setBlogs(data || []))
      .catch((err) => {
        console.error("Failed to load blogs", err);
        setBlogs([]);
      });
  }

  function updateLocalProduct(idx: number, updates: Partial<Product>) {
    setProducts((p) => {
      const copy = [...p];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  }

  async function uploadImage(file: File) {
    if (!file) throw new Error("no file");
    const reader = new FileReader();
    const dataURL: string = await new Promise((res, rej) => {
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const resp = await fetch("/api/admin/products/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        dataUrl: dataURL,
      }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      throw new Error(json?.error || "upload failed");
    }
    return json.path as string;
  }

  async function saveProduct(idx: number) {
    const prod = products[idx];
    if (!prod) return;
    setSavingId(prod.id);
    try {
      const resp = await fetch("/api/admin/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prod.id, updates: prod }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        console.error("Save failed", json);
        alert("Save failed: " + (json.error || JSON.stringify(json)));
        return;
      }
      if (json?.id) {
        updateLocalProduct(idx, json);
        alert("Product saved.");
      } else {
        console.error("Save returned unexpected response", json);
        alert("Save returned unexpected response");
      }
    } catch (err) {
      console.error("Save error", err);
      alert("Save error: " + String(err));
    } finally {
      setSavingId(null);
    }
  }

  // Blog helpers
  function updateLocalBlog(idx: number, updates: Partial<Blog>) {
    setBlogs((b) => {
      const copy = [...b];
      copy[idx] = { ...copy[idx], ...updates };
      return copy;
    });
  }

  async function saveBlog(idx: number) {
    const blog = blogs[idx];
    if (!blog) return;
    setSavingBlogId(blog.id);
    try {
      const resp = await fetch("/api/admin/blogs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blog.id, updates: blog }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        console.error("Blog save failed", json);
        alert("Blog save failed: " + (json.error || JSON.stringify(json)));
        return;
      }
      if (json?.id) {
        updateLocalBlog(idx, json);
        alert("Blog saved.");
      } else {
        console.error("Save returned unexpected response", json);
        alert("Save returned unexpected response");
      }
    } catch (err) {
      console.error("Blog save error", err);
      alert("Blog save error: " + String(err));
    } finally {
      setSavingBlogId(null);
    }
  }

  // Delete blog
  async function deleteBlog(id: number, idx: number) {
    if (typeof id === "undefined" || id === null) return;
    if (!confirm("Delete this blog?")) return;
    setSavingBlogId(id);
    try {
      const resp = await fetch("/api/admin/blogs/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const contentType = resp.headers.get("content-type") || "";
        let json: any = null;
        if (contentType.includes("application/json")) {
          try {
            json = await resp.json();
          } catch (e) {
            json = { error: "Invalid JSON response" };
          }
        } else {
          const text = await resp.text();
          json = { error: text };
        }

        if (!resp.ok) {
          console.error("Delete failed", json);
          const errMsg = json?.error || (typeof json === "object" ? JSON.stringify(json) : String(json));
          alert("Delete failed: " + errMsg);
          return;
        }
      setBlogs((b) => {
        const copy = [...b];
        copy.splice(idx, 1);
        return copy;
      });
      alert("Blog deleted.");
    } catch (err) {
      console.error("Delete error", err);
      alert("Delete error: " + String(err));
    } finally {
      setSavingBlogId(null);
    }
  }

  async function createBlog(newBlog: Partial<Blog>) {
    setCreating(true);
    try {
      const resp = await fetch("/api/admin/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog: newBlog }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        console.error("Create failed", json);
        alert("Create failed: " + (json.error || JSON.stringify(json)));
        return;
      }
      if (json?.id) {
        setBlogs((b) => [json, ...b]);
        alert("Blog created.");
        setSection("blogs");
      } else {
        console.error("Create returned unexpected response", json);
        alert("Create returned unexpected response");
      }
    } catch (err) {
      console.error("Create error", err);
      alert("Create error: " + String(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>

      <div className="flex gap-6">
        <aside className="w-56 border rounded p-4 space-y-3">
          <button
            className={`w-full text-left px-3 py-2 rounded ${section === "products" ? "bg-slate-100" : ""}`}
            onClick={() => setSection("products")}
          >
            Products
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded ${section === "blogs" ? "bg-slate-100" : ""}`}
            onClick={() => setSection("blogs")}
          >
            Blogs
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded ${section === "add" ? "bg-slate-100" : ""}`}
            onClick={() => setSection("add")}
          >
            + Add New Blog
          </button>
        </aside>

        <section className="flex-1">
          {section === "products" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Edit Products</h2>
              {products.length === 0 && <p>No products loaded.</p>}
              <div className="space-y-6">
                {products.map((product, idx) => (
                  <div key={product.id} className="p-4 border rounded">
                    <div className="flex gap-6">
                      <div style={{ width: 160 }}>
                        <img
                          src={product.image || product.mainImage || "/Products/placeholder.png"}
                          alt={product.name}
                          style={{ width: "100%", objectFit: "contain" }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                          value={product.name || ""}
                          onChange={(e) => updateLocalProduct(idx, { name: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                        />

                        <label className="block text-sm font-medium">Price</label>
                        <input
                          type="number"
                          value={product.price ?? 0}
                          onChange={(e) => updateLocalProduct(idx, { price: Number(e.target.value) })}
                          className="w-40 p-2 border rounded mb-2"
                        />

                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                          value={product.description || ""}
                          onChange={(e) => updateLocalProduct(idx, { description: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                          rows={3}
                        />

                        <div className="flex items-center gap-3 mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              try {
                                setLoading(true);
                                const path = await uploadImage(f);
                                updateLocalProduct(idx, { image: path, mainImage: path });
                              } catch (err) {
                                alert("Upload failed: " + String(err));
                              } finally {
                                setLoading(false);
                              }
                            }}
                          />
                          <button
                            onClick={() => saveProduct(idx)}
                            disabled={savingId === product.id}
                            className="px-3 py-1 bg-slate-800 text-white rounded"
                          >
                            {savingId === product.id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "blogs" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Edit Blogs</h2>
              {blogs.length === 0 && <p>No blogs loaded.</p>}
              <div className="space-y-6">
                {blogs.map((blog, idx) => (
                  <div key={blog.id} className="p-4 border rounded">
                    <div className="flex gap-6">
                      <div style={{ width: 160 }}>
                        <img
                          src={blog.image || "/blog-post-1.png"}
                          alt={blog.title}
                          style={{ width: "100%", objectFit: "cover" }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                          value={blog.title || ""}
                          onChange={(e) => updateLocalBlog(idx, { title: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                        />

                        <label className="block text-sm font-medium">Slug</label>
                        <input
                          value={blog.slug || ""}
                          onChange={(e) => updateLocalBlog(idx, { slug: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                        />

                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                          value={blog.description || ""}
                          onChange={(e) => updateLocalBlog(idx, { description: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                          rows={3}
                        />

                        <label className="block text-sm font-medium">Content (HTML)</label>
                        <textarea
                          value={blog.content || ""}
                          onChange={(e) => updateLocalBlog(idx, { content: e.target.value })}
                          className="w-full p-2 border rounded mb-2"
                          rows={6}
                        />

                        <div className="flex items-center gap-3 mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              try {
                                setLoading(true);
                                const path = await uploadImage(f);
                                updateLocalBlog(idx, { image: path });
                              } catch (err) {
                                alert("Upload failed: " + String(err));
                              } finally {
                                setLoading(false);
                              }
                            }}
                          />
                          <button
                            onClick={() => saveBlog(idx)}
                            disabled={savingBlogId === blog.id}
                            className="px-3 py-1 bg-slate-800 text-white rounded"
                          >
                            {savingBlogId === blog.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => deleteBlog(blog.id, idx)}
                            disabled={savingBlogId === blog.id}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "add" && <AddBlogForm onCreate={createBlog} creating={creating} />}
        </section>
      </div>
    </div>
  );
}

function AddBlogForm({ onCreate, creating }: { onCreate: (b: Partial<Blog>) => Promise<void>, creating: boolean }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imagePath, setImagePath] = useState<string | undefined>(undefined);
  const [loadingImage, setLoadingImage] = useState(false);

  async function uploadAndSet(file?: File) {
    if (!file) return;
    setLoadingImage(true);
    try {
      const reader = new FileReader();
      const dataURL: string = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const resp = await fetch("/api/admin/products/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl: dataURL }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json?.error || "upload failed");
      }
      setImagePath(json.path);
    } catch (err) {
      console.error("upload error", err);
      alert("Upload failed: " + String(err));
    } finally {
      setLoadingImage(false);
    }
  }

  async function handleCreate() {
    if (!title || !slug) {
      alert("Title and slug are required");
      return;
    }
    await onCreate({
      title,
      slug,
      description,
      content,
      image: imagePath || "/blog-post-1.png",
      date: new Date().toLocaleDateString(),
      readTime: "5 min read"
    });
    setTitle(""); setSlug(""); setDescription(""); setImagePath(undefined); setContent("");
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Blog</h2>
      <div className="p-4 border rounded max-w-3xl">
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" />

        <label className="block text-sm font-medium">Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-2 border rounded mb-2" />

        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" rows={4} />

        <label className="block text-sm font-medium">Content (HTML)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded mb-2" rows={8} />

        <label className="block text-sm font-medium">Image</label>
        <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const f = e.target.files?.[0];
          if (f) uploadAndSet(f);
        }} />

        <div className="mt-4">
          <button onClick={handleCreate} disabled={creating} className="px-4 py-2 bg-green-600 text-white rounded">
            {creating ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}
