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
        { x:  0.58, y: 0.8, z:  1.15, radius: 0.057, depth: 0.15 },
        { x:  0.60, y: 0.8, z:  0.00, radius: 0.048, depth: 0.15 },
        { x:  0.58, y: 0.8, z: -1.15, radius: 0.057, depth: 0.15 },
        { x: -0.58, y: 0.8, z: -1.15, radius: 0.057, depth: 0.15 },
        { x: -0.60, y: 0.8, z:  0.00, radius: 0.048, depth: 0.15 },
        { x: -0.58, y: 0.8, z:  1.15, radius: 0.057, depth: 0.15 },
    ],


    cushions: [
    { type: 'line', y: 0.76, x1: -0.600, z1: -1.020, x2: -0.600, z2: -0.100, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.600, z1:  0.100, x2: -0.600, z2:  1.020, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1:  0.600, z1: -1.020, x2:  0.600, z2: -0.100, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1:  0.600, z1:  0.100, x2:  0.600, z2:  1.020, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.450, z1:  1.170, x2:  0.450, z2:  1.170, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.450, z1: -1.170, x2:  0.450, z2: -1.170, thickness: 0.09, height: 0.05, borderRadius: 0.02 },

    ],
    woods: [
    { type: 'line', y: 0.78, x1: -0.49, z1:  1.2, x2:  0.49, z2:  1.2, thickness: 0.11, height: 0.08 },
    { type: 'line', y: 0.78, x1: -0.49, z1: -1.2, x2:  0.49, z2: -1.2, thickness: 0.11, height: 0.08 },
    { type: 'line', y: 0.78, x1: -0.64, z1: -1.06, x2: -0.64, z2: -0.10, thickness: 0.11, height: 0.08 },
    { type: 'line', y: 0.78, x1: -0.64, z1:  0.10, x2: -0.64, z2:  1.06, thickness: 0.11, height: 0.08 },
    { type: 'line', y: 0.78, x1:  0.64, z1: -1.06, x2:  0.64, z2: -0.10, thickness: 0.11, height: 0.08 },
    { type: 'line', y: 0.78, x1:  0.64, z1:  0.10, x2:  0.64, z2:  1.06, thickness: 0.11, height: 0.08 }
        ]


};

export const CueData = {
    modelPath: '/models/cueStick/stick.glb',
    texturePath: '/models/cueStick/textures/pool_cue_cue_mat_BaseColor.1001.png',
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    position: { x: 0.72, y: 0.9, z: 0.52 }
};
