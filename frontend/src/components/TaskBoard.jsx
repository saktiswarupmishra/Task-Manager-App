import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './TaskBoard.css';

const COLUMNS = [
  { id: 'pending', title: 'Pending', className: 'pending' },
  { id: 'in-progress', title: 'In Progress', className: 'in-progress' },
  { id: 'completed', title: 'Completed', className: 'completed' },
];

const TaskBoard = ({ tasks, onEdit, onDelete, onToggleStatus, onReorder }) => {
  const getColumnTasks = (status) => {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Compute new task list
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Remove task from source column
    const sourceTasks = getColumnTasks(sourceStatus).filter((t) => t._id !== draggableId);
    // Get dest column tasks (if same column, use modified source)
    let destTasks;
    if (sourceStatus === destStatus) {
      destTasks = sourceTasks;
    } else {
      destTasks = [...getColumnTasks(destStatus)];
    }

    // Find the dragged task
    const draggedTask = tasks.find((t) => t._id === draggableId);
    if (!draggedTask) return;

    // Insert at destination index
    const updatedTask = { ...draggedTask, status: destStatus };
    destTasks.splice(destination.index, 0, updatedTask);

    // Build reorder payload
    const reorderData = [];

    // Update source column orders
    if (sourceStatus !== destStatus) {
      sourceTasks.forEach((t, idx) => {
        reorderData.push({ id: t._id, order: idx, status: sourceStatus });
      });
    }

    // Update destination column orders
    destTasks.forEach((t, idx) => {
      reorderData.push({ id: t._id, order: idx, status: destStatus });
    });

    onReorder(reorderData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="task-board" id="task-board">
        {COLUMNS.map((col) => {
          const columnTasks = getColumnTasks(col.id);
          return (
            <div className={`board-column ${col.className}`} key={col.id} id={`board-col-${col.id}`}>
              <div className="board-column-header">
                <div className="board-column-title">
                  <span className="board-column-dot"></span>
                  {col.title}
                </div>
                <span className="board-column-count">{columnTasks.length}</span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`board-column-tasks ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="board-empty">Drop tasks here</div>
                    )}
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <TaskCard
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                            provided={provided}
                            isDragging={snapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
