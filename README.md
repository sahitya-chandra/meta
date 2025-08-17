```
meta/
│── package.json         # root dependencies + scripts
│── tsconfig.json        # shared tsconfig for base configs
│── prisma/              # shared Prisma schema + migrations
│   ├── schema.prisma
│   ├── migrations/
│
│── apps/
│   ├── web/             # Next.js (frontend + APIs + auth.js)
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── app/
|   |   |   public/
│   │   └── tsconfig.json
│   │
│   └── server/          # Express + Socket.IO
│       ├── package.json
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
│
│── packages/
│   ├── db/              # Shared Prisma client
│   │   ├── package.json
│   │   ├── index.ts     # exports PrismaClient instance
│   │   └── tsconfig.json
│   │
│   └── utils/           # Shared utils (optional, e.g., constants, types)
│       ├── package.json
│       ├── index.ts
│       └── tsconfig.json
```