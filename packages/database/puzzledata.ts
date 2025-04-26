
export const PUZZLE_SEED_DATA = [
  /* ---------- 1 ---------- */
  {
    id: 'P1',
    name: 'Pre-Seed Pop-Quiz',
    description: 'Swipe & AirDnB jostle for garage dominance.',
    difficulty: 'EASY',
    seedTiles: JSON.stringify([
      { chainId: 'Swipe',  tileId: '1A' },
      { chainId: 'Swipe',  tileId: '2A' },
      { chainId: 'AirDnB', tileId: '5C' },
      { chainId: 'AirDnB', tileId: '5D' }
    ]),
    initialRack: JSON.stringify(['3A','4A','6C','6D','7C','7D','8C','8D','4B','4E']),
    initialShares: JSON.stringify({ Swipe: 3, AirDnB: 3 }),
    initialCash: 300,
    parScore: 1_000,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['3A','4A','4B','6C','6D','7C','7D','8C','8D','4E']),
    solutionBuys: JSON.stringify([
      {turn:1, buys:[{chainId:'Swipe',  amount:3}]},
      {turn:4, buys:[{chainId:'AirDnB', amount:3}]}
    ])
  },

  /* ---------- 2 ---------- */
  {
    id: 'P2',
    name: 'Series-A Scuffle',
    description: 'Canvas yawns while Suber zooms.',
    difficulty: 'EASY',
    seedTiles: JSON.stringify([
      { chainId: 'Canvas', tileId: '6F' },
      { chainId: 'Canvas', tileId: '6G' },
      { chainId: 'Suber',  tileId: '9F' },
      { chainId: 'Suber',  tileId: '9G' }
    ]),
    initialRack: JSON.stringify(['7F','8F','7G','8G','5F','5G','4F','4G','10F','10G']),
    initialShares: JSON.stringify({ Canvas: 4, Suber: 4 }),
    initialCash: 320,
    parScore: 1_200,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['7F','7G','8F','8G','5F','5G','4F','4G','10F','10G']),
    solutionBuys: JSON.stringify([
      {turn:2, buys:[{chainId:'Suber',  amount:3}]},
      {turn:5, buys:[{chainId:'Canvas', amount:3}]}
    ])
  },

  /* ---------- 3 ---------- */
  {
    id: 'P3',
    name: 'Pivot or Perish',
    description: 'OpenWhy must pivot before Swipe goes safe.',
    difficulty: 'MEDIUM',
    seedTiles: JSON.stringify([
      { chainId: 'OpenWhy', tileId: '5B' },
      { chainId: 'OpenWhy', tileId: '6B' },
      { chainId: 'Swipe',   tileId: '5E' },
      { chainId: 'Swipe',   tileId: '6E' }
    ]),
    initialRack: JSON.stringify(['4B','7B','4E','7E','5C','5D','6C','6D','3B','8E']),
    initialShares: JSON.stringify({ OpenWhy: 5, Swipe: 4 }),
    initialCash: 360,
    parScore: 1_600,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['4B','4E','7B','7E','5C','5D','6C','6D','3B','8E']),
    solutionBuys: JSON.stringify([
      {turn:1, buys:[{chainId:'OpenWhy', amount:3}]},
      {turn:4, buys:[{chainId:'Swipe',   amount:3}]},
      {turn:6, buys:[{chainId:'OpenWhy', amount:2}]}
    ])
  },

  /* ---------- 4 ---------- */
  {
    id: 'P4',
    name: 'Unicorn Merge Mania',
    description: 'Suber slurps AirDnB—bag that bonus!',
    difficulty: 'MEDIUM',
    seedTiles: JSON.stringify([
      { chainId: 'Suber',  tileId: '2F' },
      { chainId: 'Suber',  tileId: '3F' },
      { chainId: 'AirDnB', tileId: '2G' },
      { chainId: 'AirDnB', tileId: '3G' }
    ]),
    initialRack: JSON.stringify(['1F','1G','4F','4G','5F','5G','6F','6G','2E','3H']),
    initialShares: JSON.stringify({ Suber: 6, AirDnB: 6 }),
    initialCash: 380,
    parScore: 1_800,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['1F','1G','4F','4G','5F','5G','6F','6G','2E','3H']),
    solutionBuys: JSON.stringify([
      {turn:1, buys:[{chainId:'Suber',  amount:3}]},
      {turn:3, buys:[{chainId:'AirDnB', amount:3}]}
    ])
  },

  /* ---------- 5 ---------- */
  {
    id: 'P5',
    name: 'Bridge-Round Brouhaha',
    description: 'Canvas needs funding—merge into OpenWhy or fold.',
    difficulty: 'MEDIUM',
    seedTiles: JSON.stringify([
      { chainId: 'Canvas',  tileId: '7C' },
      { chainId: 'Canvas',  tileId: '8C' },
      { chainId: 'OpenWhy', tileId: '7E' },
      { chainId: 'OpenWhy', tileId: '8E' }
    ]),
    initialRack: JSON.stringify(['7D','8D','6C','9C','6E','9E','7B','8F','5C','10C']),
    initialShares: JSON.stringify({ Canvas: 4, OpenWhy: 4 }),
    initialCash: 400,
    parScore: 2_000,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['7D','8D','6C','6E','9C','9E','7B','8F','5C','10C']),
    solutionBuys: JSON.stringify([
      {turn:2, buys:[{chainId:'Canvas',  amount:3}]},
      {turn:5, buys:[{chainId:'OpenWhy', amount:3}]}
    ])
  },

  /* ---------- 6 ---------- */
  {
    id: 'P6',
    name: 'Runway Reckoning',
    description: 'Figment rockets—keep SpaceEx from orbit-lock.',
    difficulty: 'HARD',
    seedTiles: JSON.stringify([
      { chainId: 'Figment', tileId: '4B' },
      { chainId: 'Figment', tileId: '5B' },
      { chainId: 'SpaceEx', tileId: '4H' },
      { chainId: 'SpaceEx', tileId: '5H' }
    ]),
    initialRack: JSON.stringify(['3B','6B','3H','6H','5C','5G','4C','4G','2B','7H']),
    initialShares: JSON.stringify({ Figment: 6, SpaceEx: 6 }),
    initialCash: 420,
    parScore: 2_400,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['3B','3H','6B','6H','5C','5G','4C','4G','2B','7H']),
    solutionBuys: JSON.stringify([
      {turn:1, buys:[{chainId:'Figment', amount:3}]},
      {turn:4, buys:[{chainId:'SpaceEx', amount:3}]},
      {turn:7, buys:[{chainId:'Figment', amount:3}]}
    ])
  },

  /* ---------- 7 ---------- */
  {
    id: 'P7',
    name: 'Decacorn Derby',
    description: 'Chase a $10 B valuation via dual IPOs.',
    difficulty: 'HARD',
    seedTiles: JSON.stringify([
      { chainId: 'Figment', tileId: '9B' },
      { chainId: 'Figment', tileId: '10B' },
      { chainId: 'SpaceEx', tileId: '9E' },
      { chainId: 'SpaceEx', tileId: '10E' }
    ]),
    initialRack: JSON.stringify(['8B','11B','8E','11E','9C','9D','10C','10D','7B','7E']),
    initialShares: JSON.stringify({ Figment: 5, SpaceEx: 5 }),
    initialCash: 430,
    parScore: 2_600,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['8B','8E','11B','11E','9C','9D','10C','10D','7B','7E']),
    solutionBuys: JSON.stringify([
      {turn:2, buys:[{chainId:'SpaceEx', amount:3}]},
      {turn:5, buys:[{chainId:'Figment', amount:3}]}
    ])
  },

  /* ---------- 8 ---------- */
  {
    id: 'P8',
    name: 'Down-Round Dilemma',
    description: 'Suber dips—can Swipe scoop it pre-safe?',
    difficulty: 'EXPERT',
    seedTiles: JSON.stringify([
      { chainId: 'Suber', tileId: '11D' },
      { chainId: 'Suber', tileId: '11E' },
      { chainId: 'Swipe', tileId: '9D'  },
      { chainId: 'Swipe', tileId: '9E'  }
    ]),
    initialRack: JSON.stringify(['10D','10E','12D','12E','8D','8E','11C','11F','9C','9F']),
    initialShares: JSON.stringify({ Suber: 5, Swipe: 5 }),
    initialCash: 450,
    parScore: 3_000,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['10D','10E','12D','12E','8D','8E','11C','11F','9C','9F']),
    solutionBuys: JSON.stringify([
      {turn:3, buys:[{chainId:'Swipe', amount:3}]},
      {turn:6, buys:[{chainId:'Suber', amount:3}]}
    ])
  },

  /* ---------- 9 ---------- */
  {
    id: 'P9',
    name: 'SPAC Attack',
    description: 'Canvas + AirDnB sprint through a reverse-merger SPAC.',
    difficulty: 'EXPERT',
    seedTiles: JSON.stringify([
      { chainId: 'Canvas', tileId: '3H' },
      { chainId: 'Canvas', tileId: '4H' },
      { chainId: 'AirDnB', tileId: '3F' },
      { chainId: 'AirDnB', tileId: '4F' }
    ]),
    initialRack: JSON.stringify(['5H','5F','6H','6F','2G','2H','1F','1H','4G','3G']),
    initialShares: JSON.stringify({ Canvas: 5, AirDnB: 5 }),
    initialCash: 460,
    parScore: 3_000,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['5H','5F','6H','6F','2G','2H','1F','1H','4G','3G']),
    solutionBuys: JSON.stringify([
      {turn:2, buys:[{chainId:'Canvas', amount:3}]},
      {turn:5, buys:[{chainId:'AirDnB', amount:3}]}
    ])
  },

  /* ---------- 10 ---------- */
  {
    id: 'P10',
    name: 'IPO Cliffhanger',
    description: 'SpaceEx eyes Wall St.—merge Figment first or miss the bell.',
    difficulty: 'EXPERT',
    seedTiles: JSON.stringify([
      { chainId: 'SpaceEx', tileId: '1I' },
      { chainId: 'SpaceEx', tileId: '2I' },
      { chainId: 'Figment', tileId: '1G' },
      { chainId: 'Figment', tileId: '2G' }
    ]),
    initialRack: JSON.stringify(['3I','3G','4I','4G','2H','2F','1H','1F','5I','5G']),
    initialShares: JSON.stringify({ SpaceEx: 6, Figment: 6 }),
    initialCash: 500,
    parScore: 3_200,
    turnLimit: 10,
    solutionMoves: JSON.stringify(['3I','3G','4I','4G','2H','2F','1H','1F','5I','5G']),
    solutionBuys: JSON.stringify([
      {turn:1, buys:[{chainId:'Figment', amount:3}]},
      {turn:4, buys:[{chainId:'SpaceEx', amount:3}]},
      {turn:7, buys:[{chainId:'Figment', amount:3}]}
    ])
  }
];