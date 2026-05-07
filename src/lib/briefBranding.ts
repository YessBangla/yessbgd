// Shared branding model for PDF + DOCX brief exports.
// Persisted in localStorage so users can customise without code changes.

export interface BriefBranding {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  web: string;
  copyrightHolder: string;
  /** Header right-side label (e.g., "ENTERPRISE BRIEF"). */
  documentLabel: string;
  /** Confidentiality strap shown on header right column. */
  confidentialityNote: string;
}

export const DEFAULT_BRANDING: BriefBranding = {
  companyName: "YESS BANGLA",
  tagline: "Enterprise Solutions · Media · Technology",
  address: "Block A, Road 3, House 127, Mirpur 12, Dhaka 1216, Bangladesh",
  phone: "+880 1805-464343",
  email: "yessbangla.bd@gmail.com",
  web: "https://yessbgd.lovable.app",
  copyrightHolder: "YESS Bangla",
  documentLabel: "ENTERPRISE BRIEF",
  confidentialityNote: "Confidential · For intended recipient",
};

const STORAGE_KEY = "yess-brief-branding-v1";

export function loadBranding(): BriefBranding {
  if (typeof localStorage === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRANDING;
    const parsed = JSON.parse(raw) as Partial<BriefBranding>;
    return { ...DEFAULT_BRANDING, ...parsed };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveBranding(b: BriefBranding) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  } catch {
    /* ignore quota errors */
  }
}

export function resolveBranding(
  partial?: Partial<BriefBranding>,
): BriefBranding {
  return { ...DEFAULT_BRANDING, ...(partial ?? {}) };
}
