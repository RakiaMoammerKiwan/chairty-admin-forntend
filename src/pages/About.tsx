import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const About: React.FC = () => {
  const [readmeContent, setReadmeContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/README_ARABIC.md")
      .then((res) => {
        if (!res.ok) throw new Error("فشل تحميل المحتوى.");
        return res.text();
      })
      .then(setReadmeContent)
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل المحتوى. الرجاء المحاولة لاحقًا.");
      });
  }, []);

  return (
    <div className="markdown-container max-w-3xl mx-auto" dir="rtl">
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      )}
    </div>
  );
};

export default About;
