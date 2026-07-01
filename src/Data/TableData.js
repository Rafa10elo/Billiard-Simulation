export const TableData = {
    surfaceY: 0.8,

    modelPath: '/models/poolTable/pooltable.glb',
    texturePath: '/models/poolTable/textures/pool_table_low_pool_table_mat_BaseColor.png',

    scale: { x: 1.0, y: 1.0, z: 1.0 },
    position: { x: 0, y: 0, z: 0 },

    bounds: {
        minX: -0.52,
        maxX: 0.52,
        minZ: -1.08,
        maxZ: 1.08
    },


   pockets: [

        { x: -0.6, y: 0.8, z: -1.16, radius: 0.09, depth: 0.15 },
        { x:  0.6,  y: 0.8, z: -1.16,  radius: 0.09, depth: 0.15 }, 
        { x: -0.6,  y: 0.8, z:  1.16,  radius: 0.09, depth: 0.15 }, 
        { x:  0.6,  y: 0.8, z:  1.16,  radius: 0.09, depth: 0.15 }, 
        { x: -0.64,  y: 0.8, z:  0.00, radius: 0.09, depth: 0.15 }, 
        { x:  0.64,  y:  0.8, z:  0.00, radius: 0.09, depth: 0.15 }  
    ]
,
    cushions: [
    { type: 'line', x1: -0.57, z1: -1.02, x2: -0.57, z2: -0.09 },
    { type: 'line', x1: -0.57, z1:  0.10, x2: -0.57, z2:  1.04 },

    { type: 'line', x1:  0.57, z1: -1.02, x2:  0.57, z2: -0.10 },
    { type: 'line', x1:  0.57, z1:  0.10, x2:  0.57, z2:  1.04 },

    { type: 'line', x1: -0.47, z1:  1.12, x2:  0.47, z2:  1.12 },
    { type: 'line', x1: -0.47, z1: -1.12, x2:  0.47, z2: -1.12 },


    { type: 'arc', cx:  0.572,  cz:  1.13,  radius: 0.05, startAngle: -Math.PI * 0.3, endAngle:  Math.PI * 0.8},
    { type: 'arc', cx: -0.572,  cz:  1.13,  radius: 0.05, startAngle:  Math.PI * 0.2, endAngle:  Math.PI * 1.4 },
    { type: 'arc', cx:  0.572,  cz: -1.13,  radius: 0.05, startAngle: -Math.PI * 0.8, endAngle:  Math.PI * 0.3 },
    { type: 'arc', cx: -0.572,  cz: -1.13,  radius: 0.05, startAngle:  Math.PI * 0.8, endAngle:  Math.PI * 1.8 },


    { type: 'arc', cx:  0.59, cz:  0.00,  radius: 0.07,  startAngle: -Math.PI * 0.5, endAngle:  Math.PI * 0.5 },
    { type: 'arc', cx: -0.59, cz:  0.00,  radius: 0.07,  startAngle:  Math.PI * 0.5, endAngle:  Math.PI * 1.5 } ]

   
};

export const CueData = {
	modelPath: '/models/cueStick/stick.glb',
	texturePath: '/models/cueStick/textures/pool_cue_cue_mat_BaseColor.1001.png',
	scale: { x: 0.8, y: 0.8, z: 0.8 },
	position: {  x: 0.72, y: 0.9, z: 0.52  }
};
