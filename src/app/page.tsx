"use client"

import { useMemo, useState } from "react";
import { Column, Id, Task } from "./utils/types";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import ColumnContainer from "./components/ColumnContainer";
import { createPortal } from "react-dom";
import TaskCard from "./components/TaskCard";

const defaultConts: Column[] = [
       {
              id: "todo",
              title: "TO DO",
       },
       {
              id: "progress",
              title: "IN PROGRESS",
       },
       {
              id: "doing",
              title: "IN REVIEW",
       },
       {
              id: "done",
              title: "COMPLETED",
       },
];

const defaultTasks: Task[] = [
       {
              id: "1",
              columnId: "todo",
              content: "List admin APIs for dashboard",
       },
       {
              id: "2",
              columnId: "todo",
              content:
                     "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
       },
       {
              id: "3",
              columnId: "doing",
              content: "Conduct security testing",
       },
       {
              id: "4",
              columnId: "doing",
              content: "Analyze competitors",
       },
       {
              id: "5",
              columnId: "done",
              content: "Create UI kit documentation",
       },
       {
              id: "6",
              columnId: "done",
              content: "Dev meeting",
       },
       {
              id: "7",
              columnId: "done",
              content: "Deliver dashboard prototype",
       },
       {
              id: "8",
              columnId: "todo",
              content: "Optimize application performance",
       },
       {
              id: "9",
              columnId: "todo",
              content: "Implement data validation",
       },
       {
              id: "10",
              columnId: "todo",
              content: "Design database schema",
       },
       {
              id: "11",
              columnId: "todo",
              content: "Integrate SSL web certificates into workflow",
       },
       {
              id: "12",
              columnId: "doing",
              content: "Implement error logging and monitoring",
       },
       {
              id: "13",
              columnId: "doing",
              content: "Design and implement responsive UI",
       },
];

export default function Home() {
       const [containers, setContainers] = useState<Column[]>(defaultConts)
       const [items, setItems] = useState<Task[]>(defaultTasks)
       const [activeContainer, setActiveContainer] = useState<Column | null>(null);
       const [activeTask, setActiveTask] = useState<Task | null>(null);
       const columnsId = useMemo(() => containers.map((col) => col.id), [containers]);

       const sensors = useSensors(
              useSensor(PointerSensor, {
                     activationConstraint: {
                            distance: 10,
                     },
              })
       );

       const onDragStart = (event: DragStartEvent) => {
              if (event.active.data.current?.type === "Column") {
                     setActiveContainer(event.active.data.current.column);
                     return;
              }

              if (event.active.data.current?.type === "Task") {
                     setActiveTask(event.active.data.current.task);
                     return;
              }
       }

       const onDragEnd = (event: DragEndEvent) => {
              setActiveContainer(null);
              setActiveTask(null);

              const { active, over } = event;
              if (!over) return;

              const activeId = active.id;
              const overId = over.id;

              if (activeId === overId) return;

              const isActiveAColumn = active.data.current?.type === "Column";
              if (!isActiveAColumn) return;

              console.log("DRAG END");

              setContainers((columns) => {
                     const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

                     const overColumnIndex = columns.findIndex((col) => col.id === overId);

                     return arrayMove(columns, activeColumnIndex, overColumnIndex);
              });
       }

       const onDragOver = (event: DragOverEvent) => {
              const { active, over } = event;
              if (!over) return;

              const activeId = active.id;
              const overId = over.id

              if (activeId === overId) return;

              const isActiveATask = active.data.current?.type === "Task";
              const isOverATask = over.data.current?.type === "Task";

              if (!isActiveATask) return;

              // Im dropping a Task over another Task
              if (isActiveATask && isOverATask) {
                     setItems((tasks) => {
                            const activeIndex = tasks.findIndex((t) => t.id === activeId);
                            const overIndex = tasks.findIndex((t) => t.id === overId);

                            if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
                                   // Fix introduced after video recording
                                   tasks[activeIndex].columnId = tasks[overIndex].columnId;
                                   return arrayMove(tasks, activeIndex, overIndex - 1);
                            }

                            return arrayMove(tasks, activeIndex, overIndex);
                     });
              }

              const isOverAColumn = over.data.current?.type === "Column";

              // Im dropping a Task over a column
              if (isActiveATask && isOverAColumn) {
                     setItems((tasks) => {
                            const activeIndex = tasks.findIndex((t) => t.id === activeId);

                            tasks[activeIndex].columnId = overId;
                            console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                            return arrayMove(tasks, activeIndex, activeIndex);
                     });
              }
       }

       const createTask = (columnId: Id) => {
              const newTask: Task = {
                     id: generateId(),
                     columnId,
                     content: `Task ${items.length + 1}`,
              };

              setItems([...items, newTask]);
       }

       const deleteTask = (id: Id) => {
              const newTasks = items.filter((task) => task.id !== id);
              setItems(newTasks);
       }

       const updateTask = (id: Id, content: string) => {
              const newTasks = items.map((task) => {
                     if (task.id !== id) return task;
                     return { ...task, content };
              });

              setItems(newTasks);
       }

       const createNewColumn = () => {
              const columnToAdd: Column = {
                     id: generateId(),
                     title: `Column ${containers.length + 1}`,
              };

              setContainers([...containers, columnToAdd]);
       }

       const deleteColumn = (id: Id) => {
              const filteredColumns = containers.filter((col) => col.id !== id);
              setContainers(filteredColumns);

              const newTasks = items.filter((t) => t.columnId !== id);
              setItems(newTasks);
       }

       const updateColumn = (id: Id, title: string) => {
              const newColumns = containers.map((col) => {
                     if (col.id !== id) return col;
                     return { ...col, title };
              });

              setContainers(newColumns);
       }

       const generateId = () => {
              return Math.floor(Math.random() * 10001);
       }

       return (
              <div className=" bg-[#EBEBEB] flex py-20 w-full overflow-x-auto ">
                     <DndContext
                            sensors={sensors}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDragOver={onDragOver}
                     >
                            <div className="flex gap-4">
                                   <div className="flex gap-4">
                                          <SortableContext items={columnsId}>
                                                 {containers.map((col) => (
                                                        <ColumnContainer
                                                               key={col.id}
                                                               column={col}
                                                               deleteColumn={deleteColumn}
                                                               updateColumn={updateColumn}
                                                               createTask={createTask}
                                                               deleteTask={deleteTask}
                                                               updateTask={updateTask}
                                                               tasks={items.filter((task) => task.columnId === col.id)}
                                                        />
                                                 ))}
                                          </SortableContext>
                                   </div>
                                   <button
                                          onClick={() => {
                                                 createNewColumn();
                                          }}
                                          className="cursor-pointer rounded-lg p-2 bg-green-800 text-white h-fit flex ">

                                          Add Column
                                   </button>

                            </div>

                            {createPortal(
                                   <DragOverlay>
                                          {activeContainer && (
                                                 <ColumnContainer
                                                        column={activeContainer}
                                                        deleteColumn={deleteColumn}
                                                        updateColumn={updateColumn}
                                                        createTask={createTask}
                                                        deleteTask={deleteTask}
                                                        updateTask={updateTask}
                                                        tasks={items.filter(
                                                               (task) => task.columnId === activeContainer.id
                                                        )}
                                                 />
                                          )}
                                          {activeTask && (
                                                 <TaskCard
                                                        task={activeTask}
                                                        deleteTask={deleteTask}
                                                        updateTask={updateTask}
                                                 />
                                          )}
                                   </DragOverlay>,
                                   document.body
                            )}
                     </DndContext>
              </div>
       );
}