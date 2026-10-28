"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, ChevronDown, CloseIcon } from "./Icons";

const SORTS = [
  { v: "featured", label: "Featured" },
  { v: "newest", label: "Date, new to old" },
  { v: "price_asc", label: "Price, low to high" },
  { v: "price_desc", label: "Price, high to low" },
  { v: "name_asc", label: "Alphabetically, A-Z" },
];

// Price Slider Limits
const MIN_LIMIT = 0;
const MAX_LIMIT = 10000;
const STEP = 50;

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

  const hasFilters = Boolean(
    q || min || max || category || sp.get("sort") || inStock,
  );

  // Price Slider numeric values and calculations
  const currentMin = min !== "" ? Number(min) : MIN_LIMIT;
  const currentMax = max !== "" ? Number(max) : MAX_LIMIT;

  const handleMinSlider = (e) => {
    const value = Math.min(Number(e.target.value), currentMax - STEP);
    setMin(String(value));
  };

  const handleMaxSlider = (e) => {
    const value = Math.max(Number(e.target.value), currentMin + STEP);
    setMax(String(value));
  };

  const minPercent = ((currentMin - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;
  const maxPercent = ((currentMax - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;

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
    const same =
      q === (sp.get("q") || "") &&
      min === (sp.get("min") || "") &&
      max === (sp.get("max") || "");
    if (same) return;
    const t = setTimeout(() => push({ q: q.trim(), min, max }), 450);
    return () => clearTimeout(t);
  }, [q, min, max]);

  useEffect(() => {
    setQ(sp.get("q") || "");
    setMin(sp.get("min") || "");
    setMax(sp.get("max") || "");
  }, [sp]);

  const clearAll = () => router.push(pathname, { scroll: false });

  return (
    <div className="filter-container sticky-top">
      <div className="filter-container__top">
        {total != null && (
          <span className="filter-container__count">{total} products</span>
        )}

        {hasFilters && (
          <button
            type="button"
            className="filter-container__reset"
            onClick={clearAll}
          >
            Reset all
          </button>
        )}
      </div>

      <hr className="filter-container__divider" />

      <h2 className="filter-container__title">Filter and sort</h2>
      <div className="filter-container__body">
        {/* Search */}
        <div className="fgroup">
          <label className="fgroup__label" htmlFor="f-search">
            Search
          </label>
          <div className="filter-search-box">
            <SearchIcon className="filter-search-icon" />
            <input
              id="f-search"
              type="search"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div className="fgroup fgroup--bordered">
          <div className="fgroup__header">
            <h3 className="fgroup__label">Price (Rs.)</h3>
            <span className="fprice-slider__range">
              ₹{currentMin.toLocaleString("en-IN")} – ₹
              {currentMax.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="fprice-slider">
            {/* Active colored track between min and max */}
            <div
              className="fprice-slider__track"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />

            {/* Min Handle */}
            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={currentMin}
              onChange={handleMinSlider}
              className="fprice-slider__input fprice-slider__input--min"
              style={{ zIndex: currentMin > MAX_LIMIT - 1000 ? 5 : 3 }}
              aria-label="Minimum price"
            />

            {/* Max Handle */}
            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={currentMax}
              onChange={handleMaxSlider}
              className="fprice-slider__input fprice-slider__input--max"
              style={{ zIndex: 4 }}
              aria-label="Maximum price"
            />
          </div>

          {/* Min & Max Limit Labels */}
          <div className="fprice-slider__limits">
            <span>₹{MIN_LIMIT}</span>
            <span>₹{MAX_LIMIT.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="fgroup">
          <h3 className="fgroup__label">Category</h3>
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
                key={c.id || c.slug}
                className={category === c.slug ? "is-active" : ""}
                onClick={() => push({ category: c.slug })}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort by */}
        <div className="fgroup">
          <label className="fgroup__label" htmlFor="f-sort">
            Sort by
          </label>
          <div className="fsort-field">
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
            <ChevronDown className="fsort-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
