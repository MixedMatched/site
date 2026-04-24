/* charts.js — shared data + chart renderers used by
 * books.html, music.html, schedule.html, and art.html.
 *
 * Each renderXxx(parent, opts?) appends a `.chart-box` div + an <svg>
 * inside `parent` (a CSS selector or D3 selection) and returns the d3
 * selection of the SVG. parent === null means "don't wrap, append SVG
 * directly to body".
 */
(function (global) {
  // ════════════════════════════════════════════════════════════════
  //  DATA
  // ════════════════════════════════════════════════════════════════

  // ── Book metadata (from StoryGraph) ─────────────────────────────
  const books = [
    {
      title: "Reamde",
      author: "Neal Stephenson",
      genres: ["Fiction", "Thriller", "Science Fiction", "Adventure"],
      tags: ["adventurous", "tense", "fast-paced"],
    },
    {
      title: "The Time Traveler's Almanac",
      author: "Jeff & Ann VanderMeer",
      genres: ["Science Fiction", "Short Stories", "Anthologies", "Fantasy"],
      tags: ["adventurous", "reflective", "fast-paced"],
    },
    {
      title: "This Inevitable Ruin",
      author: "Matt Dinniman",
      genres: ["Fiction", "Fantasy", "Science Fiction", "Humor", "LitRPG"],
      tags: ["adventurous", "funny", "dark", "fast-paced"],
    },
    {
      title: "The Eye of the Bedlam Bride",
      author: "Matt Dinniman",
      genres: ["Fiction", "Fantasy", "Science Fiction", "Humor", "LitRPG"],
      tags: ["adventurous", "funny", "dark", "fast-paced"],
    },
  ];

  // ── Per-book quantitative analysis (VADER + pacing) ─────────────
  const bookAnalysis = {"Reamde":{"n_chars":2251196,"sentiment":[0.0691,-0.0114,0.0284,0.1815,0.0641,0.1032,0.0327,0.0039,0.0452,-0.0251,0.022,-0.0264,0.0194,-0.0023,0.0204,0.0297,0.079,-0.0127,0.0641,0.0277,0.0948,0.05,0.0421,0.062,0.0263,0.0112,-0.0266,0.0443,0.0436,0.0725,-0.0442,-0.0632,-0.0292,0.0236,0.0239,0.0241,-0.0212,-0.0125,-0.0103,-0.069,-0.0182,-0.022,0.0014,0.0133,0.0271,-0.0098,-0.0107,0.007,0.0566,-0.0558,0.0067,0.0099,-0.0389,0.0034,-0.0277,0.0014,0.0256,0.0268,0.0169,0.0398,-0.0185,0.0468,0.0253,0.0614,0.004,0.029,0.0516,-0.0169,0.0259,-0.0063,0.0313,0.0361,-0.0167,0.0144,0.0527,0.0023,-0.0021,-0.0463,-0.0014,-0.0186,-0.0112,-0.0525,-0.0626,0.0147,0.0208,0.0092,0.0062,-0.0257,0.0004,0.0367,-0.0321,-0.0355,-0.0015,-0.0295,-0.0507,-0.0231,-0.0281,-0.0704,-0.0655,0.0465],"sentence_length":[18.05,18.35,21.82,24.82,22.02,24.31,16.04,15.72,18.81,17.46,13.15,17.31,25.15,14.7,16.24,29.08,22.92,18.87,18.9,18.31,25.79,18.5,22.19,21.58,19.38,17.16,19.54,20.78,22.29,22.69,16.83,20.51,17.16,15.18,18.85,19.67,17.82,19.75,16.11,18.66,20.94,16.22,20.41,17.46,19.49,17.84,17.33,18.87,21.58,20.72,22.23,19.81,19.4,19.95,22.61,20.92,21.1,19.11,18.51,20.59,21.14,20.06,19.3,19.59,19.02,22.61,24.4,22.6,23.85,20.31,23.49,21.04,20.35,20.39,17.6,21.16,16.68,15.62,19.45,17.41,17.98,17.62,16.26,21.99,19.14,22.49,19.78,17.94,16.57,22.38,21.29,17.33,18.55,21.5,20.09,17.59,19.3,19.78,18.59,20.5],"dialogue_ratio":[0.0824,0.1683,0.0311,0.0167,0.1006,0.2255,0.5297,0.3943,0.3427,0.2304,0.3301,0.225,0.0216,0.3636,0.4191,0.2661,0.1022,0.1145,0.1951,0.3202,0.0693,0.3046,0.0458,0.3904,0.2831,0.1197,0.0983,0.0124,0.0034,0.0038,0.096,0.0218,0.0634,0.2853,0.0591,0.0637,0.0928,0.0652,0.3036,0.1615,0.0577,0.0506,0.0168,0.2254,0.1884,0.2043,0.0957,0.2326,0.0223,0.1139,0.0065,0.2078,0.2299,0.3356,0.2727,0.0051,0.2234,0.0081,0.2152,0.0843,0.177,0.2113,0.2336,0.167,0.3096,0.0544,0.1822,0.1728,0.2004,0.2622,0.1315,0.038,0.1648,0.0933,0.3078,0.1926,0.2248,0.2369,0.2908,0.2411,0.2131,0.0037,0.1675,0.0499,0.203,0.0763,0.1343,0.1308,0.1596,0.0808,0.0828,0.0657,0.2651,0.0626,0.0302,0.0936,0.1072,0.0578,0.0673,0.1609],"exclaim_per_1k":[1.022,1.51,0.4,0.0,0.666,0.755,3.021,2.532,1.155,1.377,4.265,1.732,0.533,1.955,1.644,0.533,0.489,1.288,0.755,1.377,0.355,2.621,0.533,1.333,1.555,1.244,1.155,0.222,0.044,0.133,1.91,0.577,1.288,2.088,0.444,0.444,0.933,0.4,2.31,1.022,0.8,0.8,0.222,1.51,0.666,0.933,0.844,1.244,0.4,0.577,0.178,1.244,1.732,1.333,1.688,0.4,1.821,0.4,1.199,0.444,0.444,1.066,1.955,0.711,1.199,0.755,0.711,0.755,0.977,1.732,0.622,0.844,1.111,0.666,1.599,1.066,1.111,2.177,1.732,1.821,1.066,0.178,1.377,0.444,1.155,0.533,0.577,0.577,0.711,0.4,0.577,0.8,1.288,0.666,0.311,1.022,0.977,0.577,0.444,0.885]},"The Time Traveler's Almanac":{"n_chars":2815508,"sentiment":[0.0948,-0.0181,-0.0238,0.0106,0.0805,0.0864,0.079,0.0359,0.0498,0.0815,0.1259,0.0431,0.0046,0.0373,0.0315,0.015,0.0344,0.0607,-0.0099,0.0988,0.127,0.0173,0.0142,0.0329,0.0388,0.07,0.0322,0.0927,-0.0179,-0.0249,0.0067,0.0458,-0.0083,-0.0239,-0.0323,-0.0644,0.0526,0.0438,0.0273,-0.0151,0.0444,0.0356,0.0547,0.0496,0.0246,0.0272,-0.0027,-0.0235,0.0062,0.0293,0.0331,0.0676,0.0483,0.0561,0.0851,0.0491,-0.0178,0.0413,-0.0055,-0.0584,0.0184,-0.0289,0.045,0.003,0.0438,0.0521,-0.0418,0.0305,0.0191,0.0107,0.0571,0.0382,-0.0019,0.0343,0.04,0.1077,0.0306,0.0093,0.0315,0.1029,-0.1426,-0.0121,0.1065,0.0445,0.0674,0.0312,0.033,0.0553,-0.0048,0.0656,0.0368,0.0141,0.0182,-0.0125,0.072,0.0576,-0.0177,-0.0296,-0.0055,0.0729],"sentence_length":[17.18,9.67,12.01,14.76,15.78,20.04,18.09,16.54,15.27,17.45,17.98,16.7,12.97,14.51,14.53,12.69,15.58,18.19,12.14,13.7,14.22,13.79,14.12,12.59,10.63,10.14,10.84,15.81,14.99,14.14,14.49,14.3,13.99,11.57,16.23,16.98,11.81,12.91,15.56,17.19,13.9,15.4,16.39,15.12,11.74,14.53,14.46,16.87,17.11,13.84,12.03,12.77,14.87,12.64,18.85,15.31,14.24,17.49,14.5,15.18,16.84,17.74,20.16,16.75,13.03,13.02,17.29,15.31,16.68,14.47,19.7,15.33,15.72,16.66,13.43,12.93,11.58,13.0,13.24,23.37,22.49,17.28,15.63,12.38,14.02,11.27,12.33,14.26,11.62,14.67,19.46,15.1,13.88,16.51,20.01,18.47,20.46,20.53,15.33,14.05],"dialogue_ratio":[0.0443,0.2177,0.1278,0.1848,0.2559,0.0745,0.1602,0.095,0.0826,0.2618,0.3415,0.2374,0.1296,0.2621,0.1118,0.4283,0.0319,0.1509,0.2132,0.2132,0.2188,0.2603,0.1544,0.1939,0.1454,0.1393,0.3165,0.1714,0.1373,0.2066,0.1914,0.3781,0.168,0.4471,0.152,0.2922,0.2685,0.2752,0.2827,0.1331,0.2876,0.381,0.3874,0.309,0.2588,0.1884,0.2857,0.0336,0.2029,0.4143,0.1105,0.2562,0.1538,0.0364,0.1992,0.3739,0.1241,0.1059,0.183,0.0995,0.0017,0.1084,0.0898,0.0991,0.3353,0.2553,0.0967,0.5533,0.4918,0.5109,0.2145,0.3231,0.2159,0.0613,0.1306,0.1729,0.1557,0.1506,0.1849,0.0088,0.0251,0.0841,0.1392,0.2528,0.0868,0.2092,0.3603,0.0652,0.1031,0.2709,0.1453,0.2079,0.2821,0.2116,0.1511,0.2365,0.1297,0.1704,0.2878,0.1398],"exclaim_per_1k":[1.456,2.06,2.451,1.421,2.344,1.35,1.172,1.527,1.421,3.339,3.232,2.238,1.35,1.527,0.71,2.415,1.172,1.705,1.634,2.096,2.06,1.811,1.634,1.421,2.025,2.415,3.374,1.527,1.492,1.314,1.705,2.735,1.101,2.06,1.563,1.634,1.811,1.74,1.172,1.208,4.369,3.765,1.882,1.421,3.658,2.948,3.268,0.604,1.989,4.688,2.202,2.167,1.421,1.03,1.492,2.238,1.172,0.959,2.06,0.817,0.213,1.634,0.71,1.066,2.238,2.06,0.852,1.421,1.882,1.776,1.243,2.628,0.675,0.781,1.421,1.847,2.273,2.451,2.522,0.249,0.249,1.563,1.811,2.273,0.107,1.101,2.522,1.705,1.385,2.167,1.882,1.74,2.167,1.208,1.385,2.344,0.781,1.314,2.167,0.888]},"This Inevitable Ruin":{"n_chars":1504382,"sentiment":[-0.0728,-0.0078,-0.0234,0.0549,0.0134,0.0784,0.0232,0.0174,-0.0245,0.0609,0.0124,0.0683,0.0325,-0.0183,0.0022,0.007,0.0289,0.0028,-0.0323,-0.046,-0.0047,-0.0636,-0.0436,-0.0334,-0.0393,-0.0166,-0.0478,-0.0205,-0.0302,-0.062,-0.0242,-0.0948,-0.0963,-0.0363,-0.0219,0.0026,-0.1186,-0.0336,-0.0619,-0.0464,0.0011,-0.0537,0.0086,-0.0728,-0.0253,0.0212,-0.0391,-0.0052,0.0028,-0.044,-0.022,-0.0718,-0.0124,-0.0072,0.071,0.0063,-0.0247,-0.0163,-0.0447,-0.0552,-0.0604,0.0611,0.032,0.0312,0.0773,-0.043,0.0046,0.0098,-0.0287,-0.0947,-0.065,-0.0508,-0.0514,-0.0452,-0.1066,-0.0425,-0.0203,-0.0445,-0.0857,-0.0632,-0.0636,-0.0637,-0.0599,-0.0616,-0.0603,-0.0068,-0.0458,-0.0009,-0.0239,0.0034,0.0075,-0.0004,-0.0008,0.0253,0.0038,-0.0005,-0.0179,0.0363,-0.0417,0.0164],"sentence_length":[14.23,9.84,9.69,12.01,10.96,13.94,12.54,10.94,11.17,12.14,13.19,13.1,10.68,13.16,10.47,10.88,10.8,11.98,11.36,12.58,12.44,12.31,12.2,10.1,11.14,11.29,10.76,10.21,12.96,12.8,13.08,10.57,10.96,10.26,9.7,11.52,10.68,12.43,12.67,11.59,13.3,10.74,11.96,12.16,11.21,9.57,11.31,11.65,11.65,12.27,12.67,11.79,13.85,10.72,13.41,10.77,11.02,9.88,11.17,9.46,11.04,10.94,13.74,13.07,12.72,14.52,12.66,9.74,11.63,11.7,10.93,12.43,9.77,9.21,11.89,10.41,11.21,11.86,11.93,11.83,10.91,12.05,10.06,10.24,12.29,11.01,10.29,9.74,10.17,13.65,11.77,10.11,11.41,10.7,10.37,10.5,11.56,9.55,11.59,10.4],"dialogue_ratio":[0.3802,0.2307,0.0508,0.2383,0.175,0.214,0.4306,0.2063,0.2117,0.4782,0.1956,0.3428,0.2609,0.1567,0.3425,0.3129,0.3221,0.1609,0.2094,0.254,0.3291,0.087,0.1067,0.169,0.2249,0.2015,0.2412,0.0445,0.2014,0.1322,0.2253,0.0335,0.0772,0.1932,0.22,0.0969,0.0632,0.3077,0.0924,0.2035,0.3572,0.3234,0.2032,0.0488,0.2577,0.4893,0.4186,0.187,0.4421,0.2074,0.3484,0.2733,0.1124,0.1945,0.0379,0.2607,0.0535,0.0427,0.0325,0.0411,0.125,0.36,0.3822,0.3196,0.1673,0.0536,0.2878,0.1109,0.1204,0.116,0.1211,0.2081,0.078,0.0576,0.0963,0.0905,0.1853,0.0435,0.0758,0.1447,0.0529,0.0836,0.1665,0.0496,0.2323,0.4447,0.2586,0.1379,0.1492,0.3093,0.2162,0.1279,0.3482,0.448,0.3229,0.1907,0.3701,0.4851,0.1278,0.3531],"exclaim_per_1k":[2.26,0.997,2.792,2.061,2.991,2.061,2.593,1.928,2.726,2.393,1.396,1.595,1.462,0.665,2.659,2.127,1.994,1.529,1.396,1.595,1.595,1.263,1.064,1.861,1.728,1.994,2.061,3.124,0.532,1.462,0.931,1.197,1.928,1.595,1.13,1.396,2.659,2.194,1.795,2.26,1.396,2.46,1.662,2.127,2.858,3.856,3.656,2.061,2.327,1.529,2.792,2.061,1.33,1.396,0.598,2.925,1.994,1.795,2.127,2.127,2.659,1.33,1.396,1.064,1.263,1.13,2.726,4.122,2.726,2.327,1.13,2.127,3.324,4.254,0.731,2.061,1.263,1.728,1.197,2.194,1.795,1.662,2.393,2.593,1.994,2.792,4.919,2.858,2.393,1.33,3.457,3.191,3.324,3.124,4.321,1.994,1.462,1.861,1.662,4.033]},"The Eye of the Bedlam Bride":{"n_chars":1426995,"sentiment":[0.0402,-0.0267,0.0155,-0.0231,0.0035,0.0384,0.0155,-0.0016,-0.0214,-0.016,-0.0175,-0.0636,-0.0575,0.0091,-0.0088,-0.0341,-0.036,0.0728,-0.0184,0.0143,0.0133,-0.0117,-0.0131,-0.0029,0.0045,-0.0237,0.0461,-0.0187,-0.0578,0.0732,-0.0718,0.0307,0.0174,0.0064,-0.0122,0.0347,0.0005,0.0219,-0.047,0.0059,0.0053,0.0108,-0.0961,-0.053,-0.0602,0.0118,-0.0399,-0.1086,-0.0677,-0.0651,-0.0655,-0.0051,-0.0162,-0.0065,-0.0423,0.0283,-0.0191,-0.0419,-0.0358,-0.023,-0.0875,-0.0493,-0.0306,-0.0054,-0.0578,-0.0578,-0.0237,-0.0993,-0.0399,-0.0436,-0.0145,-0.0022,-0.0015,-0.0638,-0.0014,-0.003,-0.0519,-0.0106,-0.0104,-0.0287,-0.0072,-0.0606,-0.0744,-0.0248,0.0064,-0.06,-0.0274,-0.0216,0.0103,0.0145,-0.05,-0.0303,-0.0798,-0.0385,-0.0539,-0.0464,-0.0009,-0.0519,-0.0076,-0.0423],"sentence_length":[12.56,9.03,10.09,13.4,9.54,11.13,10.9,11.68,10.56,9.97,10.31,10.07,12.08,10.03,11.57,10.32,10.14,11.05,11.68,12.63,10.27,12.35,10.29,9.18,9.75,8.47,10.3,10.62,9.88,11.16,11.68,11.36,11.38,10.83,12.18,13.36,11.7,11.34,12.46,10.35,11.6,12.08,12.07,13.4,10.88,9.6,11.72,9.33,10.85,10.66,10.61,11.8,11.86,10.37,9.86,11.36,11.18,12.74,11.43,10.72,10.82,11.53,11.6,10.08,11.19,12.22,11.13,10.88,10.55,11.32,11.44,10.01,11.9,13.7,14.13,10.36,9.61,12.66,11.99,9.43,10.33,11.32,10.21,10.04,11.53,11.9,9.52,11.02,11.6,11.48,12.84,12.24,11.18,10.67,8.87,8.96,9.84,11.1,10.61,11.23],"dialogue_ratio":[0.0147,0.0182,0.0509,0.2275,0.1651,0.218,0.2833,0.3538,0.1962,0.3211,0.3412,0.0475,0.1406,0.2381,0.4201,0.2224,0.1809,0.3869,0.4837,0.3213,0.4333,0.2279,0.2166,0.068,0.1143,0.352,0.1769,0.1528,0.355,0.2809,0.281,0.3988,0.5092,0.3824,0.154,0.0931,0.0566,0.137,0.1751,0.2292,0.2253,0.1181,0.1156,0.1906,0.1805,0.3056,0.0084,0.1216,0.0917,0.1315,0.2362,0.2854,0.3506,0.4414,0.2636,0.239,0.14,0.1653,0.0657,0.1494,0.0732,0.0446,0.3183,0.0915,0.2298,0.063,0.1033,0.2259,0.23,0.2256,0.1602,0.0166,0.171,0.3253,0.1232,0.1437,0.2758,0.1924,0.2936,0.1865,0.2887,0.051,0.0777,0.3266,0.2143,0.2891,0.0409,0.2655,0.2325,0.2633,0.2081,0.1127,0.0631,0.2278,0.1502,0.1969,0.2634,0.2669,0.173,0.139],"exclaim_per_1k":[2.523,2.102,2.313,2.943,2.803,1.892,2.102,1.822,2.173,2.453,2.173,2.593,1.121,3.154,1.892,1.962,3.154,3.224,2.593,1.822,2.102,2.523,2.593,4.345,2.523,2.173,1.892,1.121,2.383,2.523,2.663,3.784,2.873,1.962,1.542,0.491,1.752,1.682,1.752,2.593,1.051,1.892,1.962,1.261,1.472,1.892,0.841,3.154,1.752,2.453,2.453,2.593,2.102,2.523,1.682,2.032,1.752,1.542,1.682,2.102,3.644,1.892,3.084,1.542,2.032,2.383,2.593,1.402,2.032,2.383,1.402,0.911,1.121,1.962,0.911,2.313,3.995,2.102,3.434,3.925,1.752,2.173,1.822,1.752,2.313,2.733,2.943,1.402,1.472,1.612,2.173,1.472,2.873,5.747,3.784,3.784,2.032,2.032,1.261,2.715]}};

  // ── Reading sessions from books.txt ─────────────────────────────
  const readingSessions = {
    "Reamde": [
      { start: new Date("2026-04-02T22:22:00"), end: new Date("2026-04-02T23:33:00"), startPct: 17, endPct: 24 },
    ],
    "The Time Traveler's Almanac": [
      { start: new Date("2026-04-02T19:43:00"), end: new Date("2026-04-02T21:24:00"), startPct: 3, endPct: 20 },
    ],
    "This Inevitable Ruin": [
      { start: new Date("2026-03-29T02:30:00"), end: new Date("2026-03-29T04:30:00"), startPct: 0,  endPct: 21 },
      { start: new Date("2026-03-30T22:38:00"), end: new Date("2026-03-31T02:50:00"), startPct: 21, endPct: 100 },
    ],
    "The Eye of the Bedlam Bride": [
      { start: new Date("2026-03-26T20:56:00"), end: new Date("2026-03-26T22:19:00"), startPct: 16, endPct: 41 },
      { start: new Date("2026-03-28T22:25:00"), end: new Date("2026-03-29T02:30:00"), startPct: 41, endPct: 100 },
    ],
  };

  const bookOrder = [
    "Reamde",
    "The Time Traveler's Almanac",
    "This Inevitable Ruin",
    "The Eye of the Bedlam Bride",
  ];

  const bookColors = {
    "Reamde":                       "#e8a048",
    "The Time Traveler's Almanac":  "#4898e0",
    "This Inevitable Ruin":         "#a068d8",
    "The Eye of the Bedlam Bride":  "#e86888",
  };

  // ── Music data (from Last.fm + MusicBrainz, 3/26–4/2 2026) ─────
  const musicGenreByDay = [
    { day: "03/26", "Hyperpop": 50, "Pop": 8,  "Indie": 2,  "Electronic": 7,  "Indie Rock": 8,  "Indie Pop": 2,  "Dream Pop": 8,  "Other": 27 },
    { day: "03/27", "Hyperpop": 45, "Pop": 9,  "Indie": 5,  "Electronic": 3,  "Indie Rock": 9,  "Indie Pop": 3,  "Dream Pop": 6,  "Other": 37 },
    { day: "03/28", "Hyperpop": 35, "Pop": 18, "Indie": 8,  "Electronic": 15, "Indie Rock": 16, "Indie Pop": 8,  "Dream Pop": 12, "Other": 74 },
    { day: "03/29", "Hyperpop": 67, "Pop": 22, "Indie": 4,  "Electronic": 12, "Indie Rock": 7,  "Indie Pop": 9,  "Dream Pop": 4,  "Other": 60 },
    { day: "03/30", "Hyperpop": 32, "Pop": 27, "Indie": 24, "Electronic": 18, "Indie Rock": 11, "Indie Pop": 11, "Dream Pop": 5,  "Other": 83 },
    { day: "03/31", "Hyperpop": 65, "Pop": 30, "Indie": 34, "Electronic": 19, "Indie Rock": 9,  "Indie Pop": 6,  "Dream Pop": 7,  "Other": 81 },
    { day: "04/01", "Hyperpop": 33, "Pop": 14, "Indie": 14, "Electronic": 10, "Indie Rock": 12, "Indie Pop": 11, "Dream Pop": 3,  "Other": 55 },
    { day: "04/02", "Hyperpop": 28, "Pop": 16, "Indie": 12, "Electronic": 10, "Indie Rock": 12, "Indie Pop": 7,  "Dream Pop": 4,  "Other": 70 },
  ];
  const musicGenres = ["Hyperpop", "Pop", "Indie", "Electronic", "Indie Rock", "Indie Pop", "Dream Pop", "Other"];
  const musicDayLabels = ["Thu 3/26", "Fri 3/27", "Sat 3/28", "Sun 3/29", "Mon 3/30", "Tue 3/31", "Wed 4/1", "Thu 4/2"];
  const musicDecades = [
    { decade: "1970s", count: 1 },
    { decade: "1980s", count: 1 },
    { decade: "1990s", count: 8 },
    { decade: "2000s", count: 34 },
    { decade: "2010s", count: 333 },
    { decade: "2020s", count: 672 },
    { decade: "Unknown", count: 324 },
  ];
  const musicGenreColors = {
    "Hyperpop":    "#e86888",
    "Pop":         "#e8a048",
    "Indie":       "#c0d038",
    "Electronic":  "#4898e0",
    "Indie Rock":  "#58c870",
    "Indie Pop":   "#a068d8",
    "Dream Pop":   "#48c0b0",
    "Other":       "#a0a0a0",
  };

  // ── Schedule CSV (raw activity log) ─────────────────────────────
  const scheduleCsv = `Type,Start Date,End Date
Reddit,4/2/2026 4:02:00,4/2/2026 4:36:00
Reddit,4/2/2026 10:18:00,4/2/2026 10:47:00
Reddit,4/1/2026 22:53:00,4/1/2026 23:08:00
Reddit,4/1/2026 20:10:00,4/1/2026 20:16:00
Reddit,4/1/2026 18:00:00,4/1/2026 18:55:00
Reddit,4/1/2026 16:26:00,4/1/2026 17:14:00
Reddit,4/1/2026 12:39:00,4/1/2026 12:46:00
Reddit,4/1/2026 7:07:00,4/1/2026 7:24:00
Reddit,4/1/2026 0:57:00,4/1/2026 1:04:00
Reddit,3/31/2026 21:29:00,3/31/2026 22:49:00
Reddit,3/31/2026 17:31:00,3/31/2026 17:54:00
Reddit,3/30/2026 16:53:00,3/30/2026 17:26:00
Reddit,3/30/2026 10:22:00,3/30/2026 12:45:00
Reddit,3/30/2026 0:14:00,3/30/2026 0:46:00
Reddit,3/29/2026 13:23:00,3/29/2026 14:28:00
Reddit,3/28/2026 19:18:00,3/28/2026 19:41:00
Reddit,3/28/2026 16:25:00,3/28/2026 17:32:00
Reddit,3/28/2026 14:37:00,3/28/2026 14:59:00
Reddit,3/28/2026 12:38:00,3/28/2026 12:49:00
Reddit,3/27/2026 23:37:00,3/28/2026 0:39:00
Reddit,3/27/2026 14:20:00,3/27/2026 14:51:00
Reddit,3/27/2026 2:03:00,3/27/2026 2:29:00
Reddit,3/26/2026 21:10:00,3/26/2026 21:39:00
Reddit,3/26/2026 18:48:00,3/26/2026 19:37:00
Reddit,3/26/2026 15:09:00,3/26/2026 16:43:00
TV,3/29/2026 20:01:00,3/30/2026 0:06:00
TV,3/27/2026 20:39:00,3/28/2026 0:05:00
Music,3/26/2026 12:55:00,3/26/2026 13:17:00
Music,3/26/2026 14:44:00,3/26/2026 15:34:00
Music,3/26/2026 16:33:00,3/26/2026 17:15:00
Music,3/26/2026 18:03:00,3/26/2026 22:00:00
Music,3/27/2026 0:30:00,3/27/2026 1:58:00
Music,3/27/2026 11:18:00,3/27/2026 11:40:00
Music,3/27/2026 13:14:00,3/27/2026 15:40:00
Music,3/27/2026 17:23:00,3/27/2026 17:56:00
Music,3/27/2026 18:27:00,3/27/2026 18:43:00
Music,3/27/2026 21:23:00,3/27/2026 21:59:00
Music,3/28/2026 13:18:00,3/28/2026 18:32:00
Music,3/28/2026 18:57:00,3/29/2026 4:30:00
Music,3/29/2026 11:34:00,3/29/2026 12:59:00
Music,3/29/2026 16:45:00,3/29/2026 20:25:00
Music,3/30/2026 0:13:00,3/30/2026 1:25:00
Music,3/30/2026 11:21:00,3/30/2026 12:41:00
Music,3/30/2026 13:29:00,3/30/2026 13:32:00
Music,3/30/2026 14:43:00,3/30/2026 14:51:00
Music,3/30/2026 15:37:00,3/31/2026 2:50:00
Music,3/31/2026 12:43:00,4/1/2026 0:51:00
Music,4/1/2026 12:16:00,4/1/2026 13:32:00
Music,4/1/2026 14:42:00,4/1/2026 15:32:00
Music,4/1/2026 17:34:00,4/1/2026 18:24:00
Music,4/1/2026 19:33:00,4/2/2026 0:36:00
Music,4/2/2026 12:24:00,4/2/2026 13:54:00
Music,4/2/2026 14:43:00,4/2/2026 14:47:00
Music,4/2/2026 16:08:00,4/2/2026 17:24:00
Music,4/2/2026 18:33:00,4/2/2026 23:59:00
Reading,4/2/2026 22:22:00,4/2/2026 23:33:00
Reading,4/2/2026 19:43:00,4/2/2026 21:24:00
Reading,3/30/2026 22:38:00,3/31/2026 2:50:00
Reading,3/28/2026 22:25:00,3/29/2026 4:30:00
Reading,3/26/2026 20:56:00,3/26/2026 22:19:00
YouTube,4/2/2026 10:39:00,4/2/2026 12:24:00
YouTube,4/2/2026 18:15:00,4/2/2026 18:34:00
YouTube,4/1/2026 18:27:00,4/1/2026 19:13:00
YouTube,4/1/2026 11:05:00,4/1/2026 11:38:00
YouTube,3/31/2026 11:26:00,3/31/2026 12:22:00
YouTube,3/28/2026 18:32:00,3/28/2026 18:54:00
YouTube,3/28/2026 12:33:00,3/28/2026 13:11:00
YouTube,3/27/2026 10:40:00,3/27/2026 11:12:00
YouTube,3/26/2026 11:40:00,3/26/2026 12:51:00`;

  const scheduleTypeConfig = {
    Reddit:  { visual: true,  audio: false, color: '#e8d8c7' },
    TV:      { visual: true,  audio: true,  color: '#eaeac5' },
    Music:   { visual: false, audio: true,  color: '#e4f2de' },
    YouTube: { visual: true,  audio: true,  color: '#efdada' },
    Reading: { visual: true,  audio: false, color: '#ded7ed' },
  };
  const scheduleDayLabels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // ════════════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════════════

  function asSel(parent) {
    if (parent == null) return d3.select('body');
    if (typeof parent === 'string') return d3.select(parent);
    return parent;
  }

  function makeBox(parent, title, opts = {}) {
    const sel = asSel(parent);
    if (opts.bare) return sel;
    const box = sel.append('div').attr('class', 'chart-box');
    if (title) box.append('h2').text(title);
    return box;
  }

  function smooth(arr, window = 5) {
    const n = arr.length, half = Math.floor(window / 2);
    return arr.map((_, i) => {
      let sum = 0, count = 0;
      for (let j = Math.max(0, i - half); j <= Math.min(n - 1, i + half); j++) {
        sum += arr[j]; count++;
      }
      return sum / count;
    });
  }

  function readMask(sessions, n = 100) {
    const mask = new Array(n).fill(false);
    for (const s of sessions) {
      for (let i = 0; i < n; i++) {
        const center = i + 0.5;
        if (center >= s.startPct && center <= s.endPct) mask[i] = true;
      }
    }
    return mask;
  }

  function fmtTime(d) {
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  function avgInRange(arr, startPct, endPct) {
    const n = arr.length;
    const a = Math.max(0, Math.floor(startPct * n / 100));
    const b = Math.min(n,   Math.ceil (endPct   * n / 100));
    if (b <= a) return arr[a] != null ? arr[a] : 0;
    let sum = 0;
    for (let i = a; i < b; i++) sum += arr[i];
    return sum / (b - a);
  }

  function countItems(items) {
    const counts = {};
    items.forEach(item => { counts[item] = (counts[item] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Shared tooltip element
  let _sharedTip = null;
  function getTooltip() {
    if (_sharedTip) return _sharedTip;
    _sharedTip = d3.select('body').append('div')
      .attr('class', 'chartlib-tip')
      .style('position', 'absolute').style('pointer-events', 'none')
      .style('background', 'rgba(30,30,30,0.92)').style('color', '#fff')
      .style('padding', '6px 9px').style('border-radius', '6px')
      .style('font', '12px Arial,Helvetica,sans-serif').style('opacity', 0)
      .style('transition', 'opacity 120ms').style('z-index', 9999);
    return _sharedTip;
  }

  // ════════════════════════════════════════════════════════════════
  //  BOOK CHARTS
  // ════════════════════════════════════════════════════════════════

  function renderBookThemes(parent, opts = {}) {
    const W = opts.width || 700, H = opts.height || 350;
    const tagCounts = countItems(books.flatMap(b => b.tags));
    const sizeScale = Math.min(W / 700, H / 350);
    const fontScale = d3.scaleSqrt()
      .domain([1, d3.max(tagCounts, d => d.count)])
      .range([16 * sizeScale, 64 * sizeScale]);
    const tagColors = d3.scaleOrdinal()
      .domain(tagCounts.map(d => d.name))
      .range(['#e8a048', '#c0d038', '#58c870', '#e86888', '#a068d8',
              '#4898e0', '#d85858', '#68b848', '#d8a830', '#48b8a8',
              '#9858c8', '#e07840', '#40c890', '#b8c830']);

    const box = makeBox(parent, 'Book Themes', opts);
    const svg = box.append('svg').attr('width', W).attr('height', H);
    svg.append('rect').attr('width', W).attr('height', H)
      .attr('fill', '#888').attr('rx', 12);

    const cloudWords = tagCounts.map(d => ({
      text: d.name, size: fontScale(d.count), count: d.count,
    }));

    d3.layout.cloud()
      .size([W, H]).words(cloudWords).padding(6)
      .rotate(() => (~~(Math.random() * 3) - 1) * 30)
      .font('Arial').fontWeight('bold').fontSize(d => d.size)
      .on('end', words => {
        svg.append('g')
          .attr('transform', `translate(${W / 2},${H / 2})`)
          .selectAll('text').data(words).enter().append('text')
          .style('font-size', d => d.size + 'px')
          .style('font-family', 'Arial').style('font-weight', 'bold')
          .style('fill', d => tagColors(d.text))
          .style('cursor', 'default')
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .text(d => d.text)
          .append('title').text(d => `${d.text}: ${d.count} book${d.count > 1 ? 's' : ''}`);
      })
      .start();

    return svg;
  }

  function renderBookGenres(parent, opts = {}) {
    const genreCounts = countItems(books.flatMap(b => b.genres));
    const margin = { top: 10, right: 30, bottom: 30, left: 110 };
    const W = opts.width || 700;
    const H = genreCounts.length * 40 + margin.top + margin.bottom;
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    const box = makeBox(parent, 'Book Genres', opts);
    const svg = box.append('svg').attr('width', W).attr('height', H);
    svg.append('rect').attr('width', W).attr('height', H)
      .attr('fill', '#888').attr('rx', 12);
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(genreCounts, d => d.count)]).range([0, innerW]);
    const y = d3.scaleBand()
      .domain(genreCounts.map(d => d.name)).range([0, innerH]).padding(0.25);
    const color = d3.scaleOrdinal()
      .domain(genreCounts.map(d => d.name))
      .range(['#e8a048', '#c0d038', '#58c870', '#e86888', '#a068d8',
              '#4898e0', '#d85858', '#68b848', '#d8a830']);

    g.selectAll('rect.bar').data(genreCounts).enter().append('rect')
      .attr('class', 'bar').attr('x', 0).attr('y', d => y(d.name))
      .attr('width', d => x(d.count)).attr('height', y.bandwidth())
      .attr('fill', d => color(d.name)).attr('rx', 5)
      .attr('stroke', d => d3.color(color(d.name)).darker(0.4))
      .attr('stroke-width', 0.5);

    g.selectAll('text.count').data(genreCounts).enter().append('text')
      .attr('class', 'count')
      .attr('x', d => x(d.count) - 8)
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .attr('font-size', '13px').attr('font-weight', 'bold')
      .attr('fill', '#555').text(d => d.count);

    g.selectAll('text.label').data(genreCounts).enter().append('text')
      .attr('class', 'label').attr('x', -8)
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .attr('font-size', '14px').attr('font-weight', 'bold')
      .attr('fill', '#222').text(d => d.name);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(d3.max(genreCounts, d => d.count)).tickFormat(d3.format('d')))
      .selectAll('text').attr('fill', '#222').attr('font-size', '12px');
    g.select('.domain').attr('stroke', '#666');
    g.selectAll('.tick line').attr('stroke', '#666');

    g.append('text')
      .attr('x', innerW / 2).attr('y', innerH + 28)
      .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#333')
      .text('Number of books');

    return svg;
  }

  // Reading-arc chart, parameterized by metric (sentiment / dialogue_ratio).
  function renderArc(parent, { title, metric, yLabel, yFormat, smoothWindow = 5,
                               width = 820, rowHeight = 90, labelW = 200,
                               showZeroLine = false }, opts = {}) {
    const margin = { top: 8, right: 22, bottom: 26, left: 22 };
    const totalW = width;
    const innerW = totalW - labelW - margin.left - margin.right;
    const innerH = rowHeight - margin.top - margin.bottom;
    const fullH = bookOrder.length * rowHeight + 30;

    const box = makeBox(parent, title, opts);
    const svg = box.append('svg').attr('width', totalW).attr('height', fullH);
    svg.append('rect').attr('width', totalW).attr('height', fullH)
      .attr('fill', '#888').attr('rx', 12);

    const tip = getTooltip();

    const allVals = bookOrder.flatMap(t => smooth(bookAnalysis[t][metric], smoothWindow));
    const yMin = d3.min(allVals), yMax = d3.max(allVals);
    const yPad = (yMax - yMin) * 0.08;
    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);

    bookOrder.forEach((titleKey, rowIdx) => {
      const series = smooth(bookAnalysis[titleKey][metric], smoothWindow);
      const sessions = readingSessions[titleKey] || [];
      const mask = readMask(sessions, series.length);
      const color = bookColors[titleKey];

      const g = svg.append('g')
        .attr('transform', `translate(${labelW + margin.left},${margin.top + rowIdx * rowHeight})`);

      g.append('rect')
        .attr('x', -labelW + 12).attr('y', -margin.top + 4)
        .attr('width', labelW + innerW + margin.right - 18)
        .attr('height', rowHeight - 8)
        .attr('fill', '#9b9b9b').attr('rx', 8);

      g.append('text').attr('x', -10).attr('y', innerH / 2 - 6)
        .attr('text-anchor', 'end').attr('font-size', '13px')
        .attr('font-weight', 'bold').attr('fill', '#222')
        .text(titleKey.length > 32 ? titleKey.slice(0, 30) + '…' : titleKey);

      const totalRead = sessions.reduce((s, x) => s + (x.endPct - x.startPct), 0);
      g.append('text').attr('x', -10).attr('y', innerH / 2 + 12)
        .attr('text-anchor', 'end').attr('font-size', '11px').attr('fill', '#333')
        .text(`${sessions.length} session${sessions.length !== 1 ? 's' : ''} · ${totalRead}% read`);

      const y = d3.scaleLinear()
        .domain([yMin - yPad, yMax + yPad]).range([innerH, 0]);

      if (showZeroLine) {
        g.append('line').attr('x1', 0).attr('x2', innerW)
          .attr('y1', y(0)).attr('y2', y(0))
          .attr('stroke', '#bbb').attr('stroke-width', 1)
          .attr('stroke-dasharray', '1,3');
      }

      sessions.forEach(s => {
        g.append('rect').attr('x', x(s.startPct)).attr('y', 0)
          .attr('width', x(s.endPct) - x(s.startPct)).attr('height', innerH)
          .attr('fill', color).attr('opacity', 0.18)
          .style('cursor', 'default')
          .append('title')
          .text(`Read ${s.startPct}%–${s.endPct}%\n${fmtTime(s.start)} → ${fmtTime(s.end)}`);
      });

      const points = series.map((v, i) => ({ pos: i + 0.5, val: v, read: mask[i] }));
      const lineGen = d3.line()
        .x(d => x(d.pos)).y(d => y(d.val)).curve(d3.curveMonotoneX);

      g.append('path').datum(points).attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', 1.4).attr('stroke-dasharray', '2,3')
        .attr('opacity', 0.55).attr('d', lineGen);

      const readLine = d3.line().defined(d => d.read)
        .x(d => x(d.pos)).y(d => y(d.val)).curve(d3.curveMonotoneX);
      g.append('path').datum(points).attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', 2.6).attr('d', readLine);

      g.selectAll('circle.bucket').data(points).enter().append('circle')
        .attr('class', 'bucket').attr('cx', d => x(d.pos)).attr('cy', d => y(d.val))
        .attr('r', d => d.read ? 2.2 : 1.4)
        .attr('fill', d => d.read ? color : '#9b9b9b')
        .attr('stroke', color).attr('stroke-width', d => d.read ? 0 : 0.8)
        .style('cursor', 'default')
        .on('mouseenter', (event, d) => {
          tip.style('opacity', 1).html(
            `<b>${titleKey}</b><br>position: ${Math.round(d.pos)}%<br>${yLabel}: ${yFormat(d.val)}<br><i>${d.read ? 'in a reading session' : 'not read in this period'}</i>`
          );
        })
        .on('mousemove', event => {
          tip.style('left', (event.pageX + 12) + 'px')
             .style('top',  (event.pageY + 12) + 'px');
        })
        .on('mouseleave', () => tip.style('opacity', 0));

      if (rowIdx === bookOrder.length - 1) {
        g.append('g').attr('transform', `translate(0,${innerH})`)
          .call(d3.axisBottom(x).ticks(10).tickFormat(d => d + '%'))
          .selectAll('text').attr('fill', '#222').attr('font-size', '11px');
        g.select('g .domain').attr('stroke', '#555');
        g.append('text').attr('x', innerW / 2).attr('y', innerH + 22)
          .attr('text-anchor', 'middle').attr('font-size', '11px')
          .attr('fill', '#222').text('Position in book');
      } else {
        g.append('line').attr('x1', 0).attr('x2', innerW)
          .attr('y1', innerH).attr('y2', innerH)
          .attr('stroke', '#666').attr('stroke-width', 0.5);
      }
    });

    // Legend strip
    const legend = svg.append('g')
      .attr('transform', `translate(${labelW + margin.left},${fullH - 18})`);
    const items = [
      { label: 'solid line: read in this period', stroke: '#222', w: 2.6, dash: null },
      { label: 'dotted line: not yet read',       stroke: '#222', w: 1.4, dash: '2,3' },
      { label: 'shaded band: reading session range', fill: '#222' },
    ];
    let cursor = 0;
    items.forEach(it => {
      if (it.stroke) {
        legend.append('line').attr('x1', cursor).attr('x2', cursor + 22)
          .attr('y1', 0).attr('y2', 0).attr('stroke', it.stroke)
          .attr('stroke-width', it.w).attr('stroke-dasharray', it.dash || null);
      } else {
        legend.append('rect').attr('x', cursor).attr('y', -6)
          .attr('width', 22).attr('height', 12).attr('fill', it.fill).attr('opacity', 0.25);
      }
      cursor += 28;
      const t = legend.append('text').attr('x', cursor).attr('y', 4)
        .attr('font-size', '11px').attr('fill', '#222').text(it.label);
      cursor += t.node().getComputedTextLength() + 26;
    });

    return svg;
  }

  function renderSentimentArc(parent, opts = {}) {
    return renderArc(parent, {
      title: 'Sentiment Arc · solid where I read, dotted where I haven\'t',
      metric: 'sentiment', yLabel: 'VADER sentiment',
      yFormat: v => v.toFixed(3), showZeroLine: true,
    }, opts);
  }

  function renderDialogueDensity(parent, opts = {}) {
    return renderArc(parent, {
      title: 'Dialogue Density · share of text inside quotes',
      metric: 'dialogue_ratio', yLabel: 'dialogue share',
      yFormat: v => (v * 100).toFixed(1) + '%',
    }, opts);
  }

  function renderReadingScatter(parent, opts = {}) {
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const W = opts.width || 720, H = opts.height || 380;
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    const points = [];
    bookOrder.forEach(titleKey => {
      const a = bookAnalysis[titleKey];
      (readingSessions[titleKey] || []).forEach((s, idx) => {
        const minutes = (s.end - s.start) / 60000;
        const range = s.endPct - s.startPct;
        points.push({
          title: titleKey, sessionIdx: idx + 1,
          startPct: s.startPct, endPct: s.endPct, start: s.start, end: s.end,
          minutes, rate: range / minutes,
          avgSent: avgInRange(a.sentence_length, s.startPct, s.endPct),
          avgDlg:  avgInRange(a.dialogue_ratio,  s.startPct, s.endPct),
        });
      });
    });

    const box = makeBox(parent, 'Reading speed vs sentence length of section read', opts);
    const svg = box.append('svg').attr('width', W).attr('height', H);
    svg.append('rect').attr('width', W).attr('height', H)
      .attr('fill', '#888').attr('rx', 12);
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain(d3.extent(points, d => d.avgSent)).nice().range([0, innerW]);
    const y = d3.scaleLinear().domain([0, d3.max(points, d => d.rate) * 1.1]).range([innerH, 0]);
    const r = d3.scaleSqrt().domain([0, d3.max(points, d => d.minutes)]).range([0, 28]);

    g.append('g').attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll('text').attr('fill', '#222').attr('font-size', '11px');
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(d => d.toFixed(2)))
      .selectAll('text').attr('fill', '#222').attr('font-size', '11px');
    g.selectAll('.domain, .tick line').attr('stroke', '#555');

    g.append('text').attr('x', innerW / 2).attr('y', innerH + 36)
      .attr('text-anchor', 'middle').attr('fill', '#222').attr('font-size', '12px')
      .text('avg words / sentence in the section read →');
    g.append('text')
      .attr('transform', `rotate(-90) translate(${-innerH / 2},-44)`)
      .attr('text-anchor', 'middle').attr('fill', '#222').attr('font-size', '12px')
      .text('reading pace (% of book per minute) →');

    g.selectAll('circle.session').data(points).enter().append('circle')
      .attr('class', 'session')
      .attr('cx', d => x(d.avgSent)).attr('cy', d => y(d.rate))
      .attr('r', d => Math.max(6, r(d.minutes)))
      .attr('fill', d => bookColors[d.title]).attr('opacity', 0.78)
      .attr('stroke', d => d3.color(bookColors[d.title]).darker(0.6)).attr('stroke-width', 1.2)
      .style('cursor', 'default')
      .append('title')
      .text(d =>
        `${d.title} (session ${d.sessionIdx})\n` +
        `${fmtTime(d.start)} → ${fmtTime(d.end)}\n` +
        `${d.minutes.toFixed(0)} min · ${(d.endPct - d.startPct)}% of book\n` +
        `pace: ${d.rate.toFixed(3)} %/min\n` +
        `avg sentence: ${d.avgSent.toFixed(1)} words\n` +
        `dialogue share: ${(d.avgDlg * 100).toFixed(1)}%`
      );

    g.selectAll('text.sessLab').data(points).enter().append('text')
      .attr('class', 'sessLab')
      .attr('x', d => x(d.avgSent) + Math.max(6, r(d.minutes)) + 4)
      .attr('y', d => y(d.rate) + 4)
      .attr('font-size', '10.5px').attr('fill', '#111')
      .text(d => {
        const short = d.title.length > 22 ? d.title.slice(0, 20) + '…' : d.title;
        return `${short} · ${d.startPct}–${d.endPct}%`;
      });

    const sizeLegend = g.append('g')
      .attr('transform', `translate(${innerW - 110},10)`);
    sizeLegend.append('text').attr('font-size', '11px').attr('fill', '#222')
      .attr('font-weight', 'bold').text('bubble = session length');
    [60, 150, 240].forEach((m, i) => {
      sizeLegend.append('circle')
        .attr('cx', 16 + i * 36).attr('cy', 32).attr('r', r(m))
        .attr('fill', 'none').attr('stroke', '#222').attr('stroke-width', 1);
      sizeLegend.append('text').attr('x', 16 + i * 36).attr('y', 56)
        .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#222')
        .text(`${m}m`);
    });

    return svg;
  }

  // ════════════════════════════════════════════════════════════════
  //  MUSIC CHARTS
  // ════════════════════════════════════════════════════════════════

  function renderMusicGenreArea(parent, opts = {}) {
    const margin = { top: 15, right: 160, bottom: 45, left: 50 };
    const W = opts.width || 900, H = opts.height || 400;
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;
    const tip = getTooltip();

    const box = makeBox(parent, 'Music Genre Breakdown by Day', opts);
    const svg = box.append('svg').attr('width', W).attr('height', H);
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#888').attr('rx', 12);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(musicGenreByDay.map(d => d.day)).range([0, w]).padding(0.1);
    const stack = d3.stack().keys(musicGenres).order(d3.stackOrderReverse);
    const series = stack(musicGenreByDay);
    const yMax = d3.max(series, s => d3.max(s, d => d[1]));
    const y = d3.scaleLinear().domain([0, yMax]).nice().range([h, 0]);

    const area = d3.area()
      .x(d => x(d.data.day)).y0(d => y(d[0])).y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    g.selectAll('.grid').data(y.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#999').attr('stroke-width', 0.5);

    series.forEach(s => {
      const genre = s.key;
      g.append('path').datum(s).attr('d', area)
        .attr('fill', musicGenreColors[genre])
        .attr('stroke', d3.color(musicGenreColors[genre]).darker(0.4))
        .attr('stroke-width', 0.5).style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('opacity', 0.8);
          tip.style('opacity', 1);
        })
        .on('mousemove', function (event) {
          const [mx] = d3.pointer(event, g.node());
          const positions = musicGenreByDay.map(d => x(d.day));
          let closest = 0, minDist = Infinity;
          positions.forEach((px, i) => {
            const dist = Math.abs(mx - px);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          const val = musicGenreByDay[closest][genre] || 0;
          tip.html(`<strong>${genre}</strong><br>${musicDayLabels[closest]}: ${val} tracks`)
            .style('left', (event.pageX + 12) + 'px')
            .style('top',  (event.pageY - 30) + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', 1);
          tip.style('opacity', 0);
        });
    });

    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).tickFormat((d, i) => musicDayLabels[i]))
      .selectAll('text').attr('fill', '#222').attr('font-size', '12px')
      .attr('transform', 'rotate(-25)').attr('text-anchor', 'end');
    g.select('.domain').attr('stroke', '#666');
    g.selectAll('.tick line').attr('stroke', '#666');

    g.append('g').call(d3.axisLeft(y).ticks(5))
      .selectAll('text').attr('fill', '#222').attr('font-size', '11px');
    g.selectAll('.domain, .tick line').attr('stroke', '#666');

    g.append('text').attr('x', -h / 2).attr('y', -38)
      .attr('transform', 'rotate(-90)').attr('text-anchor', 'middle')
      .attr('fill', '#333').attr('font-size', '12px').text('Tracks');

    const legend = g.append('g').attr('transform', `translate(${w + 18}, 5)`);
    musicGenres.forEach((genre, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
      row.append('rect').attr('width', 14).attr('height', 14).attr('rx', 3)
        .attr('fill', musicGenreColors[genre])
        .attr('stroke', d3.color(musicGenreColors[genre]).darker(0.4))
        .attr('stroke-width', 0.5);
      row.append('text').attr('x', 20).attr('y', 11)
        .attr('fill', '#222').attr('font-size', '12px').text(genre);
    });

    return svg;
  }

  function renderMusicDecadeBar(parent, opts = {}) {
    const margin = { top: 15, right: 20, bottom: 45, left: 55 };
    const W = opts.width || 650, H = opts.height || 350;
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;
    const tip = getTooltip();

    const box = makeBox(parent, 'Music by Release Decade', opts);
    const svg = box.append('svg').attr('width', W).attr('height', H);
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#888').attr('rx', 12);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(musicDecades.map(d => d.decade)).range([0, w]).padding(0.25);
    const y = d3.scaleLinear().domain([0, d3.max(musicDecades, d => d.count)]).nice().range([h, 0]);

    g.selectAll('.grid').data(y.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', '#999').attr('stroke-width', 0.5);

    const color = d3.scaleOrdinal()
      .domain(musicDecades.map(d => d.decade))
      .range(['#a068d8', '#48c0b0', '#4898e0', '#c0d038', '#58c870', '#e86888', '#a0a0a0']);

    const total = d3.sum(musicDecades, d => d.count);
    g.selectAll('rect.bar').data(musicDecades).enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.decade)).attr('y', d => y(d.count))
      .attr('width', x.bandwidth()).attr('height', d => h - y(d.count))
      .attr('fill', d => color(d.decade)).attr('rx', 5)
      .attr('stroke', d => d3.color(color(d.decade)).darker(0.4)).attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        const pct = ((d.count / total) * 100).toFixed(1);
        tip.html(`<strong>${d.decade}</strong><br>${d.count} tracks (${pct}%)`)
          .style('left', (event.pageX + 12) + 'px')
          .style('top',  (event.pageY - 30) + 'px')
          .style('opacity', 1);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        tip.style('opacity', 0);
      });

    g.selectAll('text.count').data(musicDecades).enter().append('text')
      .attr('class', 'count')
      .attr('x', d => x(d.decade) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 6)
      .attr('text-anchor', 'middle').attr('font-size', '12px')
      .attr('font-weight', 'bold').attr('fill', '#333').text(d => d.count);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x))
      .selectAll('text').attr('fill', '#222').attr('font-size', '12px');
    g.select('.domain').attr('stroke', '#666');
    g.selectAll('.tick line').attr('stroke', '#666');

    g.append('g').call(d3.axisLeft(y).ticks(5))
      .selectAll('text').attr('fill', '#222').attr('font-size', '11px');
    g.selectAll('.domain, .tick line').attr('stroke', '#666');

    g.append('text').attr('x', -h / 2).attr('y', -40)
      .attr('transform', 'rotate(-90)').attr('text-anchor', 'middle')
      .attr('fill', '#333').attr('font-size', '12px').text('Tracks');

    svg.append('text').attr('x', W / 2).attr('y', H - 4)
      .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#666')
      .text("Release years via MusicBrainz. 'Unknown' = no matching release found.");

    return svg;
  }

  // ════════════════════════════════════════════════════════════════
  //  SCHEDULE CHART
  // ════════════════════════════════════════════════════════════════

  function renderSchedule(parent, opts = {}) {
    const sel = asSel(parent);
    const margin = { top: 58, right: 8, bottom: 35, left: 78 };
    const colWidth = opts.colWidth || 160;
    const gridHeight = opts.gridHeight || 700;

    // Parse CSV
    const raw = d3.csvParse(scheduleCsv);
    const entries = raw.map(d => ({
      type: d.Type.trim(),
      start: new Date(d['Start Date'].trim()),
      end: new Date(d['End Date'].trim()),
    })).filter(d => !isNaN(d.start) && !isNaN(d.end));

    function toDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const allDates = entries.flatMap(e => [e.start, e.end]);
    const minDay = toDay(d3.min(allDates));
    const days = [];
    for (let i = 0; i < 8; i++) {
      days.push(new Date(minDay.getFullYear(), minDay.getMonth(), minDay.getDate() + i));
    }

    const segments = [];
    entries.forEach(entry => {
      let current = new Date(entry.start);
      const end = entry.end;
      while (current < end) {
        const dStart = toDay(current);
        const nextDay = new Date(dStart.getFullYear(), dStart.getMonth(), dStart.getDate() + 1);
        const segEnd = end < nextDay ? end : nextDay;
        const startMin = (current - dStart) / 60000;
        const endMin   = (segEnd - dStart) / 60000;
        if (endMin > startMin) {
          const dayIdx = days.findIndex(d => d.getTime() === dStart.getTime());
          if (dayIdx >= 0) segments.push({ type: entry.type, dayIndex: dayIdx, startMin, endMin });
        }
        current = nextDay;
      }
    });

    const width  = margin.left + days.length * colWidth + margin.right;
    const height = margin.top + gridHeight + margin.bottom;

    const svg = sel.append('svg').attr('width', width).attr('height', height);
    svg.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', '#ddd').attr('rx', 18);

    const yScale = d3.scaleLinear()
      .domain([0, 1440]).range([margin.top, margin.top + gridHeight]);

    const timeMarks = [
      { min: 0,    label: '12:00AM' },
      { min: 360,  label: '6:00AM' },
      { min: 720,  label: '12:00PM' },
      { min: 1080, label: '6:00PM' },
      { min: 1440, label: '12:00AM' },
    ];

    timeMarks.forEach(t => {
      const yPx = yScale(t.min);
      svg.append('line')
        .attr('x1', margin.left).attr('x2', width - margin.right)
        .attr('y1', yPx).attr('y2', yPx)
        .attr('stroke', '#888').attr('stroke-width', 1);
      svg.append('text')
        .attr('x', margin.left - 8).attr('y', yPx)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
        .attr('fill', '#222').attr('font-size', '13px').attr('font-weight', 'bold')
        .text(t.label);
    });

    days.forEach((day, i) => {
      const xPx = margin.left + i * colWidth;
      svg.append('line')
        .attr('x1', xPx).attr('x2', xPx)
        .attr('y1', margin.top).attr('y2', margin.top + gridHeight)
        .attr('stroke', '#888').attr('stroke-width', 1);
      svg.append('line')
        .attr('x1', xPx + colWidth / 2).attr('x2', xPx + colWidth / 2)
        .attr('y1', margin.top).attr('y2', margin.top + gridHeight)
        .attr('stroke', '#888').attr('stroke-width', 0.5).attr('opacity', 0.4);
      svg.append('text')
        .attr('x', xPx + colWidth / 2).attr('y', margin.top - 28)
        .attr('text-anchor', 'middle').attr('font-size', '15px')
        .attr('font-style', 'italic').attr('font-weight', 'bold')
        .attr('fill', '#222').attr('text-decoration', 'underline')
        .text(scheduleDayLabels[day.getDay()]);
      svg.append('text')
        .attr('x', xPx + colWidth * 0.25).attr('y', margin.top - 8)
        .attr('text-anchor', 'middle').attr('font-size', '13px').text('\u{1F441}');
      svg.append('text')
        .attr('x', xPx + colWidth * 0.75).attr('y', margin.top - 8)
        .attr('text-anchor', 'middle').attr('font-size', '13px').text('\u{266B}');
    });

    svg.append('line')
      .attr('x1', margin.left + days.length * colWidth)
      .attr('x2', margin.left + days.length * colWidth)
      .attr('y1', margin.top).attr('y2', margin.top + gridHeight)
      .attr('stroke', '#888').attr('stroke-width', 1);

    segments.forEach(seg => {
      const config = scheduleTypeConfig[seg.type];
      if (!config) return;
      const dayX = margin.left + seg.dayIndex * colWidth;
      const yPx = yScale(seg.startMin);
      const h = Math.max(yScale(seg.endMin) - yPx, 2);
      const pad = 3;
      let xPx, w;
      if (config.visual && config.audio) {
        xPx = dayX + pad; w = colWidth - 2 * pad;
      } else if (config.visual) {
        xPx = dayX + pad; w = colWidth / 2 - pad - 1;
      } else {
        xPx = dayX + colWidth / 2 + 1; w = colWidth / 2 - pad - 1;
      }
      const rect = svg.append('rect')
        .attr('x', xPx).attr('y', yPx).attr('width', w).attr('height', h)
        .attr('fill', config.color).attr('rx', 4)
        .attr('stroke', d3.color(config.color).darker(0.4)).attr('stroke-width', 0.5)
        .attr('opacity', 0.9).style('cursor', 'pointer');
      const fmt = mins => {
        const hh = Math.floor(mins / 60);
        const mm = Math.round(mins % 60);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${ampm}`;
      };
      rect.append('title')
        .text(`${seg.type}: ${fmt(seg.startMin)} – ${fmt(seg.endMin)}`);
    });

    const legendEntries = Object.entries(scheduleTypeConfig);
    const legendY = margin.top + gridHeight + 10;
    legendEntries.forEach(([type, config], i) => {
      const xPx = margin.left + i * 160;
      svg.append('rect')
        .attr('x', xPx).attr('y', legendY)
        .attr('width', 14).attr('height', 14)
        .attr('fill', config.color).attr('rx', 3)
        .attr('stroke', d3.color(config.color).darker(0.4)).attr('stroke-width', 0.5);
      const label = config.visual && config.audio
        ? `${type} (visual + audio)`
        : config.visual ? `${type} (visual)` : `${type} (audio)`;
      svg.append('text')
        .attr('x', xPx + 20).attr('y', legendY + 11)
        .attr('font-size', '12px').attr('fill', '#222').text(label);
    });

    return svg;
  }

  // ════════════════════════════════════════════════════════════════
  //  SVG DOWNLOAD BUTTONS
  // ════════════════════════════════════════════════════════════════

  function downloadSvg(svgEl, filename) {
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n', xml],
      { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function slug(s, fallback) {
    return ((s || '').trim().toLowerCase()
      .replace(/[^\w\s\-]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      .replace(/^-|-$/g, '').slice(0, 80)) || fallback;
  }

  function makeDownloadBtn(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'background:#333;color:#eee;border:1px solid #222;' +
      'border-radius:6px;padding:5px 11px;font:11px Arial,Helvetica,sans-serif;' +
      'cursor:pointer;margin:10px auto 0;display:block;letter-spacing:0.3px';
    btn.addEventListener('mouseenter', () => btn.style.background = '#555');
    btn.addEventListener('mouseleave', () => btn.style.background = '#333');
    btn.addEventListener('click', onClick);
    return btn;
  }

  function attachDownloadButtons() {
    const pageSlug = slug(document.title, 'chart');
    const boxes = document.querySelectorAll('.chart-box');
    if (boxes.length) {
      boxes.forEach((box, i) => {
        const svg = box.querySelector('svg'); if (!svg) return;
        const titleEl = box.querySelector('h2');
        const title = titleEl ? titleEl.textContent : 'chart-' + (i + 1);
        box.appendChild(makeDownloadBtn('⬇ Download SVG',
          () => downloadSvg(svg, pageSlug + '_' + slug(title, 'chart-' + (i + 1)) + '.svg')));
      });
    } else {
      document.querySelectorAll('body > svg').forEach((svg, i) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center';
        svg.parentNode.insertBefore(wrap, svg);
        wrap.appendChild(svg);
        wrap.appendChild(makeDownloadBtn('⬇ Download SVG',
          () => downloadSvg(svg, pageSlug + '_' + (i + 1) + '.svg')));
      });
    }
  }

  // ════════════════════════════════════════════════════════════════
  //  EXPORT
  // ════════════════════════════════════════════════════════════════
  global.ChartLib = {
    data: {
      books, bookAnalysis, readingSessions, bookOrder, bookColors,
      musicGenreByDay, musicGenres, musicDayLabels, musicDecades, musicGenreColors,
      scheduleCsv, scheduleTypeConfig, scheduleDayLabels,
    },
    renderBookThemes, renderBookGenres, renderSentimentArc,
    renderDialogueDensity, renderReadingScatter,
    renderMusicGenreArea, renderMusicDecadeBar, renderSchedule,
    attachDownloadButtons, downloadSvg,
  };
})(window);
