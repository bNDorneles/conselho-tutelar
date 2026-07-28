import { describe, expect, it } from "vitest";

import {
  buildAssigneeInitials,
  buildKanbanVictimLine,
  buildResponsibleLabel,
  summarizeKanbanText,
} from "./kanban-card";

describe("kanban card presentation helpers", () => {
  it("builds readable initials for assigned counselors", () => {
    expect(buildAssigneeInitials("Maria Silva")).toBe("MS");
    expect(buildAssigneeInitials("Administrador")).toBe("A");
    expect(buildAssigneeInitials(null)).toBe("?");
  });

  it("builds victim line with optional age", () => {
    expect(buildKanbanVictimLine("Luiza", 8)).toBe("Luiza, 8 anos");
    expect(buildKanbanVictimLine("", null)).toBe("Vitima nao informada");
  });

  it("summarizes long relatos without breaking short text", () => {
    expect(summarizeKanbanText("Relato curto", 30)).toBe("Relato curto");
    expect(summarizeKanbanText("A".repeat(40), 20)).toBe(`${"A".repeat(20)}...`);
  });

  it("shows assignment status clearly", () => {
    expect(buildResponsibleLabel("Joao")).toBe("Joao");
    expect(buildResponsibleLabel(null)).toBe("Sem responsavel");
  });
});
