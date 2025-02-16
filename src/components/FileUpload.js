import { useState } from "react";
import { UploadCloud, Image, X } from "lucide-react";

const FileUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Show preview
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onUpload(data.fileUrl); // Pass back the uploaded image URL
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      {previewUrl ? (
        <div className="relative">
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
          <button onClick={() => setPreviewUrl("")} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center cursor-pointer">
          <Image className="w-10 h-10 text-gray-500" />
          <span className="text-sm text-gray-500 mt-2">Choose an image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {selectedFile && (
        <button
          onClick={handleUpload}
          className={`mt-3 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
          disabled={uploading}
        >
          <UploadCloud size={18} />
          <span>{uploading ? "Uploading..." : "Upload Image"}</span>
        </button>
      )}
    </div>
  );
};

export default FileUpload;
