

# 什么时候会查交换结果
```javascript
// src/index.tsx -> src/pages/App.tsx

useTradeExactInV2 (Trades.ts:217)
useDerivedSwapInfoV2 (useAggregator.ts:80)
Swap (index.tsx:131)

触发Swap组件重渲染就会查aggregatorAPI接口,3个东西能自动触发重渲染
1.App.tsx 轮询fetchGas
2.RefreshButton 轮询触发Trades.ts的useTradeExactInV2的onUpdateCallback触发bestTradeExactIn去查
    https://aggregatorAPI/ethereum/route?tokenIn=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&tokenOut=0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202
    &amountIn=1000000000000000000&saveGas=0&gasInclude=0&gasPrice=25000000000
3.ethers库轮询blockNumberCallback
```

# 价格影响的计算方法

在src/utils/aggregator.ts的bestTradeExactIn方法里

# 目录结构

```
 ├─apollo GraphQL查子图用的
├─assets 都是svg或png图片
│  ├─images
│  ├─networks
│  └─svg
├─components 74组件
├─connectors web3连接器,连接到区块链
├─constants 一大堆资源,交易所,token列表,各种合约地址
│  ├─abis
│  ├─multicall 是multicall的abis
│  └─tokenLists 
├─data
├─hooks
├─locales
├─pages 11页面
│  ├─About
│  ├─AddLiquidity
│  ├─CreatePool
│  ├─CreateReferral
│  ├─Pool
│  ├─PoolFinder
│  ├─Pools
│  ├─RemoveLiquidity
│  ├─Swap
│  ├─SwapV2
│  └─Yield
├─state 16状态
│  ├─about
│  ├─application
│  ├─burn
│  ├─farms
│  ├─global
│  ├─lists
│  ├─mint
│  ├─multicall
│  ├─pair
│  ├─pools
│  ├─stake
│  ├─swap
│  ├─transactions
│  ├─user
│  ├─vesting
│  └─wallet
├─theme
└─utils
```

# KyberSwap Interface

An open source interface for KyberSwap -- a protocol for decentralized exchange.
Forked from [Uniswap/uniswap-interface](https://github.com/Uniswap/uniswap-interface)

- Website: [kyberswap.com](https://kyberswap.com/)
- Whitepaper: [Link](https://files.kyber.network/DMM-Feb21.pdf)

## Accessing the KyberSwap Interface

To access the KyberSwap Interface, visit [kyberswap.com](https://kyberswap.com/)

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

## Contributions

**Please open all pull requests against the `main` branch.**
CI checks will run against all PRs.
