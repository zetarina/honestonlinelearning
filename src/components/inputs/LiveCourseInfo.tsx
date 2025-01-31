import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  List,
  Select,
  Space,
  Divider,
  TimePicker,
  Button,
  Card,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface ZoomSlot {
  startTimeUTC: string;
  endTimeUTC: string;
  zoomLink: string;
}

interface LiveSession {
  dayOfWeek: string;
  slots: ZoomSlot[];
}

interface LiveCourseInfoProps {
  initialSessions: LiveSession[];
  onSessionsChange: (sessions: LiveSession[]) => void;
}

const LiveCourseInfo: React.FC<LiveCourseInfoProps> = ({
  initialSessions,
  onSessionsChange,
}) => {
  const [sessions, setSessions] = useState<LiveSession[]>(initialSessions);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  const addSlot = (day: string) => {
    const existingSession = sessions.find(
      (session) => session.dayOfWeek === day
    );

    if (existingSession) {
      existingSession.slots.push({
        startTimeUTC: "",
        endTimeUTC: "",
        zoomLink: "",
      });
      setSessions([...sessions]);
    } else {
      const newSessions = [
        ...sessions,
        {
          dayOfWeek: day,
          slots: [{ startTimeUTC: "", endTimeUTC: "", zoomLink: "" }],
        },
      ];
      setSessions(newSessions);
      onSessionsChange(newSessions);
    }
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSessions = [...sessions];
    updatedSessions[dayIndex].slots.splice(slotIndex, 1);
    if (updatedSessions[dayIndex].slots.length === 0) {
      updatedSessions.splice(dayIndex, 1);
    }
    setSessions(updatedSessions);
    onSessionsChange(updatedSessions);
  };

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof ZoomSlot,
    value: string
  ) => {
    const updatedSessions = [...sessions];
    updatedSessions[dayIndex].slots[slotIndex][field] = value;
    setSessions(updatedSessions);
    onSessionsChange(updatedSessions);
  };

  return (
    <div style={{ padding: "16px" }}>
      <Select
        placeholder="Select a Day to Add"
        style={{ width: "100%", marginBottom: "16px" }}
        onChange={(day) => addSlot(day)}
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <Option key={day} value={day}>
            {day}
          </Option>
        ))}
      </Select>

      <Divider>Zoom Slots by Day</Divider>

      {sessions.map((session, dayIndex) => (
        <Card
          key={session.dayOfWeek}
          title={session.dayOfWeek}
          style={{ marginBottom: "16px" }}
        >
          {session.slots.map((slot, slotIndex) => (
            <Space
              key={slotIndex}
              align="center"
              style={{ width: "100%", marginBottom: "8px" }}
            >
              <TimePicker
                value={
                  slot.startTimeUTC ? dayjs(slot.startTimeUTC, "HH:mm") : null
                }
                onChange={(time) =>
                  updateSlot(
                    dayIndex,
                    slotIndex,
                    "startTimeUTC",
                    time?.format("HH:mm") || ""
                  )
                }
                format="HH:mm"
                placeholder="Start Time"
                style={{ flex: 1 }}
              />
              <TimePicker
                value={slot.endTimeUTC ? dayjs(slot.endTimeUTC, "HH:mm") : null}
                onChange={(time) =>
                  updateSlot(
                    dayIndex,
                    slotIndex,
                    "endTimeUTC",
                    time?.format("HH:mm") || ""
                  )
                }
                format="HH:mm"
                placeholder="End Time"
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Zoom Link"
                value={slot.zoomLink}
                onChange={(e) =>
                  updateSlot(dayIndex, slotIndex, "zoomLink", e.target.value)
                }
                style={{ flex: 2 }}
              />
              <Button
                icon={<MinusCircleOutlined />}
                onClick={() => removeSlot(dayIndex, slotIndex)}
                danger
              />
            </Space>
          ))}

          <Button
            type="dashed"
            onClick={() => addSlot(session.dayOfWeek)}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: "8px" }}
          >
            Add Another Slot for {session.dayOfWeek}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default LiveCourseInfo;
