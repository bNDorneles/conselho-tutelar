import { describe, expect, it } from "vitest";

import { getAdminNavItems } from "./navigation";

describe("getAdminNavItems", () => {
  it("shows daily workflow links to counselors", () => {
    const labels = getAdminNavItems("conselheiro").map((item) => item.label);

    expect(labels).toEqual([
      "Dashboard",
      "Denuncias",
      "Chamados",
      "Relatorios",
      "Area publica",
    ]);
  });

  it("shows maintenance links to admins", () => {
    const labels = getAdminNavItems("admin").map((item) => item.label);

    expect(labels).toEqual([
      "Dashboard",
      "Denuncias",
      "Chamados",
      "Conselheiros",
      "Motivos",
      "Medidas",
      "Conselho",
      "Relatorios",
      "Auditoria",
      "Area publica",
    ]);
  });
});
