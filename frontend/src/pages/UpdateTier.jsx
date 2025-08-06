import { useEffect, useState } from 'react';
import { getGames, updateGamesTierList } from '../api/games';
import { getTiers } from '../api/tiers';
import GameCard from '../components/GameCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function UpdateTier() {
  const [tiers, setTiers] = useState([]);
  const [gamesByTier, setGamesByTier] = useState({});
  const [unassignedGames, setUnassignedGames] = useState([]);

  const loadData = async () => {
    const [gamesData, tiersData] = await Promise.all([getGames(), getTiers()]);
    
    // Agregar imagenPreview con timestamp para evitar cache
    const enrichedGames = gamesData.map((game) => ({
      ...game,
      imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(game.name)}?t=${Date.now()}`,
    }));

    // Inicializar estructura por tiers
    const grouped = {};
    tiersData.forEach((tier) => {
      grouped[tier.name] = [];
    });

    const unassigned = [];

    enrichedGames.forEach((game) => {
      if (game.tier && grouped[game.tier]) {
        grouped[game.tier].push(game);
      } else {
        unassigned.push(game);
      }
    });

    // Ordenar internamente por posición y por nombre para los que estan sin asignar
    Object.keys(grouped).forEach(tier => grouped[tier].sort((a, b) => a.position - b.position));
    unassigned.sort((a, b) => a.name.localeCompare(b.name));

    setTiers(tiersData);
    setGamesByTier(grouped);
    setUnassignedGames(unassigned);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const sourceList = sourceId === 'unassigned' ? unassignedGames : gamesByTier[sourceId];
    const destList = destId === 'unassigned' ? unassignedGames : gamesByTier[destId];

    const movedItem = sourceList[source.index];

    // Copias para modificar
    const newSourceList = Array.from(sourceList);
    const newDestList = sourceId === destId ? newSourceList : Array.from(destList);

    // Eliminar de origen
    newSourceList.splice(source.index, 1);

    // Actualizar el tier del juego movido:
    movedItem.tier = destId === 'unassigned' ? null : destId;

    // Insertar en destino
    newDestList.splice(destination.index, 0, movedItem);

    // Actualizar estado
    if (sourceId === destId) {
      if (sourceId === 'unassigned') {
        setUnassignedGames(newSourceList);
      } else {
        setGamesByTier(prev => ({ ...prev, [sourceId]: newSourceList }));
      }
    } else {
      if (sourceId === 'unassigned') {
        setUnassignedGames(newSourceList);
      } else {
        setGamesByTier(prev => ({ ...prev, [sourceId]: newSourceList }));
      }

      if (destId === 'unassigned') {
        setUnassignedGames(newDestList);
      } else {
        setGamesByTier(prev => ({ ...prev, [destId]: newDestList }));
      }
    }
  };

  const handleSave = async () => {
    const allGames = [];

    tiers.forEach((tier) => {
      (gamesByTier[tier.name] || []).forEach((game, idx) => {
        allGames.push({ name: game.name, tier: tier.name, position: idx });
      });
    });

    unassignedGames.forEach((game, idx) => {
      allGames.push({ name: game.name, tier: null, position: idx + 10000 });
    });

    try {
      await updateGamesTierList(allGames);
      alert('Tier list actualizada correctamente');
    } catch (e) {
      alert('Error al actualizar tier list');
      console.error(e);
    }
  };

  if (tiers.length === 0) {
    return <div className="text-white p-6">Cargando tier list...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Editar Tier List</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {tiers.map((tier) => (
          <div key={tier.name} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: tier.color }}>{tier.name}</h2>
            <Droppable droppableId={tier.name} direction="horizontal" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
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
          <Droppable droppableId="unassigned" direction="horizontal" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
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

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Confirmar Cambios
        </button>
      </div>
    </div>
  );
}

export default UpdateTier;
