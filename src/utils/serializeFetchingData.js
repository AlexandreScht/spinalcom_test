export const serializeFetchingBuildingData = (value) => {
  const [building] = value.children;
  return {
    name: building.name,
    type: building.type,
    context: building.context,
    floors: building.children?.map(floor => ({
      name: floor.name,
      type: floor.type,
      id: floor.dynamicId,
      rooms: floor.children?.map(room => ({
        name: room.name,
        type: room.type,
        id: room.dynamicId
      }))
    }))
  };
};

export const serializeFetchingRoomData = (value, id) => {
  const [room] = value;
  if (!room) {
    return { roomId: id, endpoints: null}
  }
  return {
    roomId: id,
    endpoints: room.endpoints?.map(data => ({
      [data.name]: data.currentValue,
      endpointId: data.dynamicId
    }))
  };
};