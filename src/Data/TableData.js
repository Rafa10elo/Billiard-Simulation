export const TableData = {
    surfaceY: 0.8,
    modelPath: '/models/poolTable/pooltable.glb',
    texturePath: '/models/poolTable/textures/pool_table_low_pool_table_mat_BaseColor.png',
    scale: { x: 1.0, y: 1.0, z: 1.0 },
    position: { x: 0, y: 0, z: 0 },
    bounds: {
        minX: -0.66,
        maxX: 0.66,
        minZ: -1.22,
        maxZ: 1.22
    },
    pockets: [
        { x: -0.58, y: 0.8, z: -1.15, radius: 0.057, depth: 0.15 },
        { x:  0.58, y: 0.8, z: -1.15, radius: 0.057, depth: 0.15 },
        { x: -0.58, y: 0.8, z:  1.15, radius: 0.057, depth: 0.15 },
        { x:  0.58, y: 0.8, z:  1.15, radius: 0.057, depth: 0.15 },
        { x: -0.60, y: 0.8, z:  0.00, radius: 0.048, depth: 0.15 },
        { x:  0.60, y: 0.8, z:  0.00, radius: 0.048, depth: 0.15 }
    ],
    cushions: [
        { type: 'line', y: 0.76, x1: -0.600, z1: -1.020, x2: -0.600, z2: -0.130, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        { type: 'line', y: 0.76, x1: -0.600, z1:  0.130, x2: -0.600, z2:  1.020, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        { type: 'line', y: 0.76, x1:  0.600, z1: -1.020, x2:  0.600, z2: -0.130, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        { type: 'line', y: 0.76, x1:  0.600, z1:  0.130, x2:  0.600, z2:  1.020, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        { type: 'line', y: 0.76, x1: -0.450, z1:  1.170, x2:  0.450, z2:  1.170, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        { type: 'line', y: 0.76, x1: -0.450, z1: -1.170, x2:  0.450, z2: -1.170, thickness: 0.09, height: 0.04, borderRadius: 0.02 },
        
        { type: 'arc', cx:  0.55,  cy: 0.8, cz:  1.10,  radius: 0.095, startAngle: Math.PI * 1.05, endAngle: Math.PI * 1.45, thickness: 0.04, height: 0.08 },
        { type: 'arc', cx:  0.55,  cy: 0.8, cz: -1.10,  radius: 0.095, startAngle: Math.PI * 1.55, endAngle: Math.PI * 1.95, thickness: 0.04, height: 0.08 },
        { type: 'arc', cx: -0.55,  cy: 0.8, cz:  1.10,  radius: 0.095, startAngle: Math.PI * 0.55, endAngle: Math.PI * 0.95, thickness: 0.04, height: 0.08 },
        { type: 'arc', cx: -0.55,  cy: 0.8, cz: -1.10,  radius: 0.095, startAngle: Math.PI * 0.05, endAngle: Math.PI * 0.45, thickness: 0.04, height: 0.08 },
        
        { type: 'arc', cx:  0.57,  cy: 0.82, cz:  0.00,  radius: 0.075, startAngle: Math.PI * 1.10, endAngle: Math.PI * 1.90, thickness: 0.04, height: 0.08 },
        { type: 'arc', cx: -0.57,  cy: 0.82, cz:  0.00,  radius: 0.075, startAngle: Math.PI * 0.10, endAngle: Math.PI * 0.90, thickness: 0.04, height: 0.08 }
    ]
};

export const CueData = {
    modelPath: '/models/cueStick/stick.glb',
    texturePath: '/models/cueStick/textures/pool_cue_cue_mat_BaseColor.1001.png',
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    position: { x: 0.72, y: 0.9, z: 0.52 }
};
