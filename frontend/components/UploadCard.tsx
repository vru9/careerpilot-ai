"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import api from "@/services/api";

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const analyseResume = async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("resume", selectedFile);

  try {
    setLoading(true);

    console.log("1️⃣ Uploading resume...");

    const response = await api.post(
      "/jobs/recommend",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("2️⃣ API Response:", response.data);

    localStorage.setItem(
      "careerpilot_result",
      JSON.stringify(response.data)
    );

    console.log("3️⃣ Saved to localStorage");

    window.location.href = "/dashboard";

    console.log("4️⃣ Redirecting...");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mt-16 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">

      <div className="flex flex-col items-center">

        <div className="rounded-full bg-blue-600/20 p-5">
          <Upload className="h-10 w-10 text-blue-500" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          Upload Your Resume
        </h2>

        <p className="mt-3 text-center text-gray-400">
          Drag & Drop your resume or choose a PDF file below.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            <FileText size={20} />
            Choose PDF
          </button>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
              📄 {selectedFile.name}
            </div>

            <button
              onClick={analyseResume}
              disabled={loading}
              className="mt-6 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Analysing..." : "✨ Analyse Resume"}
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-gray-500">
          PDF files only • Maximum 5 MB
        </p>

      </div>

    </div>
  );
}