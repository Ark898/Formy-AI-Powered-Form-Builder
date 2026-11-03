"use client";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useBuilder } from "@/context/builder-provider";
import Builder from "./Builder";
import BuilderDragOverlay from "./BuilderDragOverlay";

const FormBuilder = () => {
  const { loading, formData } = useBuilder();
  const isPublished = formData?.published;

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isPublished ? false : true
  );

  if (loading) {
    return (
      <div
        className="w-full 
    flex h-56
     items-center
      justify-center"
      >
        <Loader size="3rem" className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DndContext sensors={sensors}>
        <SidebarProvider
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          className="h-[calc(100vh_-_64px)] "
          style={
            {
              "--sidebar-width": "300px",
              "--sidbar-height": "40px",
            } as React.CSSProperties
          }
        >
          <Builder {...{ isSidebarOpen }} />
          <BuilderDragOverlay />
        </SidebarProvider>
      </DndContext>
    </div>
  );
};

export default FormBuilder;
