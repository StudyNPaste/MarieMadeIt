import React, { useEffect, useState } from "react";
import "./PromoManager.css";

const BACKEND = "https://backend.mariemadeit.com";

const emptyForm = {
  code: "",
  type: "percent",
  value: "",
  description: "",
  minOrder: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

const PromoManager = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/admin/promos`);
      const data = await res.json();
      if (data.success) setPromos(data.promos);
    } catch (err) {
      console.error("Failed to load promos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "code" ? value.toUpperCase() : value,
    }));
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!form.code.trim()) return setFormError("Code is required");
    if (form.type !== "free_shipping" && (!form.value || Number(form.value) <= 0))
      return setFormError("Enter a discount value greater than 0");
    if (!form.description.trim()) return setFormError("Description is required");

    setSaving(true);
    setFormError("");

    const payload = {
      code: form.code.trim(),
      type: form.type,
      value: form.type === "free_shipping" ? 0 : Number(form.value),
      description: form.description.trim(),
      minOrder: Number(form.minOrder) || 0,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
      active: form.active,
    };

    try {
      const url = editingId
        ? `${BACKEND}/admin/promos/${editingId}`
        : `${BACKEND}/admin/promos`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || "Failed to save promo");
      } else {
        setShowForm(false);
        setForm(emptyForm);
        setEditingId(null);
        fetchPromos();
      }
    } catch (err) {
      setFormError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (promo) => {
    setForm({
      code: promo.code,
      type: promo.type,
      value: promo.value || "",
      description: promo.description,
      minOrder: promo.minOrder || "",
      maxUses: promo.maxUses || "",
      expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 10) : "",
      active: promo.active,
    });
    setEditingId(promo._id);
    setShowForm(true);
    setFormError("");
  };

  const handleToggle = async (id) => {
    await fetch(`${BACKEND}/admin/promos/${id}/toggle`, { method: "PATCH" });
    fetchPromos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promo code?")) return;
    await fetch(`${BACKEND}/admin/promos/${id}`, { method: "DELETE" });
    fetchPromos();
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const typeLabel = (type, value) => {
    if (type === "percent") return `${value}% off`;
    if (type === "fixed") return `$${value} off`;
    return "Free shipping";
  };

  const statusLabel = (promo) => {
    const expired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
    const exhausted = promo.maxUses && promo.uses >= promo.maxUses;
    if (!promo.active) return { text: "Paused", cls: "badge-paused" };
    if (expired) return { text: "Expired", cls: "badge-expired" };
    if (exhausted) return { text: "Limit reached", cls: "badge-expired" };
    return { text: "Active", cls: "badge-active" };
  };

  return (
    <div className="promo-manager">
      <div className="pm-header">
        <div>
          <h1>Promo codes</h1>
          <p>Create and manage discount codes for your store</p>
        </div>
        <button className="pm-btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          + New promo
        </button>
      </div>

      {showForm && (
        <div className="pm-form-card">
          <h2>{editingId ? "Edit promo code" : "New promo code"}</h2>
          <div className="pm-form-grid">
            <div className="pm-field">
              <label>Code</label>
              <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. SUMMER20" />
            </div>
            <div className="pm-field">
              <label>Discount type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="percent">Percentage off</option>
                <option value="fixed">Fixed $ off</option>
                <option value="free_shipping">Free shipping</option>
              </select>
            </div>
            {form.type !== "free_shipping" && (
              <div className="pm-field">
                <label>{form.type === "percent" ? "Discount (%)" : "Discount ($)"}</label>
                <input name="value" type="number" min="0" value={form.value} onChange={handleChange} placeholder={form.type === "percent" ? "e.g. 20" : "e.g. 10"} />
              </div>
            )}
            <div className="pm-field">
              <label>Min order ($)</label>
              <input name="minOrder" type="number" min="0" value={form.minOrder} onChange={handleChange} placeholder="0 = no minimum" />
            </div>
            <div className="pm-field">
              <label>Max uses</label>
              <input name="maxUses" type="number" min="1" value={form.maxUses} onChange={handleChange} placeholder="Blank = unlimited" />
            </div>
            <div className="pm-field">
              <label>Expiry date</label>
              <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} />
            </div>
            <div className="pm-field pm-field-full">
              <label>Description <span className="pm-label-hint">(shown as the discount line label at checkout)</span></label>
              <input name="description" value={form.description} onChange={handleChange} placeholder="e.g. Summer sale — 20% off" />
            </div>
            <div className="pm-field pm-field-full pm-field-checkbox">
              <label>
                <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
                Active (customers can use this code immediately)
              </label>
            </div>
          </div>
          {formError && <p className="pm-form-error">{formError}</p>}
          <div className="pm-form-actions">
            <button className="pm-btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create promo"}
            </button>
            <button className="pm-btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="pm-loading">Loading promos...</p>
      ) : promos.length === 0 ? (
        <p className="pm-empty">No promo codes yet. Create one above.</p>
      ) : (
        <div className="pm-table-wrapper">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min order</th>
                <th>Uses</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => {
                const status = statusLabel(promo);
                return (
                  <tr key={promo._id}>
                    <td>
                      <span className="pm-code">{promo.code}</span>
                      <span className="pm-desc">{promo.description}</span>
                    </td>
                    <td>{typeLabel(promo.type, promo.value)}</td>
                    <td>{promo.minOrder > 0 ? `$${promo.minOrder}` : "—"}</td>
                    <td>{promo.uses}{promo.maxUses ? ` / ${promo.maxUses}` : ""}</td>
                    <td>{promo.expiresAt ? promo.expiresAt.slice(0, 10) : "Never"}</td>
                    <td><span className={`pm-badge ${status.cls}`}>{status.text}</span></td>
                    <td>
                      <div className="pm-actions">
                        <button className="pm-action-btn" onClick={() => handleToggle(promo._id)} title={promo.active ? "Pause" : "Activate"}>
                          {promo.active ? "⏸" : "▶"}
                        </button>
                        <button className="pm-action-btn" onClick={() => handleEdit(promo)} title="Edit">✏️</button>
                        <button className="pm-action-btn pm-action-delete" onClick={() => handleDelete(promo._id)} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromoManager;