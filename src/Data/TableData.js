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
        { x: -0.52, z: -1.08, radius: 0.075 },
        { x:  0.52, z: -1.08, radius: 0.075 }, 
        { x: -0.52, z:  1.08, radius: 0.075 }, 
        { x:  0.52, z:  1.08, radius: 0.075 }, 


        { x: -0.52, z:  0.00, radius: 0.065 }, 
        { x:  0.52, z:  0.00, radius: 0.065 }  
    ],
    cushions: [
    
    { x1: -0.56, z1: -1.02, x2: -0.56, z2: -0.09 },  
    { x1: -0.56, z1: 0.1, x2: -0.56, z2: 1.04},
    
    { x1: 0.56, z1: -1.02, x2: 0.56, z2: -0.1 },  
    { x1: 0.56, z1: 0.1,  x2: 0.56, z2: 1.04 }, 

    { x1: -0.48, z1: 1.12, x2: 0.48, z2: 1.12},

    { x1: -0.48, z1: -1.12, x2: 0.48, z2: -1.12 }
]

   
};

export const CueData = {
	modelPath: '/models/cueStick/stick.glb',
	texturePath: '/models/cueStick/textures/pool_cue_cue_mat_BaseColor.1001.png',
	scale: { x: 0.8, y: 0.8, z: 0.8 },
	position: {  x: 0.72, y: 0.9, z: 0.52  }
};
