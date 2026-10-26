// "use client";
// import { useEffect, useRef, useState } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { FilterIcon, CloseIcon } from "./Icons";
// import { TEST_IDS } from "./testIds";

// const SORTS = [
//   { v: "featured", label: "Featured" },
//   { v: "newest", label: "Date, new to old" },
//   { v: "price_asc", label: "Price, low to high" },
//   { v: "price_desc", label: "Price, high to low" },
//   { v: "name_asc", label: "Alphabetically, A-Z" },
// ];

// export default function FilterBar({ categories = [], total }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const sp = useSearchParams();
//   const [open, setOpen] = useState(false);
//   const triggerRef = useRef(null);
//   const panelRef = useRef(null);
//   const [q, setQ] = useState(sp.get("q") || "");
//   const [min, setMin] = useState(sp.get("min") || "");
//   const [max, setMax] = useState(sp.get("max") || "");
//   const category = sp.get("category") || "";
//   const sort = sp.get("sort") || (category ? "featured" : "name_asc");
//   const inStock = sp.get("in_stock") === "1";
//   const sortLabel = SORTS.find((s) => s.v === sort)?.label || "Featured";
//   const catName = categories.find((c) => c.slug === category)?.name || category;
//   const hasFilters = !!(
//     q ||
//     min ||
//     max ||
//     category ||
//     sp.get("sort") ||
//     inStock
//   );

//   const push = (updates) => {
//     const p = new URLSearchParams(sp.toString());
//     Object.entries(updates).forEach(([k, v]) =>
//       v ? p.set(k, v) : p.delete(k),
//     );
//     p.delete("page");
//     const s = p.toString();
//     router.push(s ? `${pathname}?${s}` : pathname, { scroll: false });
//   };

//   useEffect(() => {
//     // debounce search + price
//     const same =
//       q === (sp.get("q") || "") &&
//       min === (sp.get("min") || "") &&
//       max === (sp.get("max") || "");
//     if (same) return;
//     const t = setTimeout(() => push({ q: q.trim(), min, max }), 450);
//     return () => clearTimeout(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q, min, max]);
//   useEffect(() => {
//     setQ(sp.get("q") || "");
//     setMin(sp.get("min") || "");
//     setMax(sp.get("max") || "");
//   }, [sp]);
//   useEffect(() => {
//     // close on Escape
//     const h = (e) => e.key === "Escape" && setOpen(false);
//     document.addEventListener("keydown", h);
//     return () => document.removeEventListener("keydown", h);
//   }, []);
//   useEffect(() => {
//     if (!open) return undefined;
//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     panelRef.current?.querySelector("input")?.focus();
//     return () => {
//       document.body.style.overflow = previousOverflow;
//       triggerRef.current?.focus();
//     };
//   }, [open]);

//   const clearAll = () => router.push(pathname, { scroll: false });
//   const chips = [
//     category && { k: "category", label: catName },
//     sp.get("sort") && { k: "sort", label: sortLabel },
//     inStock && { k: "in_stock", label: "In stock" },
//     (min || max) && { k: "price", label: `Rs. ${min || 0} – ${max || "∞"}` },
//     sp.get("q") && { k: "q", label: `“${sp.get("q")}”` },
//   ].filter(Boolean);
//   const removeChip = (k) =>
//     k === "price" ? push({ min: "", max: "" }) : push({ [k]: "" });

//   return (
//     <>
//       <div className="toolbar">
//         <div className="toolbar__strip" />
//         <div className="toolbar__bar">
//           <button
//             ref={triggerRef}
//             className="toolbar__btn"
//             type="button"
//             onClick={() => setOpen(true)}
//             aria-haspopup="dialog"
//             aria-expanded={open}
//             data-testid={TEST_IDS.collectionFilterOpen}
//           >
//             <FilterIcon /> {sortLabel}
//           </button>
//           {total != null && (
//             <span className="toolbar__count">
//               {total} product{total === 1 ? "" : "s"}
//             </span>
//           )}
//         </div>
//         {chips.length > 0 && (
//           <div className="chips">
//             {chips.map((c) => (
//               <button key={c.k} onClick={() => removeChip(c.k)}>
//                 {c.label} <CloseIcon width={12} height={12} />
//               </button>
//             ))}
//             <button className="chips__clear" onClick={clearAll}>
//               Clear all
//             </button>
//           </div>
//         )}
//       </div>

//       <div className={`fdrawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
//         <button
//           className="fdrawer__backdrop"
//           type="button"
//           onClick={() => setOpen(false)}
//           aria-label="Close filters"
//           tabIndex={open ? 0 : -1}
//         />
//         <aside
//           ref={panelRef}
//           className="fdrawer__panel"
//           role="dialog"
//           aria-modal={open ? "true" : undefined}
//           aria-label="Filter and sort"
//         >
//           <div className="fdrawer__head">
//             <h2>Filter and sort</h2>
//             <button
//               type="button"
//               onClick={() => setOpen(false)}
//               aria-label="Close filters"
//               data-testid={TEST_IDS.collectionFilterClose}
//             >
//               <CloseIcon />
//             </button>
//           </div>
//           <div className="fdrawer__body">
//             <div className="fgroup">
//               <label htmlFor="f-search">Search</label>
//               <div className="field">
//                 <input
//                   id="f-search"
//                   type="search"
//                   placeholder="Search products…"
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="fgroup">
//               <h3>Category</h3>
//               <div className="fcats">
//                 <button
//                   className={!category ? "is-active" : ""}
//                   onClick={() => push({ category: "" })}
//                 >
//                   All
//                 </button>
//                 {categories.map((c) => (
//                   <button
//                     key={c.id}
//                     className={category === c.slug ? "is-active" : ""}
//                     onClick={() => push({ category: c.slug })}
//                   >
//                     {c.name}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="fgroup">
//               <h3>Price (Rs.)</h3>
//               <div className="fprice">
//                 <input
//                   type="number"
//                   min="0"
//                   placeholder="From"
//                   aria-label="Minimum price"
//                   value={min}
//                   onChange={(e) => setMin(e.target.value)}
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   placeholder="To"
//                   aria-label="Maximum price"
//                   value={max}
//                   onChange={(e) => setMax(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="fgroup">
//               <h3>Availability</h3>
//               <label className="fcheck">
//                 <input
//                   type="checkbox"
//                   checked={inStock}
//                   onChange={(e) =>
//                     push({ in_stock: e.target.checked ? "1" : "" })
//                   }
//                 />{" "}
//                 In stock only
//               </label>
//             </div>
//             <div className="fgroup">
//               <label htmlFor="f-sort">Sort by</label>
//               <div className="field">
//                 <select
//                   id="f-sort"
//                   value={sort}
//                   onChange={(e) => push({ sort: e.target.value })}
//                 >
//                   {SORTS.map((s) => (
//                     <option key={s.v} value={s.v}>
//                       {s.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="fdrawer__foot">
//             {hasFilters && (
//               <button className="btn btn--outline" onClick={clearAll}>
//                 Clear all
//               </button>
//             )}
//             <button className="btn" onClick={() => setOpen(false)}>
//               Show results
//             </button>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CloseIcon } from "./Icons";

const SORTS = [
  { v: "featured", label: "Featured" },
  { v: "newest", label: "Date, new to old" },
  { v: "price_asc", label: "Price, low to high" },
  { v: "price_desc", label: "Price, high to low" },
  { v: "name_asc", label: "Alphabetically, A-Z" },
];

export default function FilterBar({ categories = [], total }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") || "");
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");

  const category = sp.get("category") || "";
  const sort = sp.get("sort") || (category ? "featured" : "name_asc");
  const inStock = sp.get("in_stock") === "1";
  const sortLabel = SORTS.find((s) => s.v === sort)?.label || "Featured";
  const catName = categories.find((c) => c.slug === category)?.name || category;
  const hasFilters = !!(
    q ||
    min ||
    max ||
    category ||
    sp.get("sort") ||
    inStock
  );

  const push = (updates) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) =>
      v ? p.set(k, v) : p.delete(k),
    );
    p.delete("page");
    const s = p.toString();
    router.push(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  useEffect(() => {
    // debounce search + price
    const same =
      q === (sp.get("q") || "") &&
      min === (sp.get("min") || "") &&
      max === (sp.get("max") || "");
    if (same) return;
    const t = setTimeout(() => push({ q: q.trim(), min, max }), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, min, max]);

  useEffect(() => {
    setQ(sp.get("q") || "");
    setMin(sp.get("min") || "");
    setMax(sp.get("max") || "");
  }, [sp]);

  const clearAll = () => router.push(pathname, { scroll: false });

  const chips = [
    category && { k: "category", label: catName },
    sp.get("sort") && { k: "sort", label: sortLabel },
    inStock && { k: "in_stock", label: "In stock" },
    (min || max) && { k: "price", label: `Rs. ${min || 0} – ${max || "∞"}` },
    sp.get("q") && { k: "q", label: `“${sp.get("q")}”` },
  ].filter(Boolean);

  const removeChip = (k) =>
    k === "price" ? push({ min: "", max: "" }) : push({ [k]: "" });

  return (
    <div className="filter-container border py-2 px-3 rounded-3 sticky-top">
      {/* Top status bar: Count and Active Filter Chips */}
      <div className=" mb-3">
        {total != null && (
          <span className="toolbar__count">
            {total} product{total === 1 ? "" : "s"}
          </span>
        )}

        {chips.length > 0 && (
          <div className="chips">
            {chips.map((c) => (
              <button key={c.k} onClick={() => removeChip(c.k)}>
                {c.label} <CloseIcon width={12} height={12} />
              </button>
            ))}
            <button className="chips__clear" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Filter Section rendered directly on page */}
      <aside className="filter-panel" aria-label="Filter and sort">
        <div className="filter-panel__head">
          <h2>Filter and sort</h2>
        </div>

        <div className="filter-panel__body">
          <div className="fgroup">
            <label htmlFor="f-search">Search</label>
            <div className="field">
              <input
                id="f-search"
                type="search"
                placeholder="Search products…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="fgroup">
            <h3>Category</h3>
            <div className="fcats">
              <button
                type="button"
                className={!category ? "is-active" : ""}
                onClick={() => push({ category: "" })}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={category === c.slug ? "is-active" : ""}
                  onClick={() => push({ category: c.slug })}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <h3>Price (Rs.)</h3>
            <div className="fprice">
              <input
                type="number"
                min="0"
                placeholder="From"
                aria-label="Minimum price"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder="To"
                aria-label="Maximum price"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
          </div>

          <div className="fgroup">
            <h3>Availability</h3>
            <label className="fcheck">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) =>
                  push({ in_stock: e.target.checked ? "1" : "" })
                }
              />{" "}
              In stock only
            </label>
          </div>

          <div className="fgroup">
            <label htmlFor="f-sort">Sort by</label>
            <div className="field">
              <select
                id="f-sort"
                value={sort}
                onChange={(e) => push({ sort: e.target.value })}
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {hasFilters && (
          <div className="filter-panel__foot">
            <button className="btn btn--outline" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
