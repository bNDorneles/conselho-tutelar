export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          role: Database["public"]["Enums"]["profile_role"];
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          role?: Database["public"]["Enums"]["profile_role"];
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          role?: Database["public"]["Enums"]["profile_role"];
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conselho_tutelar: {
        Row: {
          id: string;
          nome: string;
          municipio: string;
          uf: string;
          endereco: string | null;
          telefone: string | null;
          email: string | null;
          horario_atendimento: string | null;
          whatsapp: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          mapa_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          municipio: string;
          uf: string;
          endereco?: string | null;
          telefone?: string | null;
          email?: string | null;
          horario_atendimento?: string | null;
          whatsapp?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          mapa_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          municipio?: string;
          uf?: string;
          endereco?: string | null;
          telefone?: string | null;
          email?: string | null;
          horario_atendimento?: string | null;
          whatsapp?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          mapa_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      motivos_denuncia: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      denuncias: {
        Row: {
          id: string;
          motivo_id: string;
          status: Database["public"]["Enums"]["denuncia_status"];
          relato: string;
          local_ocorrencia: string | null;
          vitima_nome_informado: string | null;
          vitima_idade_informada: number | null;
          vitima_endereco_informado: string | null;
          vitima_nome_pai_informado: string | null;
          vitima_nome_mae_informado: string | null;
          vitima_escola_informada: string | null;
          vitima_genero_informado: string | null;
          observacoes_internas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          motivo_id: string;
          status?: Database["public"]["Enums"]["denuncia_status"];
          relato: string;
          local_ocorrencia?: string | null;
          vitima_nome_informado?: string | null;
          vitima_idade_informada?: number | null;
          vitima_endereco_informado?: string | null;
          vitima_nome_pai_informado?: string | null;
          vitima_nome_mae_informado?: string | null;
          vitima_escola_informada?: string | null;
          vitima_genero_informado?: string | null;
          observacoes_internas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          motivo_id?: string;
          status?: Database["public"]["Enums"]["denuncia_status"];
          relato?: string;
          local_ocorrencia?: string | null;
          vitima_nome_informado?: string | null;
          vitima_idade_informada?: number | null;
          vitima_endereco_informado?: string | null;
          vitima_nome_pai_informado?: string | null;
          vitima_nome_mae_informado?: string | null;
          vitima_escola_informada?: string | null;
          vitima_genero_informado?: string | null;
          observacoes_internas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "denuncias_motivo_id_fkey";
            columns: ["motivo_id"];
            isOneToOne: false;
            referencedRelation: "motivos_denuncia";
            referencedColumns: ["id"];
          },
        ];
      };
      vitimas: {
        Row: {
          id: string;
          nome: string | null;
          data_nascimento: string | null;
          idade_estimada: number | null;
          endereco: string | null;
          escola: string | null;
          responsavel_nome: string | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome?: string | null;
          data_nascimento?: string | null;
          idade_estimada?: number | null;
          endereco?: string | null;
          escola?: string | null;
          responsavel_nome?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string | null;
          data_nascimento?: string | null;
          idade_estimada?: number | null;
          endereco?: string | null;
          escola?: string | null;
          responsavel_nome?: string | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chamados: {
        Row: {
          id: string;
          denuncia_id: string | null;
          vitima_id: string | null;
          conselheiro_id: string | null;
          status: Database["public"]["Enums"]["chamado_status"];
          titulo: string;
          descricao: string | null;
          data_abertura: string;
          data_fechamento: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          denuncia_id?: string | null;
          vitima_id?: string | null;
          conselheiro_id?: string | null;
          status?: Database["public"]["Enums"]["chamado_status"];
          titulo: string;
          descricao?: string | null;
          data_abertura?: string;
          data_fechamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          denuncia_id?: string | null;
          vitima_id?: string | null;
          conselheiro_id?: string | null;
          status?: Database["public"]["Enums"]["chamado_status"];
          titulo?: string;
          descricao?: string | null;
          data_abertura?: string;
          data_fechamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chamados_denuncia_id_fkey";
            columns: ["denuncia_id"];
            isOneToOne: false;
            referencedRelation: "denuncias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chamados_vitima_id_fkey";
            columns: ["vitima_id"];
            isOneToOne: false;
            referencedRelation: "vitimas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chamados_conselheiro_id_fkey";
            columns: ["conselheiro_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      medidas_protetivas: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      encaminhamentos: {
        Row: {
          id: string;
          chamado_id: string;
          medida_protetiva_id: string | null;
          responsavel_id: string | null;
          descricao: string;
          orgao_destino: string | null;
          data_encaminhamento: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chamado_id: string;
          medida_protetiva_id?: string | null;
          responsavel_id?: string | null;
          descricao: string;
          orgao_destino?: string | null;
          data_encaminhamento?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chamado_id?: string;
          medida_protetiva_id?: string | null;
          responsavel_id?: string | null;
          descricao?: string;
          orgao_destino?: string | null;
          data_encaminhamento?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "encaminhamentos_chamado_id_fkey";
            columns: ["chamado_id"];
            isOneToOne: false;
            referencedRelation: "chamados";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "encaminhamentos_medida_protetiva_id_fkey";
            columns: ["medida_protetiva_id"];
            isOneToOne: false;
            referencedRelation: "medidas_protetivas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "encaminhamentos_responsavel_id_fkey";
            columns: ["responsavel_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: Database["public"]["Enums"]["audit_action"];
          entity_table: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: Database["public"]["Enums"]["audit_action"];
          entity_table: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: Database["public"]["Enums"]["audit_action"];
          entity_table?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      profile_role: "conselheiro" | "admin";
      denuncia_status:
        | "recebida"
        | "em_analise"
        | "convertida_em_chamado"
        | "arquivada";
      chamado_status: "aberto" | "em_atendimento" | "finalizado";
      audit_action: "create" | "read" | "update" | "status_change" | "delete";
    };
    CompositeTypes: Record<string, never>;
  };
};

