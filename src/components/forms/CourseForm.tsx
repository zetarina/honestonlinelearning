import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  InputNumber,
  Checkbox,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Course, CourseLevel, DurationType } from "@/models/CourseModel";
import axios from "axios";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import moment from "moment";
import ChaptersModal from "@/components/forms/inputs/ChaptersModal";
import ImageSelection from "@/components/forms/inputs/ImageSelection";
import InstructorSelection from "@/components/forms/inputs/InstructorSelection";
import LiveCourseInfo from "@/components/forms/inputs/LiveCourseInfo";
import RichTextEditor from "@/components/forms/inputs/RichTextEditor";
import { useRouter } from "next/navigation";

const { Option } = Select;

interface CourseFormProps {
  course?: Course;
}

const CourseForm: React.FC<CourseFormProps> = ({ course }) => {
  const [form] = Form.useForm();
  const [chapters, setChapters] = useState(course?.chapters || []);
  const [isLive, setIsLive] = useState<boolean>(course?.isLive || false);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        ...course,
        startDate: course.startDate ? moment(course.startDate) : null,
        endDate: course.endDate ? moment(course.endDate) : null,
        recurrence: course.recurrence || "1",
        thumbnailUrl: course.thumbnailUrl,
      });
      setChapters(course.chapters || []);
      setIsLive(course.isLive || false);
    }
  }, [course, form]);

  const handleLiveChange = (e: CheckboxChangeEvent) => {
    setIsLive(e.target.checked);
    if (e.target.checked) {
      setChapters([]);
    }
  };

  const handleDurationTypeChange = (value: DurationType) => {
    if (value === DurationType.PERMANENT) {
      form.setFieldsValue({ recurrence: undefined });
    }
  };

  const onFinish = async (values: any) => {
    const courseData = {
      ...values,
      chapters: isLive ? [] : chapters,
      liveCourseUrl: isLive ? values.liveCourseUrl : undefined,
      startDate: values.startDate
        ? moment(values.startDate).toISOString()
        : null,
      endDate: values.endDate ? moment(values.endDate).toISOString() : null,
    };

    if (values.durationType === DurationType.PERMANENT) {
      delete courseData.recurrence;
    }

    try {
      if (course?._id) {
        await axios.put(`/api/courses/${course._id}`, courseData);
        message.success("Course updated successfully!");
      } else {
        await axios.post("/api/courses", courseData);
        message.success("Course created successfully!");
      }
      router.push("/dashboard/courses");
    } catch (error) {
      message.error(
        "An error occurred while saving the course. Please try again."
      );
    }
  };

  return (
    <Card
      title={course ? "Edit Course" : "Create Course"}
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Course Title"
          name="title"
          rules={[{ required: true, message: "Please enter a course title." }]}
        >
          <Input />
        </Form.Item>

        <RichTextEditor
          label="Course Description"
          name="description"
          rules={[
            { required: true, message: "Please provide a course description." },
          ]}
        />

        <RichTextEditor
          label="Course Highlights"
          name="highlights"
          rules={[
            { required: true, message: "Please provide course highlights." },
          ]}
        />

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter a category." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Level" name="level" rules={[{ required: true }]}>
          <Select>
            {Object.values(CourseLevel).map((level) => (
              <Option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thumbnail"
          name="thumbnailUrl"
          rules={[{ required: true, message: "Please select a thumbnail!" }]}
        >
          <ImageSelection />
        </Form.Item>

        <InstructorSelection />

        <Form.Item
          label="Course Duration"
          name="durationType"
          rules={[
            {
              required: true,
              message: "Please select the course duration type!",
            },
          ]}
        >
          <Select
            onChange={handleDurationTypeChange}
            placeholder="Select duration type"
          >
            {Object.values(DurationType).map((type) => (
              <Option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {form.getFieldValue("durationType") !== DurationType.PERMANENT && (
          <Form.Item
            label="Recurrence"
            name="recurrence"
            rules={[
              { required: true, message: "Please specify the recurrence!" },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="e.g. 1"
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}

        <Form.Item name="isLive" valuePropName="checked">
          <Checkbox onChange={handleLiveChange}>
            Is this a live course?
          </Checkbox>
        </Form.Item>

        {isLive ? (
          <LiveCourseInfo />
        ) : (
          <>
            <Button
              type="dashed"
              onClick={() => setIsChaptersModalOpen(true)}
              block
              icon={<PlusOutlined />}
            >
              Manage Chapters
            </Button>
            <ChaptersModal
              isOpen={isChaptersModalOpen}
              onClose={() => setIsChaptersModalOpen(false)}
              chapters={chapters}
              setChapters={setChapters}
            />
          </>
        )}

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            {course ? "Update Course" : "Create Course"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseForm;
