import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  InputNumber,
  Select,
  DatePicker,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import dayjs, { Dayjs } from "dayjs";

import { useRouter } from "next/navigation";
import apiClient from "@/utils/api/apiClient";
import ImageSelection from "../inputs/ImageSelection";
import LiveSessionsModal from "../inputs/LiveSessionsModal";
import RichTextEditor from "../inputs/RichTextEditor";
import ChaptersModal from "../modals/ChaptersModal";
import DynamicDropdown from "../inputs/DynamicDropdown";
import {
  ApplicationLevelCourseAPI,
  CourseAPI,
  CourseLevel,
  CourseType,
} from "@/models/CourseModel";
import { SubscriptionDurationType } from "@/models/Courses/SubscriptionType";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface CourseFormProps {
  course?: CourseAPI;
}

const CourseForm: React.FC<CourseFormProps> = ({ course }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [chapters, setChapters] = useState(course?.chapters || []);
  const [sessions, setSessions] = useState(course?.liveCourse?.sessions || []);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const [isLiveSessionsModalOpen, setIsLiveSessionsModalOpen] = useState(false);
  const [courseType, setCourseType] = useState<CourseType | undefined>(
    course?.courseType
  );
  const [recurrenceType, setRecurrenceType] =
    useState<SubscriptionDurationType>(
      course?.subscriptionType?.recurrenceType ||
        SubscriptionDurationType.PERMANENT
    );

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        ...course,
        subscription: {
          dateRange: course.subscriptionType?.startDate
            ? [
                dayjs(course.subscriptionType.startDate),
                dayjs(course.subscriptionType.endDate),
              ]
            : [],
          recurrenceType:
            course.subscriptionType?.recurrenceType ||
            SubscriptionDurationType.PERMANENT,
          recurrence: course.subscriptionType?.recurrence || "1",
        },
      });
    }
  }, [course, form]);

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    form.setFieldsValue({
      "subscription.startDate":
        dates && dates[0] ? dates[0].toISOString() : null,
      "subscription.endDate": dates && dates[1] ? dates[1].toISOString() : null,
    });
  };

  const handleRecurrenceTypeChange = (value: SubscriptionDurationType) => {
    setRecurrenceType(value);
    form.setFieldsValue({ "subscription.recurrenceType": value });
  };

  const onFinish = async (values: any) => {
    const { dateRange, recurrenceType, recurrence, ...otherSubscription } =
      values.subscription || {};
    const startDate = dateRange ? dateRange[0]?.toISOString() : undefined;
    const endDate = dateRange ? dateRange[1]?.toISOString() : undefined;

    const courseData: ApplicationLevelCourseAPI = {
      ...values,
      chapters,
      subscriptionType: {
        ...otherSubscription,
        recurrenceType,
        startDate,
        endDate,
        recurrence,
      },
      liveCourse: { sessions },
    };

    try {
      if (course?._id) {
        await apiClient.put(`/courses/${course._id}`, courseData);
        message.success("Course updated successfully!");
      } else {
        await apiClient.post("/courses", courseData);
        message.success("Course created successfully!");
      }
      router.push("/dashboard/courses");
    } catch (error) {
      message.error("An error occurred while saving the course.");
    }
  };

  return (
    <Card
      title={course ? "Edit Course" : "Create Course"}
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={(changedValues) => {
          if (changedValues.courseType) {
            setCourseType(changedValues.courseType);
          }
        }}
      >
        <Form.Item
          label="Course Title"
          name="title"
          rules={[{ required: true, message: "Please enter a course title." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Course Highlights"
          name="highlights"
          rules={[
            { required: true, message: "Please provide course highlights." },
          ]}
          valuePropName="value"
          getValueFromEvent={(e) => e}
        >
          <RichTextEditor />
        </Form.Item>

        <Form.Item
          label="Course Description"
          name="description"
          rules={[
            { required: true, message: "Please provide a course description." },
          ]}
          valuePropName="value"
          getValueFromEvent={(e) => e}
        >
          <RichTextEditor />
        </Form.Item>

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
          label="Course Type"
          name="courseType"
          rules={[{ required: true }]}
        >
          <Select>
            {Object.values(CourseType).map((type) => (
              <Option key={type} value={type}>
                {type.replace("-", " ").toUpperCase()}
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
        <Form.Item
          label="Instructor"
          name="instructorId"
          rules={[{ required: true, message: "Please select an instructor!" }]}
        >
          <DynamicDropdown
            endpoint="/instructors"
            valueKey="_id"
            labelKey="username"
            placeholder="Select an instructor"
          />
        </Form.Item>
        <Form.Item label="Subscription" required>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <Form.Item
              name={["subscription", "recurrenceType"]}
              style={{ flex: "1 1 50%" }}
              rules={[
                { required: true, message: "Please select a recurrence type." },
              ]}
            >
              <Select
                placeholder="Recurrence Type"
                onChange={(value: SubscriptionDurationType) => {
                  handleRecurrenceTypeChange(value);
                  form.setFieldsValue({
                    subscription: { recurrenceType: value },
                  });
                }}
                options={Object.values(SubscriptionDurationType).map(
                  (type) => ({
                    label: type.replace("_", " ").toUpperCase(),
                    value: type,
                  })
                )}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Start/End Dates (Only for Fixed Type) */}
            {recurrenceType === SubscriptionDurationType.FIXED && (
              <Form.Item
                name={["subscription", "dateRange"]}
                style={{ flex: "1 1 50%" }}
                rules={[
                  { required: true, message: "Please select a date range." },
                ]}
              >
                <RangePicker
                  onChange={handleDateRangeChange}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}

            {/* Recurrence Input (Only for Recurring Types) */}
            {[
              SubscriptionDurationType.DAY,
              SubscriptionDurationType.WEEK,
              SubscriptionDurationType.MONTH,
              SubscriptionDurationType.YEAR,
            ].includes(recurrenceType) && (
              <Form.Item
                name={["subscription", "recurrence"]}
                style={{ flex: "1 1 50%" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a recurrence value.",
                  },
                ]}
              >
                <Input
                  placeholder="Recurrence (e.g., 1, 2...)"
                  onChange={(e) =>
                    form.setFieldsValue({
                      subscription: { recurrence: e.target.value },
                    })
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </div>
        </Form.Item>

        {courseType === CourseType.LIVE && (
          <>
            <Button
              type="dashed"
              onClick={() => setIsLiveSessionsModalOpen(true)}
              block
              icon={<PlusOutlined />}
            >
              Manage Live Sessions
            </Button>
            <LiveSessionsModal
              isOpen={isLiveSessionsModalOpen}
              onClose={() => setIsLiveSessionsModalOpen(false)}
              sessions={sessions}
              setSessions={setSessions}
            />
          </>
        )}

        {courseType === CourseType.SELF_PACED && (
          <>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Chapters: {chapters.length} | Videos:
              {chapters.reduce(
                (total, chapter) => total + (chapter.videos?.length || 0),
                0
              )}
            </div>
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
