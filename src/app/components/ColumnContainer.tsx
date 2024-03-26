
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { Column, Id, Task } from "../utils/types";
import TrashIcon from "../../../public/icons/TrashIcon";
import PlusIcon from "../../../public/icons/PlusIcon";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";

interface Props {
       column: Column;
       deleteColumn: (id: Id) => void;
       updateColumn: (id: Id, title: string) => void;
       createTask: (columnId: Id) => void;
       updateTask: (id: Id, content: string) => void;
       deleteTask: (id: Id) => void;
       tasks: Task[];
}

function ColumnContainer({
       column,
       deleteColumn,
       updateColumn,
       createTask,
       tasks,
       deleteTask,
       updateTask,
}: Props) {
       const [editMode, setEditMode] = useState(false);

       const tasksIds = useMemo(() => {
              return tasks.map((task) => task.id);
       }, [tasks]);

       const {
              setNodeRef,
              attributes,
              listeners,
              transform,
              transition,
              isDragging,
       } = useSortable({
              id: column.id,
              data: {
                     type: "Column",
                     column,
              },
              disabled: editMode,
       });

       const style = {
              transition,
              transform: CSS.Transform.toString(transform),
       };

       if (isDragging) {
              return (
                     <div
                            ref={setNodeRef}
                            style={style}
                            className="bg-column BackgroundColor opacity-40 border-2 border-green-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">

                     </div>
              );
       }
       return (
              <div
                     ref={setNodeRef}
                     style={style}
                     className=" w-[350px] rounded-md flex flex-col">
                     <div
                            {...attributes}
                            {...listeners}
                            onClick={() => {
                                   setEditMode(true);
                            }}
                            className="text-md cursor-grab rounded-md rounded-b-none p-3 font-bold flex items-center justify-between"
                     >
                            <div className="flex gap-2 text-sm items-center">
                                   <div className={`p-1 h-fit bg-red-500 rounded-full`}>

                                   </div>
                                   {!editMode && column.title}
                                   {editMode && (
                                          <input
                                                 className=" focus:border-green-700 border text-sm rounded outline-none px-2"
                                                 value={column.title}
                                                 onChange={(e) => updateColumn(column.id, e.target.value)}
                                                 autoFocus
                                                 onBlur={() => {
                                                        setEditMode(false);
                                                 }}
                                                 onKeyDown={(e) => {
                                                        if (e.key !== "Enter") return;
                                                        setEditMode(false);
                                                 }}
                                          />
                                   )}
                                   <div className=" flex justify-center items-center  text-xs bg-white px-2 py-1 rounded-full ">
                                          {tasks.length}
                                   </div>
                            </div>
                            <Dropdown>
                                   <DropdownTrigger>
                                          <button className="bg-white rounded-full h-6 w-6 flex justify-center items-center"

                                          >
                                                 <IoAdd />
                                          </button>
                                   </DropdownTrigger>
                                   <DropdownMenu aria-label="Static Actions">

                                          <DropdownItem key="new">
                                                 <button
                                                        className="w-full"
                                                        onClick={() => {
                                                               createTask(column.id);
                                                        }}
                                                 >
                                                        Add task
                                                 </button>
                                          </DropdownItem>

                                          <DropdownItem key="delete" className="text-danger" color="danger"><button
                                                 onClick={() => {
                                                        deleteColumn(column.id);
                                                 }}
                                                 className="w-full">
                                                 Delete
                                          </button>
                                          </DropdownItem>
                                   </DropdownMenu>
                            </Dropdown>

                     </div>

                     {/* Column task container */}
                     <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden">
                            <SortableContext items={tasksIds}>
                                   {tasks.map((task) => (
                                          <div key={task.id}>
                                                 <TaskCard
                                                        task={task}
                                                        deleteTask={deleteTask}
                                                        updateTask={updateTask}
                                                 />
                                          </div>
                                   ))}
                            </SortableContext>
                     </div>
                     {/* Column footer */}

              </div>
       );
}

export default ColumnContainer;