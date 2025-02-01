import React from "react";
import { Modal, Button, Card, Space, TimePicker, Input, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { LiveSessionAPI } from "@/models/Courses/LiveSession";
import { ZoomSlotAPI } from "@/models/Courses/ZoomSlot";

interface LiveSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: LiveSessionAPI[];
  setSessions: React.Dispatch<React.SetStateAction<LiveSessionAPI[]>>;
}

const LiveSessionsModal: React.FC<LiveSessionsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  setSessions,
}) => {
  const addSlotToDay = (dayOfWeek: string) => {
    const existingSession = sessions.find(
      (session) => session.dayOfWeek === dayOfWeek
    );

    if (existingSession) {
      existingSession.slots.push({
        startTimeUTC: "",
        endTimeUTC: "",
        zoomLink: "",
      });
      setSessions([...sessions]);
    } else {
      setSessions([
        ...sessions,
        {
          dayOfWeek,
          slots: [{ startTimeUTC: "", endTimeUTC: "", zoomLink: "" }],
        },
      ]);
    }
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedSessions = [...sessions];
    updatedSessions[dayIndex].slots.splice(slotIndex, 1);
    if (updatedSessions[dayIndex].slots.length === 0) {
      updatedSessions.splice(dayIndex, 1);
    }
    setSessions(updatedSessions);
  };

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof ZoomSlotAPI,
    value: string
  ) => {
    const updatedSessions = [...sessions];
    updatedSessions[dayIndex].slots[slotIndex][field] = value;
    setSessions(updatedSessions);
  };

  return (
    <Modal
      title="Manage Live Sessions"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Select
        placeholder="Select a Day to Add"
        onChange={(day) => addSlotToDay(day)}
        style={{ width: "100%", marginBottom: "16px" }}
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
          <Select.Option key={day} value={day}>
            {day}
          </Select.Option>
        ))}
      </Select>

      {sessions.map((session, dayIndex) => (
        <Card
          key={session.dayOfWeek}
          title={`Sessions on ${session.dayOfWeek}`}
          style={{ marginBottom: "16px" }}
          extra={
            <Button
              type="link"
              icon={<MinusCircleOutlined />}
              onClick={() =>
                setSessions(sessions.filter((_, i) => i !== dayIndex))
              }
            />
          }
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
            onClick={() => addSlotToDay(session.dayOfWeek)}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: "8px" }}
          >
            Add Another Slot for {session.dayOfWeek}
          </Button>
        </Card>
      ))}
    </Modal>
  );
};

export default LiveSessionsModal;
