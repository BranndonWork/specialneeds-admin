export const addDistanceToResults = (results) => {
  results.forEach((result) => {
    if (result._geo && result._geoDistance) {
      let distanceInMiles = (result._geoDistance / 1609.34).toFixed(2);
      if (distanceInMiles < 1) {
        result.distance = "less than 1 mile away";
      } else {
        distanceInMiles = Math.ceil(distanceInMiles);
        result.distance = `${distanceInMiles} miles away`;
      }
    }
  });
};
