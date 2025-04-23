export function computeClusterCentersBySize(nodes, width, height, spacing = 190) {
    // 1. Group nodes by archetype
    const clusterMap = {}
    nodes.forEach(node => {
      if (!clusterMap[node.archetype]) clusterMap[node.archetype] = []
      clusterMap[node.archetype].push(node)
    })
  
    // 2. Calculate total size per cluster
    const clustersWithSize = Object.entries(clusterMap).map(([archetype, group]) => {
      const totalSize = group.reduce((sum, n) => sum + Math.pow(n.size / 1.1, 2), 0)

      return { archetype: +archetype, totalSize }
    })
  
    // 3. Sort by size ASCENDING
    clustersWithSize.sort((a, b) => b.totalSize - a.totalSize)  // Descending, biggest first

  
    // 4. Zigzag assign (smallest to sides, largest center)
    const ordered = []
    const mid = Math.floor(clustersWithSize.length / 2)
    for (let i = 0; i < clustersWithSize.length; i++) {
      if (i % 2 === 0) {
        ordered.unshift(clustersWithSize[i]) // insert left
      } else {
        ordered.push(clustersWithSize[i]) // insert right
      }
    }
  
    // 5. Assign positions
    const cx = width / 2 + 120
    const cy = height / 2
    const clusterCenters = []
  
    ordered.forEach((cluster, i) => {
      const offset = i - Math.floor(ordered.length / 2)
      clusterCenters[cluster.archetype] = {
        x: cx + offset * spacing,
        y: cy
      }
    })
  
    return clusterCenters
  }
  