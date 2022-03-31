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