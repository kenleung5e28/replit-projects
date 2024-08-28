const pc1 = [
  57, 49, 41, 33, 25, 17,  9,
   1, 58, 50, 42, 34, 26, 18,
  10,  2, 59, 51, 43, 35, 27,
  19, 11,  3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
   7, 62, 54, 46, 38, 30, 22,
  14,  6, 61, 53, 45, 37, 29,
  21, 13,  5, 28, 20, 12,  4
];

const pc2 = [
  14, 17, 11, 24,  1,  5,
   3, 28, 15,  6, 21, 10,
  23, 19, 12,  4, 26,  8,
  16,  7, 27, 20, 13,  2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32
];

const lsCounts = [
  1, 1, 2, 2, 2, 2, 2, 2,
  1, 2, 2, 2, 2, 2, 2, 1
];

const h2b = hexs => hexs.map(h => parseInt(h, 16).toString(2).padStart(4 * h.length, '0')).join('');

const b2h = bin => {
  if (bin.length % 4 !== 0)
    throw new Error('String length must be a multiple of 4');
  let h = '';
  let i = 0;
  while (i < bin.length) {
    const part = bin.substr(i, 4);
    h += parseInt(part, 2).toString(16).toUpperCase();
    i += 4;
  }
  return h;
};

const ls = (str, n) => {
  let l = str;
  for (let i = 0; i < n; i++)
    l = l.substr(1) + l[0];
  return l;
};

const generateSubkeys = desKey => {
  const key = Array.isArray(desKey) ? h2b(desKey) : desKey;

  let c0 = '';
  for (let i = 0; i < 28; i++)
    c0 += key[pc1[i] - 1];
  let d0 = '';
  for (let i = 28; i < 56; i++)
    d0 += key[pc1[i] - 1];
  
  let c = c0;
  let d = d0;
  const subkeys = [];
  for (let i = 0; i < 16; i++) {
    c = ls(c, lsCounts[i]);
    d = ls(d, lsCounts[i]);
    let cd = c + d;
    let k = '';
    for (let i = 0; i < 48; i++) {
      k += cd[pc2[i] - 1];
    }
    subkeys.push(k);
  }
  
  return subkeys.map(k => b2h(k));
};

const WEAK_KEYS = [
  ['0101', '0101', '0101', '0101'],
  ['FEFE', 'FEFE', 'FEFE', 'FEFE'],
  ['1F1F', '1F1F', '0E0E', '0E0E'],
  ['E0E0', 'E0E0', 'F1F1', 'F1F1']
];

for (let k of WEAK_KEYS) {
  console.log(`KEY = ${k}`);
  console.log(generateSubkeys(k));
  console.log('========');
}

const DUAL_KEYS = [
  ['01FE', '01FE', '01FE', '01FE'],
  ['FE01', 'FE01', 'FE01', 'FE01']
];

for (let k of DUAL_KEYS) {
  console.log(`KEY = ${k}`);
  console.log(generateSubkeys(k));
  console.log('========');
}