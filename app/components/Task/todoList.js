"use client";
import React, { useState, useRef, useEffect } from "react";
import NewTask from "./newTask";
import Task from "./task";
import EndTask from "./Endtask";
import AddTask from "./addTask";
import EditTask from "./editTask";
import { useSelector, useDispatch } from "react-redux";
import { deleteData, clearCompleted, clearAll, clearActPomodoros, reorderData } from "@/Redux/Slices/taskSlice";
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
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [hideTasks, setHideTasks] = useState(false);
  const headerMenuRef = useRef(null);

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

  // Close header menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setShowHeaderMenu(false);
      }
    };
    if (showHeaderMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHeaderMenu]);

  const activeTasks = data.filter((d) => d.currentSession < d.totalSessions);
  const completedTasks = data.filter((d) => d.currentSession >= d.totalSessions);

  const handleClearFinished = () => {
    dispatch(clearCompleted());
    setShowHeaderMenu(false);
  };

  const handleClearActPomodoros = () => {
    dispatch(clearActPomodoros());
    setShowHeaderMenu(false);
  };

  const handleClearAll = () => {
    if (window.confirm("Tüm görevleri silmek istediğinize emin misiniz?")) {
      dispatch(clearAll());
    }
    setShowHeaderMenu(false);
  };

  const handleToggleHide = () => {
    setHideTasks(!hideTasks);
    setShowHeaderMenu(false);
  };

  return (
    <div className={TaskCss.todoList}>
      {data.length > 0 && (
        <>
          <div className={TaskCss.taskHeader}>
            <h2>Görevler</h2>
            <div className={TaskCss.headerMenuWrapper} ref={headerMenuRef}>
              <button
                className={TaskCss.taskMenuBtn}
                onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                aria-label="Görev menüsü"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
              {showHeaderMenu && (
                <div className={TaskCss.taskMenu}>
                  <button className={TaskCss.taskMenuItem} onClick={handleClearFinished}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                    </svg>
                    Tamamlananları Temizle
                  </button>
                  <button className={TaskCss.taskMenuItem} onClick={() => setShowHeaderMenu(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Şablon Kullan
                  </button>
                  <button className={TaskCss.taskMenuItem} onClick={handleClearActPomodoros}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Act Pomodoroları Temizle
                  </button>
                  <button className={TaskCss.taskMenuItem} onClick={handleToggleHide}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {hideTasks ? "Görevleri Göster" : "Görevleri Gizle"}
                  </button>
                  <button className={TaskCss.taskMenuItem} onClick={handleClearAll}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                    </svg>
                    Tüm Görevleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr className={TaskCss.separator} />
        </>
      )}

      {/* Task list - can be hidden */}
      <div className={hideTasks ? TaskCss.hideTasksHidden : undefined}>
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
      </div>

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
