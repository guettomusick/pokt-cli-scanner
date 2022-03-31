#!/usr/bin/env node
require('isomorphic-fetch');
const fs = require('fs');

const queryBlock = async (height, skipPersist) => {
  try {
    const block = await fetch("https://mainnet.gateway.pokt.network/v1/lb/60a2ac11b1747c6552385c61/v1/query/block", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "es,en-US;q=0.9,en;q=0.8,pt;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://explorer.pokt.network/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `{\"height\":${height}}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    const jsonBlock = await block.json();
    if (!skipPersist) {
      try {
        fs.mkdirSync(`./blocks`);
      } catch(e) {}
      fs.writeFileSync(`./blocks/${height}.json`, JSON.stringify(jsonBlock, null, 2));
      console.log(`Output saved on ./blocks/${height}.json`);
    }
    return jsonBlock;
  } catch(e) {
    console.error(e)
  }
}

const queryTxs = async (height, page, limit, prove, skipPersist) => {
  try {
    const block = await fetch("https://mainnet.gateway.pokt.network/v1/lb/60a2ac11b1747c6552385c61/v1/query/blocktxs", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "es,en-US;q=0.9,en;q=0.8,pt;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://explorer.pokt.network/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"height\":${height},\"page\":${page},\"per_page\":${limit},\"prove\":${prove}}`,
      "method": "POST"
    });
    const jsonBlock = await block.json();
    if (!skipPersist) {
      try {
        fs.mkdirSync(`./txs`);
      } catch(e) {}
      fs.writeFileSync(`./txs/${height}-${page}_${limit}.json`, JSON.stringify(jsonBlock, null, 2));
      console.log(`Output saved on ./txs/${height}-${page}_${limit}.json - format is [height]-[page]_[limit].json`);
    }
    return jsonBlock;
  } catch(e) {
    console.error(e)
  }
}

const queryAllTxs = async (height, prove, skipPersist) => {
  console.log('Querying all transactions for block', height);
  const { block } = await queryBlock(height);
  const numTxs = block.header.num_txs;
  const numPages = Math.ceil(numTxs / 100);
  const allTxs = [];
  for (let i = 0; i < numPages; i++) {
    console.log(`Querying page ${i+1} of ${numPages+1}`);
    const {txs, total_count} = await queryTxs(height, i+1, 100, prove, true);
    if (total_count === 0) {
      break;
    }

    allTxs.push(...txs);
  }
  
  if (!skipPersist) {
    try {
      fs.mkdirSync(`./txs`);
    } catch(e) {}
    fs.writeFileSync(`./txs/${height}.json`, JSON.stringify(jsonBlock, null, 2));
    console.log(`Output saved on ./txs/${height}.json - format is [height].json`);
  }
  return allTxs;
}

const queryTx = async (hash, skipPersist) => {
  try {
    const block = await fetch("https://mainnet.gateway.pokt.network/v1/lb/60a2ac11b1747c6552385c61/v1/query/tx", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "es,en-US;q=0.9,en;q=0.8,pt;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referer": "https://explorer.pokt.network/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"hash\":\"${hash}\"}`,
      "method": "POST"
    });;
    const jsonBlock = await block.json();
    if (!skipPersist) {
      try {
        fs.mkdirSync(`./tx`);
      } catch(e) {}
      fs.writeFileSync(`./tx/${hash}.json`, JSON.stringify(jsonBlock, null, 2));
      console.log(`Output saved on ./tx/${hash}.json`);
    }
    return jsonBlock;
  } catch(e) {
    console.error(e)
  }
}

switch (process.argv[2]) {
  case 'block':
    queryBlock(process.argv[3]);
    break;
  case 'alltxs':
    queryAllTxs(process.argv[3], Boolean(process.argv[6] || 'false'));
    break;
  case 'txs':
    queryTxs(process.argv[3], process.argv[4] || '1', process.argv[5] || '100', Boolean(process.argv[6] || 'false'));
    break;
  case 'tx':
    queryTx(process.argv[3]);
    break;
  default:
    console.log('Usage: node . [block|alltxs|txs|tx] height/hash [page] [limit] [prove]');
}

  