const routes = {
  api: {
    geoGraphicContext: () => '/geographicContext/space',
    roomData: (id) => `/room/${id}/control_endpoint_list`,
  },
};

export default routes;
