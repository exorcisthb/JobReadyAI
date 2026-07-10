import React, { useEffect, useState } from "react";
import { getTemplateComponent } from "@/pages/User/CVBuilderPage";
import { getTemplateMetadata } from "@/data/cv-templates";

export default function CVPrintPage() {
  const [cvData, setCvData] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCVData = async () => {
      try {
        // Get job ID from URL
        const params = new URLSearchParams(window.location.search);
        const jobId = params.get("job_id");

        if (!jobId) {
          setError("Missing job_id parameter");
          setLoading(false);
          return;
        }

        // Fetch CV data from backend
        const response = await fetch(`/api/cv-export/render-data/${jobId}`);

        if (!response.ok) {
          throw new Error("Failed to load CV data");
        }

        const { cvData, templateData } = await response.json();

        setCvData(cvData);

        // Resolve full template metadata if layout is missing (e.g. saved CV from DB)
        let finalTemplate = templateData;
        if (!templateData?.layout && templateData?.templateId) {
          const meta = getTemplateMetadata(templateData.templateId);
          if (meta) {
            const firstColorScheme = meta.colors?.[0] || {};
            finalTemplate = { ...meta, ...firstColorScheme };
          }
        }
        setTemplate(finalTemplate);

        // Load template component
        if (finalTemplate?.layout) {
          const component = getTemplateComponent(finalTemplate.layout);
          if (component) {
            setTemplateComponent(() => component);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading CV data:", err);
        setError(err instanceof Error ? err.message : "Failed to load CV");
        setLoading(false);
      }
    };

    loadCVData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: "794px", 
        height: "1123px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "white"
      }}>
        <div>Loading CV...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "794px", 
        height: "1123px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "white"
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!TemplateComponent || !cvData) {
    return (
      <div style={{ 
        width: "794px", 
        height: "1123px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "white"
      }}>
        <div>No CV data available</div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "white",
        margin: 0,
        padding: 0,
      }}
    >
      <div id="cv-preview-container">
        <TemplateComponent data={cvData} onChange={() => {}} template={template} />
      </div>
    </div>
  );
}
