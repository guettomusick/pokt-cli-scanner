# Pokt CLI  Scanner
## Init
```
npm install
```

## query a block

```
./scan.js block {height}
```

or

```
node . block {height}
```

## query txs in a block

### Manual pagination
page defaults to 1
limit defaults to 100
prove defaults to false

```
./scan.js txs {height} [page] [limit] [prove]
```

or

```
node . txs {height} [page] [limit] [prove]
```

### All txs
This is a slow command for blocks with lot of transactions since we need to query all pages with a page limit of 100. It could take some minutes to retrieve the entire block data

```
./scan.js txs {height}
```

or

```
node . txs {height}
```

## query tx

```
./scan.js tx {hash}
```

or

```
node . tx {hash}
```

## Output
Result will be stored locally on a [block|txs|ts] folder as a json file