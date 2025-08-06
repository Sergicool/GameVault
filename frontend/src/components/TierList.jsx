import GameCard from './GameCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TierList({
  tiers,
  gamesByTier,
  editable = false,
  onDragEnd,
  unassignedGames = [],
}) {
  if (!editable) {
    // Modo solo lectura
    return (
      <div className="p-6">
        <h1 className="text-3xl text-white font-bold mb-6">Tier List</h1>
        {tiers.map((tier) => (
          <div key={tier.name} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: tier.color }}>{tier.name}</h2>
            <div className="flex flex-wrap gap-4 p-2 min-h-[120px] bg-gray-800 rounded">
              {(gamesByTier[tier.name] || []).map((game) => (
                <div key={game.name}>
                  <GameCard game={game} inTierList />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Modo editable con drag & drop
  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Editar Tier List</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {tiers.map((tier) => (
          <div key={tier.name} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: tier.color }}>{tier.name}</h2>
            <Droppable droppableId={tier.name} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 p-2 min-h-[120px] bg-gray-800 rounded"
                >
                  {(gamesByTier[tier.name] || []).map((game, index) => (
                    <Draggable key={game.name} draggableId={game.name} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <GameCard game={game} inTierList />
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

        {/* Área sin asignar */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-white">No asignados</h2>
          <Droppable droppableId="unassigned" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-4 p-2 min-h-[120px] bg-gray-700 rounded"
              >
                {unassignedGames.map((game, index) => (
                  <Draggable key={game.name} draggableId={game.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GameCard game={game} inTierList />
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
