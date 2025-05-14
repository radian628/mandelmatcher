export const LEVELS = [
  {
    bottomLeft: {
      x: -0.302373124875951,
      y: -1.0315392869672173,
    },
    topRight: {
      x: 0.4567576185848055,
      y: -0.2724085435064655,
    },
    fractalIndex: 1,
    params: {
      x: 0.2,
      y: -0.6,
    },
  },
  {
    bottomLeft: {
      x: -1.0808099909819329,
      y: -0.5385742813352624,
    },
    topRight: {
      x: -0.684866200062996,
      y: -0.14263049041632594,
    },
    fractalIndex: 1,
    params: {
      x: 0.2,
      y: -0.6,
    },
  },
  {
    bottomLeft: {
      x: -1.2629528160529173,
      y: 0.3745317849422254,
    },
    topRight: {
      x: -1.2485148474591334,
      y: 0.38896975353601,
    },
    fractalIndex: 1,
    params: {
      x: 0.2,
      y: -0.6,
    },
  },
  {
    bottomLeft: {
      x: 0.34708677390673875,
      y: 0.5729895209222156,
    },
    topRight: {
      x: 0.38386464665796144,
      y: 0.6097673936734397,
    },
    fractalIndex: 1,
    params: {
      x: 0.2,
      y: -0.6,
    },
  },
  {
    bottomLeft: {
      x: -1.8667391911660034,
      y: -0.0056043732637976965,
    },
    topRight: {
      x: -1.8557129943785577,
      y: 0.005421823523647911,
    },
    fractalIndex: 1,
    params: {
      x: 0.2,
      y: -0.6,
    },
  },
];

export type Level = (typeof LEVELS)[number];
