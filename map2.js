// Instantiate a map and platform object:
var platform = new H.service.Platform({
  apikey: "6zBvoiInwsV-sCr5ao65EOiulD8_JgvXXZxtra3saWQ",
});

// Get an instance of the geocoding service:
var service = platform.getSearchService();

// Call the geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
service.geocode(
  {
    q: "2598 145th Ave, Grasston, MN 55030",
  },
  (result) => {
    // Add a marker for each location found
    result.items.forEach((item) => {
      map.addObject(new H.map.Marker(item.position));
    });
  },
  alert
);
