# Database Setup Instructions

## Quick Start

Run these commands in order:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Create the database and push the schema
npx prisma db push

# 3. (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

## What This Does

1. **`prisma generate`** - Generates the TypeScript client from your `schema.prisma` file
2. **`prisma db push`** - Creates the SQLite database file at `prisma/dev.db` and applies your schema
3. **`prisma studio`** - Opens a web interface to view and edit your database

## Verify Setup

After running these commands, you should see:
- A new file: `prisma/dev.db` (your SQLite database)
- No more TypeScript errors in `backend/lib/prisma.ts`

## Troubleshooting

If you get errors:
- Make sure you're in the project root directory
- Try using `bunx` instead of `npx`: `bunx prisma generate`
