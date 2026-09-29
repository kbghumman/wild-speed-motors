"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { manufacturerNames } from "@/data/manufacturers";
import { getModelsForManufacturer } from "@/data/models";
import { budgetBays } from "@/data/budgetBays";
import { emptyVehicleDraft, type VehicleDraft } from "@/types/inventory";
import { createClient } from "@/lib/supabase/client";\nimport { refreshInventoryCache } from "@/app/admin/actions";

type PhotoItem = {
  id: string;
  file: File;
  url: string;
  storagePath?: string;
  publicUrl?: string;
};

const steps = [
  ["01", "Vehicle"],
  ["02", "Price"],
  ["03", "Media"],
  ["04", "Details"],
  ["05", "Review"],
];

const featureOptions = [
  "4WD / AWD",
  "Navigation",
  "Apple CarPlay",
  "Android Auto",
  "Backup camera",
  "360 camera",
  "Leather seats",
  "Heated seats",
  "Sunroof",
  "Power sliding doors",
  "Cruise control",
  "Adaptive cruise",
  "Lane assist",
  "Parking sensors",
  "Bluetooth",
  "Keyless entry",
  "Push-button start",
  "ETC",
];

function budgetFor(price: number) {
  return budgetBays.find(
    (bay) => price >= bay.min && (bay.max === null || price <= bay.max),
  );
}

export default function VehicleUploadForm() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<VehicleDraft>(emptyVehicleDraft);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [coverId, setCoverId] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleSlug, setVehicleSlug] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const models = useMemo(
    () => getModelsForManufacturer(draft.make),
    [draft.make],
  );

  const budgetBay = useMemo(
    () => budgetFor(Number(draft.priceUsd || 0)),
    [draft.priceUsd],
  );

  function update<K extends keyof VehicleDraft>(key: K, value: VehicleDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList)
      .filter((file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 15 * 1024 * 1024,
      )
      .slice(0, Math.max(0, 40 - photos.length))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));

    if (!incoming.length) return;

    setPhotos((current) => [...current, ...incoming]);
    setCoverId((current) => current || incoming[0].id);
    setSaved(false);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
  }

  async function removePhoto(id: string) {
    const item = photos.find((photo) => photo.id === id);

    if (item?.storagePath && vehicleId) {
      await supabase.storage.from("vehicle-images").remove([item.storagePath]);
      await supabase
        .from("vehicle_images")
        .delete()
        .eq("vehicle_id", vehicleId)
        .eq("storage_path", item.storagePath);
    }

    if (item) URL.revokeObjectURL(item.url);

    const next = photos.filter((photo) => photo.id !== id);
    setPhotos(next);
    if (coverId === id) setCoverId(next[0]?.id ?? "");
    setSaved(false);
  }

  function toggleFeature(feature: string) {
    update(
      "features",
      draft.features.includes(feature)
        ? draft.features.filter((item) => item !== feature)
        : [...draft.features, feature],
    );
  }

  function makeSlug() {
    const base = [draft.year, draft.make, draft.model, draft.stockNumber]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return (base || "vehicle") + "-" + crypto.randomUUID().slice(0, 8);
  }

  async function persistVehicle(publish: boolean) {
    setSaving(true);
    setSaveError("");
    setSaved(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Your dealer session has expired. Sign in again.");
      }

      const slug = vehicleSlug || makeSlug();
      const status = publish ? "live" : "draft";

      const payload = {
        slug,
        stock_number: draft.stockNumber || null,
        make: draft.make,
        model: draft.model,
        trim: draft.trim || null,
        year: Number(draft.year),
        mileage: Number(draft.mileage),
        price_usd: Number(draft.priceUsd),
        monthly_usd: draft.monthlyUsd ? Number(draft.monthlyUsd) : null,
        chassis_number: draft.chassisNumber || null,
        registration_number: draft.registrationNumber || null,
        fuel: draft.fuel || null,
        transmission: draft.transmission || null,
        drivetrain: draft.drivetrain || null,
        body: draft.body || null,
        engine: draft.engine || null,
        exterior_color: draft.exteriorColor || null,
        interior_color: draft.interiorColor || null,
        shaken_expiry: draft.shakenExpiry || null,
        location: draft.location || null,
        condition: draft.condition || null,
        description: draft.description || null,
        features: draft.features,
        status,
        created_by: user.id,
        published_at: publish ? new Date().toISOString() : null,
      };

      let id = vehicleId;

      if (id) {
        const { error } = await supabase.from("vehicles").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("vehicles")
          .insert(payload)
          .select("id,slug")
          .single();

        if (error) throw error;

        id = data.id;
        setVehicleId(data.id);
        setVehicleSlug(data.slug);
      }

      const workingPhotos = [...photos];

      for (let index = 0; index < workingPhotos.length; index += 1) {
        const photo = workingPhotos[index];
        if (photo.storagePath && photo.publicUrl) continue;

        const extension = photo.file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = id + "/" + crypto.randomUUID() + "." + extension;

        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(path, photo.file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: photo.file.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(path);

        workingPhotos[index] = {
          ...photo,
          storagePath: path,
          publicUrl: publicData.publicUrl,
        };
      }

      setPhotos(workingPhotos);

      await supabase.from("vehicle_images").delete().eq("vehicle_id", id);

      if (workingPhotos.length) {
        const { error: imageError } = await supabase.from("vehicle_images").insert(
          workingPhotos.map((photo, index) => ({
            vehicle_id: id,
            storage_path: photo.storagePath,
            public_url: photo.publicUrl,
            position: index,
            is_cover: photo.id === coverId,
          })),
        );

        if (imageError) throw imageError;
      }

      const cover = workingPhotos.find((photo) => photo.id === coverId);

      const { error: coverError } = await supabase
        .from("vehicles")
        .update({
          cover_image_url: cover?.publicUrl ?? workingPhotos[0]?.publicUrl ?? null,
          status,
          published_at: publish ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (coverError) throw coverError;

      if (publish) {
        await refreshInventoryCache();
      }

      setDraft((current) => ({ ...current, status }));
      setSaved(true);
      localStorage.removeItem("wild-speed-vehicle-draft");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save the listing.",
      );
    } finally {
      setSaving(false);
    }
  }

  function saveLocalBackup() {
    const payload = {
      ...draft,
      photoNames: photos.map((photo) => photo.file.name),
      coverPhoto: photos.find((photo) => photo.id === coverId)?.file.name ?? "",
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("wild-speed-vehicle-draft", JSON.stringify(payload));
  }

  const canContinue = [
    Boolean(draft.make && draft.model && draft.year && draft.mileage),
    Boolean(draft.priceUsd),
    photos.length > 0,
    Boolean(draft.transmission && draft.fuel && draft.body),
    true,
  ][step];

  return (
    <div className="vehicle-uploader">
      <div className="upload-stepper">
        {steps.map(([number, label], index) => (
          <button
            key={number}
            type="button"
            className={index === step ? "active" : index < step ? "complete" : ""}
            onClick={() => setStep(index)}
          >
            <span>{index < step ? <Check size={13} /> : number}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </div>

      <div className="upload-layout">
        <section className="upload-form-card">
          {step === 0 && (
            <>
              <FormHeading
                number="01"
                title="Identify the vehicle"
                copy="Start with the information that uniquely describes the car in your stock."
              />

              <div className="admin-form-grid">
                <Field label="Stock number" hint="Your internal reference">
                  <input value={draft.stockNumber} onChange={(e) => update("stockNumber", e.target.value)} placeholder="WSM-0001" />
                </Field>

                <Field label="Chassis / frame number" hint="Japan chassis number">
                  <input value={draft.chassisNumber} onChange={(e) => update("chassisNumber", e.target.value)} placeholder="Z34-123456" />
                </Field>

                <Field label="Manufacturer" required>
                  <select
                    value={draft.make}
                    onChange={(e) => {
                      update("make", e.target.value);
                      update("model", "");
                    }}
                  >
                    <option value="">Select manufacturer</option>
                    {manufacturerNames.map((make) => <option key={make}>{make}</option>)}
                  </select>
                </Field>

                <Field label="Model" required>
                  <select value={draft.model} onChange={(e) => update("model", e.target.value)} disabled={!draft.make}>
                    <option value="">{draft.make ? "Select model" : "Choose manufacturer first"}</option>
                    {models.map((model) => <option key={model}>{model}</option>)}
                  </select>
                </Field>

                <Field label="Trim / grade">
                  <input value={draft.trim} onChange={(e) => update("trim", e.target.value)} placeholder="e.g. 320i M Sport" />
                </Field>

                <Field label="Registration number" hint="Optional until registered">
                  <input value={draft.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} placeholder="Plate / registration" />
                </Field>

                <Field label="Year" required>
                  <input type="number" min="1980" max="2030" value={draft.year} onChange={(e) => update("year", e.target.value)} placeholder="2021" />
                </Field>

                <Field label="Mileage" hint="Kilometres" required>
                  <input type="number" min="0" value={draft.mileage} onChange={(e) => update("mileage", e.target.value)} placeholder="45,000" />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <FormHeading
                number="02"
                title="Set the selling price"
                copy="Customer-facing pricing is in USD. The budget showroom placement is calculated automatically."
              />

              <div className="price-entry-grid">
                <Field label="Cash price" hint="USD" required>
                  <div className="money-input">
                    <span>$</span>
                    <input type="number" min="0" value={draft.priceUsd} onChange={(e) => update("priceUsd", e.target.value)} placeholder="8,995" />
                  </div>
                </Field>

                <Field label="Monthly from" hint="Optional / illustrative until finance is connected">
                  <div className="money-input">
                    <span>$</span>
                    <input type="number" min="0" value={draft.monthlyUsd} onChange={(e) => update("monthlyUsd", e.target.value)} placeholder="199" />
                  </div>
                </Field>
              </div>

              <div className="budget-placement-card">
                <span className="v3-mono">AUTO PLACEMENT</span>
                <strong>{budgetBay ? budgetBay.shortTitle : "Enter a price"}</strong>
                <p>
                  {budgetBay
                    ? "This vehicle will automatically appear in this virtual showroom bay."
                    : "The correct showroom bay will be assigned from the selling price."}
                </p>
              </div>

              <div className="admin-form-grid upload-form-space">
                <Field label="Stock status">
                  <select value={draft.status} onChange={(e) => update("status", e.target.value as VehicleDraft["status"])}>
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </Field>

                <Field label="Vehicle location" hint="Yard / showroom">
                  <input value={draft.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Iwakuni yard" />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <FormHeading
                number="03"
                title="Upload the vehicle photos"
                copy="Upload the full set once. The cover photo drives inventory cards; the rest becomes the vehicle gallery."
              />

              <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={onFileChange} hidden />

              <div
                className="photo-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <span className="photo-drop-icon"><UploadCloud size={28} /></span>
                <strong>Drop photos here</strong>
                <p>or click to select multiple images</p>
                <small>Recommended: 15–30 photos. JPEG, PNG or WebP, up to 15 MB each.</small>
              </div>

              <div className="photo-shot-guide">
                {["Front 3/4", "Rear 3/4", "Both sides", "Dashboard", "Front seats", "Rear seats", "Odometer", "Engine bay", "Wheels / tires", "Any damage"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map((photo, index) => (
                    <div className={coverId === photo.id ? "photo-card cover" : "photo-card"} key={photo.id}>
                      <img src={photo.url} alt={photo.file.name} />
                      <span className="photo-index">{String(index + 1).padStart(2, "0")}</span>
                      {coverId === photo.id && <span className="cover-label"><Star size={11} /> COVER</span>}
                      <div className="photo-actions">
                        <button type="button" onClick={() => setCoverId(photo.id)} title="Set cover">
                          <Star size={15} />
                        </button>
                        <button type="button" onClick={() => removePhoto(photo.id)} title="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <FormHeading
                number="04"
                title="Specifications & condition"
                copy="These fields power the filters, collections and the vehicle detail page."
              />

              <div className="admin-form-grid">
                <Field label="Transmission" required>
                  <select value={draft.transmission} onChange={(e) => update("transmission", e.target.value)}>
                    <option value="">Select</option>
                    <option>Automatic</option>
                    <option>Manual</option>
                    <option>CVT</option>
                    <option>DCT</option>
                  </select>
                </Field>

                <Field label="Fuel" required>
                  <select value={draft.fuel} onChange={(e) => update("fuel", e.target.value)}>
                    <option value="">Select</option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Hybrid</option>
                    <option>Plug-in Hybrid</option>
                    <option>Electric</option>
                  </select>
                </Field>

                <Field label="Drivetrain">
                  <select value={draft.drivetrain} onChange={(e) => update("drivetrain", e.target.value)}>
                    <option value="">Select</option>
                    <option>2WD</option>
                    <option>FWD</option>
                    <option>RWD</option>
                    <option>4WD</option>
                    <option>AWD</option>
                  </select>
                </Field>

                <Field label="Body type" required>
                  <select value={draft.body} onChange={(e) => update("body", e.target.value)}>
                    <option value="">Select</option>
                    <option>SUV</option>
                    <option>4x4</option>
                    <option>Hatchback</option>
                    <option>Sedan</option>
                    <option>Saloon</option>
                    <option>Coupe</option>
                    <option>Roadster</option>
                    <option>Wagon</option>
                    <option>Minivan</option>
                    <option>Kei</option>
                    <option>Pickup</option>
                    <option>Van</option>
                  </select>
                </Field>

                <Field label="Engine">
                  <input value={draft.engine} onChange={(e) => update("engine", e.target.value)} placeholder="e.g. 2.0L Turbo" />
                </Field>

                <Field label="Shaken expiry">
                  <input type="date" value={draft.shakenExpiry} onChange={(e) => update("shakenExpiry", e.target.value)} />
                </Field>

                <Field label="Exterior color">
                  <input value={draft.exteriorColor} onChange={(e) => update("exteriorColor", e.target.value)} placeholder="Pearl White" />
                </Field>

                <Field label="Interior color">
                  <input value={draft.interiorColor} onChange={(e) => update("interiorColor", e.target.value)} placeholder="Black" />
                </Field>

                <Field label="Condition" wide>
                  <select value={draft.condition} onChange={(e) => update("condition", e.target.value)}>
                    <option value="">Select overall condition</option>
                    <option>Excellent</option>
                    <option>Very good</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Project / needs work</option>
                  </select>
                </Field>
              </div>

              <div className="feature-selector">
                <span className="v3-mono">FEATURES</span>
                <div>
                  {featureOptions.map((feature) => (
                    <button
                      type="button"
                      key={feature}
                      className={draft.features.includes(feature) ? "selected" : ""}
                      onClick={() => toggleFeature(feature)}
                    >
                      {draft.features.includes(feature) && <Check size={12} />}
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Vehicle description" hint="Be concise and factual" wide>
                <textarea
                  rows={6}
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Condition, maintenance, notable options, recent work, imperfections and anything the buyer should know."
                />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <FormHeading
                number="05"
                title="Review before publishing"
                copy="This is the final dealer check. Publishing saves the vehicle to the inventory database and uploads its gallery to Supabase Storage."
              />

              <div className="listing-review">
                <div className="review-hero">
                  {photos.find((photo) => photo.id === coverId) ? (
                    <img src={photos.find((photo) => photo.id === coverId)!.url} alt="" />
                  ) : (
                    <div className="review-no-photo"><ImagePlus size={28} /> No cover photo</div>
                  )}
                  <span>{draft.status.toUpperCase()}</span>
                </div>

                <div className="review-summary">
                  <span className="v3-mono">{draft.stockNumber || "NO STOCK NUMBER"}</span>
                  <h2>{draft.year || "Year"} {draft.make || "Make"} {draft.model || "Model"}</h2>
                  <p>{draft.trim || "Trim not entered"}</p>

                  <div className="review-price">
                    <strong>{draft.priceUsd ? "$" + Number(draft.priceUsd).toLocaleString("en-US") : "No price"}</strong>
                    <span>{budgetBay?.shortTitle ?? "No budget bay"}</span>
                  </div>

                  <dl>
                    <div><dt>Mileage</dt><dd>{draft.mileage ? Number(draft.mileage).toLocaleString() + " km" : "—"}</dd></div>
                    <div><dt>Transmission</dt><dd>{draft.transmission || "—"}</dd></div>
                    <div><dt>Fuel</dt><dd>{draft.fuel || "—"}</dd></div>
                    <div><dt>Drivetrain</dt><dd>{draft.drivetrain || "—"}</dd></div>
                    <div><dt>Engine</dt><dd>{draft.engine || "—"}</dd></div>
                    <div><dt>Photos</dt><dd>{photos.length}</dd></div>
                  </dl>
                </div>
              </div>

              <div className="publish-explainer">
                <CheckCircle2 size={22} />
                <div>
                  <strong>Publishing is now database-backed.</strong>
                  <p>
                    The record is saved once, photos are uploaded once, and a live car automatically appears in All Cars,
                    its manufacturer, its budget bay, and matching collections. Draft listings remain private in the dealer console.
                  </p>
                </div>
              </div>
            </>
          )}

          {saveError && <div className="upload-error">{saveError}</div>}
          {saved && <div className="upload-success"><CheckCircle2 size={15} /> Listing saved successfully.</div>}

          <div className="upload-footer">
            <button
              type="button"
              className="upload-secondary"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              <ArrowLeft size={15} />
              Back
            </button>

            <div>
              <button
                type="button"
                className="upload-save"
                disabled={saving}
                onClick={() => {
                  saveLocalBackup();
                  void persistVehicle(false);
                }}
              >
                <Save size={15} />
                {saving ? "Saving…" : "Save draft"}
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="upload-primary"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                >
                  Continue
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="upload-primary"
                  disabled={saving || !photos.length}
                  onClick={() => void persistVehicle(true)}
                >
                  <CheckCircle2 size={15} />
                  {saving ? "Publishing…" : "Publish live"}
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="upload-side-panel">
          <span className="v3-mono">LISTING STATUS</span>
          <h3>{draft.make || "New"} {draft.model || "vehicle"}</h3>
          <p>{draft.trim || "Complete the steps to prepare this listing."}</p>

          <div className="upload-completeness">
            <Completeness label="Vehicle identity" done={Boolean(draft.make && draft.model && draft.year && draft.mileage)} />
            <Completeness label="USD price" done={Boolean(draft.priceUsd)} />
            <Completeness label="Photos" done={photos.length > 0} detail={photos.length ? photos.length + " added" : "None"} />
            <Completeness label="Specifications" done={Boolean(draft.transmission && draft.fuel && draft.body)} />
            <Completeness label="Description" done={Boolean(draft.description)} />
          </div>

          <div className="upload-routing">
            <span className="v3-mono">AUTOMATIC ROUTING</span>
            <div>
              <span>Inventory</span><strong>All cars</strong>
            </div>
            <div>
              <span>Brand</span><strong>{draft.make || "—"}</strong>
            </div>
            <div>
              <span>Budget bay</span><strong>{budgetBay?.shortTitle ?? "—"}</strong>
            </div>
            <div>
              <span>Collections</span><strong>Rule-based</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormHeading({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="upload-heading">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "admin-field admin-field-wide" : "admin-field"}>
      <span>
        <strong>{label}{required && " *"}</strong>
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function Completeness({
  label,
  done,
  detail,
}: {
  label: string;
  done: boolean;
  detail?: string;
}) {
  return (
    <div className={done ? "completeness-row done" : "completeness-row"}>
      <span>{done ? <Check size={12} /> : ""}</span>
      <strong>{label}</strong>
      <small>{detail ?? (done ? "Ready" : "Missing")}</small>
    </div>
  );
}
