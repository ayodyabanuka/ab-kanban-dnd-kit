import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id, Task } from "../utils/types";
import TrashIcon from "../../../public/icons/TrashIcon";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { MdDragIndicator } from "react-icons/md";

interface Props {
       task: Task;
       deleteTask: (id: Id) => void;
       updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
       const [editMode, setEditMode] = useState(true);

       const {
              setNodeRef,
              attributes,
              listeners,
              transform,
              transition,
              isDragging,
       } = useSortable({
              id: task.id,
              data: {
                     type: "Task",
                     task,
              },
              disabled: editMode,
       });

       const style = {
              transition,
              transform: CSS.Transform.toString(transform),

       };

       const toggleEditMode = () => {
              setEditMode((prev) => !prev);
       };

       if (isDragging) {
              return (
                     <div
                            ref={setNodeRef}
                            style={style}
                            className=" opacity-30 h-20 p-6 items-center flex text-left rounded-xl border-2 border-green-800  cursor-grab relative" />
              );
       }

       if (editMode) {
              return (
                     <div
                            ref={setNodeRef}
                            style={style}
                            {...attributes}
                            {...listeners}
                            className="bg-white p-6 h-fit items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-green-800 cursor-grab relative"
                     >
                            <textarea
                                   className="h-[150px] w-full resize-none border-none rounded bg-transparent text-black focus:outline-none"
                                   value={task.content}
                                   autoFocus
                                   placeholder="Task content here"
                                   onBlur={toggleEditMode}
                                   onKeyDown={(e) => {
                                          if (e.key === "Enter" && e.shiftKey) {
                                                 toggleEditMode();
                                          }
                                   }}
                                   onChange={(e) => updateTask(task.id, e.target.value)}
                            />
                     </div>
              );
       }

       return (
              <div
                     ref={setNodeRef}
                     style={{ userSelect: 'none' }}
                     {...attributes}
                     {...listeners}
                     onClick={toggleEditMode}

                     className="bg-white p-6 h-fit text-black flex text-left rounded-xl hover:ring-1 hover:ring-inset hover:ring-green-800 cursor-grab relative"
              >

                     <p className="w-full h-fit">
                            {task.content}
                     </p>
                     <Dropdown>
                            <DropdownTrigger>
                                   <button className="bg-white rounded-full h-6 w-6 flex justify-center items-center"

                                   >
                                          <IoMdMore />
                                   </button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                   <DropdownItem key="delete" className="text-danger" color="danger"><button
                                          onClick={() => {
                                                 deleteTask(task.id);
                                          }}
                                          className="w-full">
                                          Delete
                                   </button>
                                   </DropdownItem>
                            </DropdownMenu>
                     </Dropdown>


              </div>
       );
}

export default TaskCard;