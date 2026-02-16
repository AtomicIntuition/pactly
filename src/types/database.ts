// Minimal Supabase database types for TypeScript
// This prevents 'never' type inference on untyped Supabase clients
// Generate full types with: npx supabase gen types typescript

type TableDef = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: never[];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef;
      clients: TableDef;
      proposals: TableDef;
      templates: TableDef;
      activity_log: TableDef;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
