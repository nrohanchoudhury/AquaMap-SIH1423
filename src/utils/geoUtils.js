/**
 * Haversine distance between two lat/lng points in kilometers.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

/**
 * Calculates perpendicular distance from a point to a line segment in lat/lng coordinate space.
 */
function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const l2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
  if (l2 === 0) return calculateHaversineDistance(py, px, ay, ax);

  let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = ax + t * (bx - ax);
  const projY = ay + t * (by - ay);

  return calculateHaversineDistance(py, px, projY, projX);
}

/**
 * Identifies the nearest pipeline segment to a given latitude and longitude.
 */
export function findNearestPipeline(lat, lng, pipelines) {
  if (!pipelines || pipelines.length === 0) return null;

  let minDistance = Infinity;
  let nearestPipe = null;

  pipelines.forEach((pipe) => {
    const coords = pipe.coords;
    for (let i = 0; i < coords.length - 1; i++) {
      const [latA, lngA] = coords[i];
      const [latB, lngB] = coords[i + 1];

      const dist = pointToSegmentDistance(lng, lat, lngA, latA, lngB, latB);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPipe = {
          ...pipe,
          distanceKm: parseFloat(dist.toFixed(3)),
          distanceMeters: Math.round(dist * 1000)
        };
      }
    }
  });

  return nearestPipe;
}

/**
 * Analyzes complaints to find the pipeline with the highest complaint concentration (Hotspot).
 */
export function calculateHotspots(complaints, pipelines) {
  const counts = {};
  complaints.forEach((cmp) => {
    if (cmp.status !== 'Resolved' && cmp.pipelineId) {
      counts[cmp.pipelineId] = (counts[cmp.pipelineId] || 0) + 1;
    }
  });

  let maxCount = 0;
  let hotspotPipeId = null;

  Object.entries(counts).forEach(([pipeId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      hotspotPipeId = pipeId;
    }
  });

  const hotspotPipeline = pipelines.find((p) => p.id === hotspotPipeId);
  return {
    hotspotPipeline,
    activeComplaintCount: maxCount
  };
}
