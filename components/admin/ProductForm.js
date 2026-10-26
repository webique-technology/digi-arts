"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, imageUrl } from "@/lib/api";
import { useAdmin } from "./AdminProvider";
import ImageDropzone from "./ImageDropzone";

export default function ProductForm({ product }) {
  const router = useRouter();
  const { toast, onError } = useAdmin();
  const [cats, setCats] = useState([]);
  const [f, setF] = useState({
    title: product?.title || "",
    category_id: product?.category_id ? String(product.category_id) : "",
    price: product?.price ?? "",
    sale_price: product?.sale_price ?? "",
    stock: product?.stock ?? 0,
    status: String(product?.status ?? 1),
    is_bestseller: String(product?.is_bestseller ?? 0),
    description: product?.description || "",
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });
  const existing = (product?.images || []).map((im) => ({
    key: `e${im.id}`,
    existingId: im.id,
    url: imageUrl(im.image_path),
  }));
  const [items, setItems] = useState(existing);
  const [primary, setPrimary] = useState(() => {
    const p = (product?.images || []).find((i) => Number(i.is_primary) === 1);
    return p ? `e${p.id}` : existing[0]?.key || "";
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminFetch("/admin/categories")
      .then((r) => setCats(r.data || []))
      .catch(onError);
  }, [onError]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Title is required";
    if (f.price === "" || Number(f.price) < 0) e.price = "Enter a valid price";
    if (f.sale_price !== "" && Number(f.sale_price) >= Number(f.price))
      e.sale_price = "Sale price must be lower than price";
    if (Number(f.stock) < 0) e.stock = "Stock cannot be negative";
    if (!items.length) e.images = "Add at least one image";
    return e;
  };

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    let n = 0;
    const order = [];
    const tok = {};
    items.forEach((it) => {
      if (it.file) {
        fd.append("images[]", it.file);
        tok[it.key] = `n${n++}`;
      } else {
        tok[it.key] = `e${it.existingId}`;
      }
      order.push(tok[it.key]);
    });
    fd.append("image_order", JSON.stringify(order));
    fd.append("primary_image", tok[primary] || order[0] || "");
    if (product) {
      const keep = new Set(
        items.filter((i) => !i.file).map((i) => i.existingId),
      );
      fd.append(
        "delete_images",
        JSON.stringify(
          (product.images || []).map((i) => i.id).filter((id) => !keep.has(id)),
        ),
      );
    }

    setBusy(true);
    try {
      await adminFetch(
        product ? `/admin/products/${product.id}` : "/admin/products",
        { method: "POST", body: fd },
      );
      toast(product ? "Product updated" : "Product created");
      router.push("/admin/products");
    } catch (err) {
      if (err.status === 422 && err.errors) setErrors(err.errors);
      onError(err);
    } finally {
      setBusy(false);
    }
  }

  const Err = ({ k }) =>
    errors[k] ? <div className="field__error">{errors[k]}</div> : null;

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <div className="panel__head">
        <h1>{product ? "Edit product" : "Add product"}</h1>
        <Link href="/admin/products" className="btn btn--outline btn--sm">
          ← Back
        </Link>
      </div>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="title">Title *</label>
          <input id="title" value={f.title} onChange={set("title")} />
          <Err k="title" />
        </div>
        <div className="field">
          <label htmlFor="cat">Category</label>
          <select id="cat" value={f.category_id} onChange={set("category_id")}>
            <option value="">— None —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={f.status} onChange={set("status")}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="best">Best seller (shown on home page)</label>
          <select
            id="best"
            value={f.is_bestseller}
            onChange={set("is_bestseller")}
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="price">Price (₹) *</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={f.price}
            onChange={set("price")}
          />
          <Err k="price" />
        </div>
        <div className="field">
          <label htmlFor="sale">Sale price (₹)</label>
          <input
            id="sale"
            type="number"
            min="0"
            step="0.01"
            value={f.sale_price}
            onChange={set("sale_price")}
          />
          <Err k="sale_price" />
        </div>
        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={f.stock}
            onChange={set("stock")}
          />
          <Err k="stock" />
        </div>
        <div className="field full">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            value={f.description}
            onChange={set("description")}
          />
        </div>
        <div className="field full">
          <label>
            Images *{" "}
            <small>(first image is used if no primary is chosen)</small>
          </label>
          <ImageDropzone
            items={items}
            onChange={setItems}
            primary={primary}
            onPrimary={setPrimary}
            maxMB={2}
            onReject={(m) => toast(m, "error")}
          />
          <Err k="images" />
        </div>
        <div className="field">
          <label htmlFor="mt">SEO title</label>
          <input
            id="mt"
            value={f.meta_title}
            onChange={set("meta_title")}
            maxLength={200}
          />
        </div>
        <div className="field">
          <label htmlFor="md">SEO description</label>
          <input
            id="md"
            value={f.meta_description}
            onChange={set("meta_description")}
            maxLength={300}
          />
        </div>
      </div>
      <button className="btn" disabled={busy}>
        {busy ? "Saving…" : product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
