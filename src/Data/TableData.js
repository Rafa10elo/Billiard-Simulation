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
    { type: 'line', y: 0.76, x1: -0.600, z1: -1.020, x2: -0.600, z2: -0.100, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.600, z1:  0.100, x2: -0.600, z2:  1.020, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1:  0.600, z1: -1.020, x2:  0.600, z2: -0.100, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1:  0.600, z1:  0.100, x2:  0.600, z2:  1.020, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.450, z1:  1.170, x2:  0.450, z2:  1.170, thickness: 0.09, height: 0.05, borderRadius: 0.02 },
    { type: 'line', y: 0.76, x1: -0.450, z1: -1.170, x2:  0.450, z2: -1.170, thickness: 0.09, height: 0.05, borderRadius: 0.02 },

        //bottom right
    { type: 'line', y: 0.78, x1: 0.4668, z1: 1.1910, x2: 0.5812, z2: 1.2108, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: 0.5912, z1: 1.0408, x2: 0.7012, z2: 1.1320, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: 0.6712, z1: 1.1220, x2: 0.5568, z2: 1.2174, thickness: 0.04, height: 0.10 },
        //top right
    { type: 'line', y: 0.78, x1: 0.4668, z1: -1.1910, x2: 0.5812, z2: -1.2108, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: 0.5912, z1: -1.0408, x2: 0.7012, z2: -1.1320, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: 0.6712, z1: -1.1220, x2: 0.5568, z2: -1.2174, thickness: 0.04, height: 0.10 },

    //bottom left
    { type: 'line', y: 0.78, x1: -0.4668, z1: 1.1910, x2: -0.5812, z2: 1.2108, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: -0.5912, z1: 1.0408, x2: -0.7012, z2: 1.1320, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: -0.6712, z1: 1.1220, x2: -0.5568, z2: 1.2174, thickness: 0.04, height: 0.10 },

    //top left
    { type: 'line', y: 0.78, x1: -0.4668, z1: -1.1910, x2: -0.5812, z2: -1.2108, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: -0.5912, z1: -1.0408, x2: -0.7012, z2: -1.1320, thickness: 0.04, height: 0.10 },
    { type: 'line', y: 0.78, x1: -0.6712, z1: -1.1220, x2: -0.5568, z2: -1.2174, thickness: 0.04, height: 0.10 },

        //middle right
    { type: 'line', y: 0.78, x1: 0.6272, z1: -0.069, x2: 0.6416, z2: -0.0292, thickness: 0.04, height: 0.08, borderRadius: 0.00 },
    { type: 'line', y: 0.78, x1: 0.6416, z1: -0.0292, x2: 0.6416, z2:  0.0292, thickness: 0.04, height: 0.08, borderRadius: 0.00 },
    { type: 'line', y: 0.78, x1: 0.6416, z1:  0.0320, x2: 0.6272, z2:  0.0674, thickness: 0.04, height: 0.08, borderRadius: 0.00 },

        //midle left
    { type: 'line', y: 0.78, x1: -0.6272, z1: 0.069, x2: -0.6416, z2: 0.0292, thickness: 0.04, height: 0.1 },
    { type: 'line', y: 0.78, x1: -0.6416, z1: 0.0292, x2: -0.6416, z2: -0.0292, thickness: 0.04, height: 0.1 },
    { type: 'line', y: 0.78, x1: -0.6416, z1: -0.0320, x2: -0.6272, z2: -0.0674, thickness: 0.04, height: 0.1 }

    
    ]
};

export const CueData = {
    modelPath: '/models/cueStick/stick.glb',
    texturePath: '/models/cueStick/textures/pool_cue_cue_mat_BaseColor.1001.png',
    scale: { x: 0.8, y: 0.8, z: 0.8 },
    position: { x: 0.72, y: 0.9, z: 0.52 }
};
