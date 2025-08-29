import { ExchangeName } from './types';

export type ExchangeMeta = {
  displayName: string;
  color: string;
  appIds: string[];
  iconUrl: string;
};

// prettier-ignore
export const EXCHANGE_META: Record<ExchangeName, ExchangeMeta> = {
  binance: { displayName: "Binance", appIds: ["1436799971", "1492670702"], color: 'rgb(253, 196, 0)', iconUrl: "https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/c6/a1/1b/c6a11b90-e4aa-5ebe-0bb7-4f388cd796a0/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.png" },
  bitfinex: { displayName: "Bitfinex", appIds: ["1436383182"], color: 'rgb(0, 206, 152)', iconUrl: "https://is2-ssl.mzstatic.com/image/thumb/Purple122/v4/81/dd/42/81dd42bd-7eca-299f-e538-adbf8b3eb312/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png" },
  bybit: { displayName: "Bybit", appIds: ["1488296980"], color: 'rgb(255, 161, 0)', iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/42/99/d8/4299d8c2-f291-1b6c-f736-1db4000923ca/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
  coinbase: { displayName: "Coinbase", appIds: ["886427730"], color: 'rgb(0, 84, 255)', iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ab/37/b0/ab37b043-ef79-a2a8-3e87-0b3cdbd7819c/AppIcon-0-0-1x_U007ephone-0-1-0-85-220.png/512x512bb.png" },
  cryptocom: { displayName: "Crypto.com", appIds: ["1262148500"], color: 'rgb(0, 45, 128)', iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/82/fd/1e/82fd1ee9-304d-d9c3-0ee5-2e7d5fdfcf2c/AppIcon-0-0-1x_U007emarketing-0-6-0-sRGB-85-220.png/512x512bb.png" },
  gemini: { displayName: "Gemini", appIds: ["1408914447"], color: 'rgb(231, 83, 39)', iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/84/b1/d6/84b1d689-4e5e-17d2-72ee-805378a98420/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.png" },
  huobi: { displayName: "Huobi", appIds: ["1023263342"], color: 'rgb(255, 255, 255)', iconUrl: "https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/24/26/6c/24266c34-f4fe-e57b-2f82-5d3d5a27f3a1/ProIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png" },
  // Includes Kraken, Krak, Kraken Pro
  kraken: { displayName: "Kraken", appIds: ["1481947260", "6738051700", "1473024338"], color: 'rgb(158, 81, 198)', iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c3/33/af/c333af5a-5455-cbba-8826-eaa5f2f33bb2/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.png" },
  kucoin: { displayName: "KuCoin", appIds: ["1378956601"], color: 'rgb(0, 177, 137)', iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple113/v4/90/b8/f9/90b8f9b0-82ca-62ed-8dea-a88d1f1adf68/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
  okx: { displayName: "OKX", appIds: ["1327268470"], color: 'rgb(80, 80, 80)', iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple122/v4/1c/e7/fd/1ce7fd30-3927-1894-fe67-277b3e13d4f1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
};
