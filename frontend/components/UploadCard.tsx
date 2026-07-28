"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const setResumeFile = (file?: File) => {
    setError("");

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setSelectedFile(null);
      setError("Please choose a PDF resume.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("Your resume must be 5 MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeFile(event.target.files?.[0]);
  };

  const analyseResume = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      setLoading(true);

      const response = await api.post("/jobs/recommend", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("careerpilot_result", JSON.stringify(response.data));

      router.push("/dashboard");
    } catch {
      setError("We could not analyse this resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg border border-white/10 bg-slate-900/80 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur sm:p-6 lg:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase text-teal-200">
            Resume scan
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Upload your resume
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            PDF only, up to 5 MB. Your dashboard is generated after the scan.
          </p>
        </div>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-200 ring-1 ring-teal-300/20 sm:flex">
          <Upload size={22} aria-hidden="true" />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          setResumeFile(event.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition sm:min-h-52 sm:p-6 ${
          isDragging
            ? "border-teal-300 bg-teal-400/10"
            : "border-white/15 bg-slate-950/50 hover:border-teal-300/70 hover:bg-teal-400/10"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-400/10 text-teal-200 shadow-sm ring-1 ring-teal-300/20">
          <FileText size={24} aria-hidden="true" />
        </span>

        <span className="mt-4 text-base font-bold text-white">
          Drop your PDF here
        </span>
        <span className="mt-1 text-sm text-slate-400">
          or click to browse from your device
        </span>
      </button>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-emerald-100">
          <div className="flex min-w-0 items-center gap-3">
            <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
            <span className="truncate text-sm font-semibold">
              {selectedFile.name}
            </span>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-emerald-100 transition hover:bg-emerald-300/10"
            aria-label="Remove selected resume"
            onClick={() => {
              setSelectedFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={analyseResume}
        disabled={!selectedFile || loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-sm shadow-teal-950/30 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
      >
        {loading ? (
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Upload size={18} aria-hidden="true" />
        )}
        {loading ? "Analysing resume" : "Analyse resume"}
      </button>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-slate-950/45 p-3 ring-1 ring-white/10">
          <p className="font-bold text-white">ATS-ready score</p>
          <p className="mt-1 text-slate-400">Clear numeric signal</p>
        </div>
        <div className="rounded-lg bg-slate-950/45 p-3 ring-1 ring-white/10">
          <p className="font-bold text-white">Skill map</p>
          <p className="mt-1 text-slate-400">Matched and missing</p>
        </div>
      </div>
    </div>
  );
}
