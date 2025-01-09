"use client";

import React, { useState, useEffect } from "react";
import { Upload, message, Card, Radio } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import AWS from "aws-sdk";
import { SettingsInterface, SETTINGS_KEYS } from "@/config/settingKeys";
import apiClient from "@/utils/api/apiClient";

const { Dragger } = Upload;

const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

const MultiImageUploader = () => {
  const [selectedService, setSelectedService] = useState<string>("imgbb");
  const [imageServices, setImageServices] = useState<
    Partial<SettingsInterface>
  >({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImageProviders = async () => {
      try {
        const response = await apiClient.get<SettingsInterface>("/settings");
        setImageServices(response.data);
        setSelectedService("imgbb"); // Default to imgbb or first available service
      } catch (error) {
        console.error("Error fetching image providers:", error);
        message.error("Failed to load image services.");
      }
    };

    fetchImageProviders();
  }, []);

  const handleServiceChange = (e: any) => {
    setSelectedService(e.target.value);
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;

    if (!allowedImageTypes.includes(file.type)) {
      onError(new Error(`${file.name} is not a valid image file.`));
      return;
    }

    try {
      let imageUrl = "";
      const formData = new FormData();
      formData.append("image", file);

      if (selectedService === "imgbb") {
        const imgbbApiKey = imageServices[SETTINGS_KEYS.IMGBB]?.apiKey;
        if (!imgbbApiKey) throw new Error("ImgBB API Key is not configured.");
        const response = await apiClient.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress({ percent: percentCompleted });
            },
          }
        );
        imageUrl = response.data.data.url;
      } else if (selectedService === "cloudinary") {
        const cloudName = imageServices[SETTINGS_KEYS.CLOUDINARY]?.cloudName;
        const uploadPreset =
          imageServices[SETTINGS_KEYS.CLOUDINARY]?.uploadPreset;
        if (!cloudName || !uploadPreset)
          throw new Error("Cloudinary settings are not configured.");
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("upload_preset", uploadPreset);

        const response = await apiClient.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          cloudinaryFormData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress({ percent: percentCompleted });
            },
          }
        );
        imageUrl = response.data.secure_url;
      } else if (selectedService === "aws") {
        const bucket = imageServices[SETTINGS_KEYS.AWS]?.bucket;
        const region = imageServices[SETTINGS_KEYS.AWS]?.region;
        const accessKeyId = imageServices[SETTINGS_KEYS.AWS]?.accessKeyId;
        const secretAccessKey =
          imageServices[SETTINGS_KEYS.AWS]?.secretAccessKey;
        if (!bucket || !region || !accessKeyId || !secretAccessKey)
          throw new Error("AWS settings are not configured.");

        AWS.config.update({ accessKeyId, secretAccessKey, region });
        const s3 = new AWS.S3();
        const params = {
          Bucket: bucket,
          Key: file.name,
          Body: file,
          ACL: "public-read",
        };

        const uploadResult = await s3.upload(params).promise();
        imageUrl = uploadResult.Location;
      }

      onSuccess(imageUrl, file);

      // Save metadata to backend
      await apiClient.post(
        "/images",
        {
          fileName: file.name,
          service: selectedService,
          imageUrl,
        },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      onError(error);
    }
  };

  return (
    <div>
      <Card
        title="Multi Image Uploader"
        bordered={false}
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Radio.Group
          onChange={handleServiceChange}
          value={selectedService}
          style={{ marginBottom: "20px" }}
        >
          {imageServices[SETTINGS_KEYS.IMGBB] && (
            <Radio value="imgbb">ImgBB</Radio>
          )}
          {imageServices[SETTINGS_KEYS.CLOUDINARY] && (
            <Radio value="cloudinary">Cloudinary</Radio>
          )}
          {imageServices[SETTINGS_KEYS.AWS] && <Radio value="aws">AWS</Radio>}
        </Radio.Group>

        <Dragger
          accept={allowedImageTypes.join(",")}
          customRequest={handleUpload}
          multiple
          listType="picture"
          showUploadList={{ showRemoveIcon: true }}
          beforeUpload={(file) => {
            const isValid = allowedImageTypes.includes(file.type);
            if (!isValid) {
              message.error(`${file.name} is not a valid image file.`);
            }
            return isValid || Upload.LIST_IGNORE;
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for multiple image files. Only image files are allowed.
          </p>
        </Dragger>
      </Card>
    </div>
  );
};

export default MultiImageUploader;
