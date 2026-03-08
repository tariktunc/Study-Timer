"use client";
import React, { useState } from "react";
import NewTask from "./newTask";
import Task from "./task";
import EndTask from "./Endtask";
import AddTask from "./addTask";
import EditTask from "./editTask";
import { useSelector, useDispatch } from "react-redux";
import { deleteData, clearCompleted, reorderData } from "@/Redux/Slices/taskSlice";
import TaskCss from "./task.module.scss";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable wrapper for Task items
function SortableTask({ todo, editingTask, openEditTask, removeData, setEditingTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: "100%",
  };

  if (editingTask && editingTask.key === todo.key) {
    return (
      <div ref={setNodeRef} style={style}>
        <EditTask task={todo} onClose={() => setEditingTask(null)} />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Task
        taskId={todo.key}
        text={todo.text}
        sessionCount={todo.totalSessions}
        activeSession={todo.currentSession}
        editTaskClick={openEditTask}
        deleteItem={() => removeData(todo.key)}
        dragListeners={listeners}
      />
    </div>
  );
}

export default function TodoList() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dataAnalysis);
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const removeData = (itemKey) => dispatch(deleteData(itemKey));

  const openEditTask = (taskId) => {
    const task = data.find((d) => d.key === taskId);
    if (task) setEditingTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((d) => d.key === active.id);
    const newIndex = data.findIndex((d) => d.key === over.id);

    const newData = [...data];
    const [movedItem] = newData.splice(oldIndex, 1);
    newData.splice(newIndex, 0, movedItem);
    dispatch(reorderData(newData));
  };

  const activeTasks = data.filter((d) => d.currentSession < d.totalSessions);
  const completedTasks = data.filter((d) => d.currentSession >= d.totalSessions);
  const hasCompleted = completedTasks.length > 0;

  return (
    <div className={TaskCss.todoList}>
      {data.length > 0 && (
        <div className={TaskCss.taskHeader}>
          <h2>Görevler</h2>
          {hasCompleted && (
            <button
              onClick={() => dispatch(clearCompleted())}
              style={{
                fontSize: "var(--font-size-sm)",
                opacity: 0.7,
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              aria-label="Tamamlanan görevleri temizle"
            >
              Temizle
            </button>
          )}
        </div>
      )}

      {/* Sortable active tasks */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeTasks.map((t) => t.key)}
          strategy={verticalListSortingStrategy}
        >
          {activeTasks.map((todo) => (
            <SortableTask
              key={todo.key}
              todo={todo}
              editingTask={editingTask}
              openEditTask={openEditTask}
              removeData={removeData}
              setEditingTask={setEditingTask}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Completed tasks (not sortable) */}
      {completedTasks.map((todo) => (
        <EndTask
          key={todo.key}
          text={todo.text}
          sessionCount={todo.totalSessions}
          activeSession={todo.currentSession}
          deleteItem={() => removeData(todo.key)}
        />
      ))}

      <AddTask onAdd={() => setShowNewTask(!showNewTask)} />

      {showNewTask && (
        <NewTask
          savesTask={() => setShowNewTask(false)}
          cancelTask={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
}
