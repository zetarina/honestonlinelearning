"use client";

import React, { useState, useEffect } from "react";
import { Upload, message, Card, Button, Spin, Alert } from "antd";
import { InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import initializeFirebaseClient from "@/utils/firebaseClient";
import { FIREBASE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";

const { Dragger } = Upload;

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
];

const MultiFileUploader = () => {
  const [firebaseConfig, setFirebaseConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFirebaseConfig = async () => {
      try {
        const response = await apiClient.get(
          `/settings/key/${FIREBASE_SETTINGS_KEYS.FIREBASE}`
        );
        if (!response.data?.clientConfig) {
          throw new Error("Firebase settings are missing.");
        }
        setFirebaseConfig(response.data);
        initializeFirebaseClient(response.data.clientConfig);
      } catch (error) {
        console.error("Error fetching Firebase settings:", error);
        setConfigError(true);
      }
    };

    fetchFirebaseConfig();
  }, []);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    if (!firebaseConfig) {
      message.error("Firebase settings are not configured.");
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      const errorMsg = `${file.name} is not a supported file type.`;
      message.error(errorMsg);
      onError(new Error(errorMsg));
      return;
    }

    setLoading(true);

    try {
      const storage = getStorage();
      const uniqueFileName = `uploads/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, uniqueFileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentCompleted = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          onProgress({ percent: percentCompleted });
        },
        (error) => {
          console.error("Upload error:", error);
          message.error("File upload failed.");
          onError(error);
          setLoading(false);
        },
        async () => {
          const publicUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const metadata = {
            files: [
              {
                filePath: uniqueFileName,
                name: file.name,
                service: "firebase",
                size: file.size,
                contentType: file.type,
                publicUrl: publicUrl,
                isPublic: true,
                uploadedBy: "user_id",
                description: "",
                tags: [],
                folder: "",
              },
            ],
          };

          await apiClient.post("/files", metadata);

          message.success(`${file.name} uploaded successfully.`);
          onSuccess(publicUrl, file);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("File upload failed.");
      onError(error);
      setLoading(false);
    }
  };

  if (configError) {
    return (
      <div className="uploader-container">
        <Card
          title="Firebase Not Configured"
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Alert
            message="Firebase is not set up yet."
            description="Please configure Firebase settings before uploading files."
            type="warning"
            showIcon
            style={{ marginBottom: "20px" }}
          />
          <Button
            type="primary"
            onClick={() => router.push("/dashboard/settings")}
            style={{
              fontSize: "16px",
              padding: "10px 24px",
              borderRadius: "8px",
            }}
          >
            Go to Settings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="uploader-container">
      <Card
        title="Upload to Firebase Storage"
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Dragger
          accept={allowedFileTypes.join(",")}
          customRequest={handleUpload}
          multiple
          listType="picture"
          showUploadList={{ showRemoveIcon: true }}
          disabled={!firebaseConfig} // ✅ Disable upload if Firebase is not set up
          beforeUpload={(file) => {
            const isValid = allowedFileTypes.includes(file.type);
            if (!isValid) {
              message.error(`${file.name} is not a valid file type.`);
            }
            return isValid || Upload.LIST_IGNORE;
          }}
          style={{
            borderRadius: "8px",
            padding: "24px",
            border: "2px dashed #1890ff",
            transition: "border-color 0.3s",
            opacity: !firebaseConfig ? 0.5 : 1, // ✅ Grey out if not configured
            pointerEvents: !firebaseConfig ? "none" : "auto",
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "#1890ff", fontSize: "32px" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "16px", fontWeight: 500 }}
          >
            Drag & drop files here, or click to select files
          </p>
          <p className="ant-upload-hint" style={{ color: "#666" }}>
            Supports images, PDFs, and text files.
          </p>
        </Dragger>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            disabled={loading || !firebaseConfig}
            style={{
              fontSize: "16px",
              padding: "10px 24px",
              borderRadius: "8px",
            }}
          >
            {loading ? <Spin size="small" /> : "Upload Now"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MultiFileUploader;
