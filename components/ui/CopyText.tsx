import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyTextProps = {
  text: string;
  className?: string; // optional for styling
};

const CopyText: React.FC<CopyTextProps> = ({ text, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded">{text}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-gray-200"
        aria-label="Copy text"
      >
        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
      </button>
    </div>
  );
};

export default CopyText;
