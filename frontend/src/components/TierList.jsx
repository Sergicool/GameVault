import GameCard from "./GameCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TierList({
  tiers,
  gamesByTier,
  editable = false,
  onDragEnd,
  unassignedGames = [],
}) {
  if (!editable) {
    return (
      <div className="p-6">
        <h1 className="mb-8 text-center font-mono text-4xl font-bold tracking-tight text-gray-100 drop-shadow-md">
          Tier List
        </h1>

        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="mb-2 flex flex-row items-stretch overflow-hidden rounded border-2 border-indigo-500"
          >
            <div
              className="flex w-32 items-center justify-center px-2 py-1 text-center text-xl font-bold"
              style={{
                backgroundColor: tier.color,
                color: "white",
                minWidth: "8rem",
              }}
            >
              {tier.name}
            </div>
            <div className="flex min-h-[110px] flex-1 flex-wrap gap-2 bg-gray-900 p-2">
              {(gamesByTier[tier.name] || []).map((game) => (
                <div key={game.name}>
                  <GameCard game={game} displayIndex={game.position + 1} expandible inTierList />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        Update Data
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="mb-2 flex flex-row items-stretch overflow-hidden rounded border-2 border-indigo-500"
          >
            <div
              className="flex w-32 items-center justify-center px-2 py-1 text-xl font-bold"
              style={{
                backgroundColor: tier.color,
                color: "white",
                minWidth: "8rem",
              }}
            >
              {tier.name}
            </div>
            <Droppable droppableId={tier.name} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex min-h-[110px] flex-1 gap-2 overflow-x-auto bg-gray-900 p-2 whitespace-nowrap"
                  style={{ scrollbarWidth: "thin" }} // opcional para Firefox
                >
                  {(gamesByTier[tier.name] || []).map((game, index) => (
                    <Draggable
                      key={game.name}
                      draggableId={game.name}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            display: "inline-block",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <GameCard game={game} displayIndex={game.position + 1} inTierList />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}

        {/* Zona de juegos no asignados */}
        <div className="flex flex-row items-stretch overflow-hidden rounded border-2 border-indigo-500">
          <Droppable droppableId="unassigned" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex min-h-[110px] flex-1 gap-2 overflow-x-auto bg-gray-950 p-2 whitespace-nowrap"
                style={{ scrollbarWidth: "thin" }}
              >
                {unassignedGames.map((game, index) => (
                  <Draggable
                    key={game.name}
                    draggableId={game.name}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "inline-block",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <GameCard game={game} displayIndex={game.position + 1} inTierList />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

export default TierList;
