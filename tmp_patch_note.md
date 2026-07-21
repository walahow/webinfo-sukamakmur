Patching strategy:
- For /api/katalog (POST) and /api/katalog/[id] (PUT), query information_schema.columns for the table 'katalog' and filter payload keys to only include existing columns.
- Keep original validation (required fields) but perform filtering before prisma calls.
- Return error.message/details in JSON in development to help debugging.

Files to modify:
- src/app/api/katalog/route.ts (POST)
- src/app/api/katalog/[id]/route.ts (PUT)
