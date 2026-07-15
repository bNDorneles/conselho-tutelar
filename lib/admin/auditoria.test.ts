import { describe, expect, it } from "vitest";

import {
  formatAuditAction,
  formatAuditEntity,
  summarizeAuditMetadata,
} from "./auditoria";

describe("auditoria helpers", () => {
  it("formats audit actions for administrative screens", () => {
    expect(formatAuditAction("read")).toBe("Leitura");
    expect(formatAuditAction("status_change")).toBe("Mudanca de status");
  });

  it("formats known audit entities", () => {
    expect(formatAuditEntity("denuncias")).toBe("Denuncia");
    expect(formatAuditEntity("chamados")).toBe("Chamado");
  });

  it("summarizes status changes and assignment metadata", () => {
    expect(
      summarizeAuditMetadata({
        status_anterior: "recebida",
        status_novo: "atribuida",
      }),
    ).toBe("Status: recebida -> atribuida");

    expect(
      summarizeAuditMetadata({
        conselheiro_responsavel_id: "abc",
        status_novo: "atribuida",
      }),
    ).toBe("Status novo: atribuida. Conselheiro vinculado.");
  });
});
