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
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import {
  ApplicationLevelCourse,
  CourseLevel,
  CourseType,
  SubscriptionDurationType,
  LiveSession,
} from "@/models/CourseModel";
import { useRouter } from "next/navigation";
import ChaptersModal from "@/components/forms/inputs/ChaptersModal";
import ImageSelection from "@/components/forms/inputs/ImageSelection";
import InstructorSelection from "@/components/forms/inputs/InstructorSelection";
import LiveCourseInfo from "@/components/forms/inputs/LiveCourseInfo";
import RichTextEditor from "@/components/forms/inputs/RichTextEditor";
import LiveSessionsModal from "./inputs/LiveSessionsModal";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface CourseFormProps {
  course?: ApplicationLevelCourse;
}

const CourseForm: React.FC<CourseFormProps> = ({ course }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [chapters, setChapters] = useState(course?.chapters || []);
  const [sessions, setSessions] = useState(course?.liveCourse?.sessions || []);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);
  const [isLiveSessionsModalOpen, setIsLiveSessionsModalOpen] = useState(false);

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        ...course,
        subscription: {
          dateRange: course.subscription?.startDate
            ? [
                dayjs(course.subscription.startDate),
                dayjs(course.subscription.endDate),
              ]
            : [],
          recurrenceType:
            course.subscription?.recurrenceType ||
            SubscriptionDurationType.PERMANENT,
        },
      });
    }
  }, [course, form]);

  const handleCourseTypeChange = (value: CourseType) => {
    if (value === CourseType.LIVE) setChapters([]);
  };

  const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    form.setFieldsValue({
      "subscription.startDate": dates ? dates[0] : null,
      "subscription.endDate": dates ? dates[1] : null,
    });
  };

  const onSessionsChange = (updatedSessions: LiveSession[]) => {
    setSessions(updatedSessions);
  };

  const onFinish = async (values: any) => {
    const { dateRange, ...otherSubscription } = values.subscription || {};
    const startDate = dateRange ? dateRange[0]?.toISOString() : null;
    const endDate = dateRange ? dateRange[1]?.toISOString() : null;

    const courseData: ApplicationLevelCourse = {
      ...values,
      chapters,
      subscription: {
        ...otherSubscription,
        startDate,
        endDate,
      },
      liveCourse: { sessions },
    };

    console.log(courseData); // Debugging output

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
      message.error("An error occurred while saving the course.");
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
          <Select onChange={handleCourseTypeChange}>
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

        <InstructorSelection />

        <Form.Item
          label="Subscription Type"
          name={["subscription", "recurrenceType"]}
          rules={[
            { required: true, message: "Please select the subscription type!" },
          ]}
        >
          <Select placeholder="Select subscription type">
            {Object.values(SubscriptionDurationType).map((type) => (
              <Option key={type} value={type}>
                {type.replace("_", " ").toUpperCase()}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.subscription?.recurrenceType !==
            curValues.subscription?.recurrenceType
          }
        >
          {({ getFieldValue }) => {
            const type = getFieldValue(["subscription", "recurrenceType"]);
            if (
              type &&
              type !== SubscriptionDurationType.PERMANENT &&
              type !== SubscriptionDurationType.SCHOOL_YEAR &&
              type !== SubscriptionDurationType.FIXED
            ) {
              return (
                <Form.Item
                  label="Recurrence"
                  name={["subscription", "recurrence"]}
                  rules={[
                    { required: true, message: "Please enter recurrence!" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="e.g. 1"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.subscription?.recurrenceType !==
            curValues.subscription?.recurrenceType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(["subscription", "recurrenceType"]) ==
              SubscriptionDurationType.FIXED && (
              <Form.Item
                label="Date Range"
                name={["subscription", "dateRange"]}
                rules={[
                  { required: true, message: "Please select the date range!" },
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={handleDateRangeChange}
                />
              </Form.Item>
            )
          }
        </Form.Item>

        {form.getFieldValue("courseType") === CourseType.LIVE && (
          <>
            <Button
              type="dashed"
              style={{ marginTop: 20 }}
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
        {form.getFieldValue("courseType") === CourseType.SELF_PACED && (
          <>
            <Button
              type="dashed"
              style={{ marginTop: 20 }}
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
