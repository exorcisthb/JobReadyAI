const INTERVIEW_STATUSES = ["in_progress", "evaluating", "completed", "abandoned", "insufficient_data", "evaluation_failed"];

// Older databases use an enum; fresh databases use varchar. Preserve both layouts.
export async function ensureInterviewStatusValues(query) {
  const result = await query(`
    SELECT namespace.nspname AS schema_name, type.typname AS type_name, array_agg(value.enumlabel::text) AS labels
    FROM pg_attribute attribute
    JOIN pg_type type ON type.oid = attribute.atttypid AND type.typtype = 'e'
    JOIN pg_namespace namespace ON namespace.oid = type.typnamespace
    JOIN pg_enum value ON value.enumtypid = type.oid
    WHERE attribute.attrelid = to_regclass('interview_sessions') AND attribute.attname = 'status' AND NOT attribute.attisdropped
    GROUP BY namespace.nspname, type.typname
  `);
  const enumType = result.rows[0];
  if (!enumType) return;
  const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`;
  for (const status of INTERVIEW_STATUSES) {
    if (enumType.labels.includes(status)) continue;
    await query(`ALTER TYPE ${quote(enumType.schema_name)}.${quote(enumType.type_name)} ADD VALUE IF NOT EXISTS '${status}'`);
  }
}
