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
    // 🧱 Vista de solo lectura (sin edición)
    return (
      <div className="p-6">
        <h1 className="text-3xl text-white text-center font-bold mb-6">Tier List</h1>

        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="flex flex-row items-stretch mb-2 border-2 border-gray-400 rounded overflow-hidden"
          >
            <div
              className="w-32 flex items-center justify-center text-xl font-bold text-center px-2 py-1"
              style={{
                backgroundColor: tier.color,
                color: 'white',
                minWidth: '8rem',
              }}
            >
              {tier.name}
            </div>
            <div className="flex flex-wrap gap-2 p-2 min-h-[110px] bg-gray-900 flex-1">
              {(gamesByTier[tier.name] || []).map((game) => (
                <div key={game.name}>
                  <GameCard game={game} expandible inTierList />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    );
  }

  // 🧱 Vista editable (con drag & drop)
  return (
    <div className="p-6">
      <h1 className="text-3xl text-white text-center font-bold mb-6">Update Data</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="flex flex-row items-stretch mb-2 border border-white rounded overflow-hidden"
          >
            <div
              className="w-32 flex items-center justify-center text-xl font-bold px-2 py-1"
              style={{
                backgroundColor: tier.color,
                color: 'white',
                minWidth: '8rem',
              }}
            >
              {tier.name}
            </div>
            <Droppable droppableId={tier.name} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-2 p-2 min-h-[110px] bg-gray-800 flex-1"
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

        {/* Zona de juegos no asignados */}
        <div className="flex flex-row items-stretch border border-white rounded overflow-hidden">
          <Droppable droppableId="unassigned" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-2 p-2 min-h-[110px] bg-gray-700 flex-1"
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
