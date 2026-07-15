import { describe, expect, it } from "vitest";

import { formatConselhoAddress, normalizeConselhoInfo } from "./conselho";

describe("normalizeConselhoInfo", () => {
  it("uses citizen-facing defaults when institutional data is missing", () => {
    const info = normalizeConselhoInfo(null);

    expect(info.name).toBe("Conselho Tutelar");
    expect(info.cityLabel).toBe("Sao Borja - RS");
    expect(info.phone).toBe("Contato institucional a confirmar");
    expect(info.whatsappLabel).toBe("WhatsApp institucional a confirmar");
    expect(info.email).toBe("E-mail institucional a confirmar");
    expect(info.socialLinks).toEqual([]);
  });

  it("keeps public contact channels when they are available", () => {
    const info = normalizeConselhoInfo({
      nome: "Conselho Tutelar de Sao Borja",
      municipio: "Sao Borja",
      uf: "RS",
      endereco: "Rua Felix da Cunha, 123",
      telefone: "(55) 3431-0000",
      email: "conselho@example.com",
      horario_atendimento: "Segunda a sexta, 8h as 18h",
      whatsapp: "55999990000",
      facebook_url: "https://facebook.com/conselhotutelar",
      instagram_url: "https://instagram.com/conselhotutelar",
      mapa_url: "https://maps.example.com",
    });

    expect(info.name).toBe("Conselho Tutelar de Sao Borja");
    expect(info.cityLabel).toBe("Sao Borja - RS");
    expect(info.address).toBe("Rua Felix da Cunha, 123");
    expect(info.phone).toBe("(55) 3431-0000");
    expect(info.whatsappLabel).toBe("55999990000");
    expect(info.email).toBe("conselho@example.com");
    expect(info.hours).toBe("Segunda a sexta, 8h as 18h");
    expect(info.mapUrl).toBe("https://maps.example.com");
    expect(info.socialLinks).toEqual([
      { label: "Facebook", href: "https://facebook.com/conselhotutelar" },
      { label: "Instagram", href: "https://instagram.com/conselhotutelar" },
    ]);
  });
});

describe("formatConselhoAddress", () => {
  it("combines address and city without duplicating empty parts", () => {
    expect(
      formatConselhoAddress({
        endereco: "Rua Felix da Cunha, 123",
        municipio: "Sao Borja",
        uf: "RS",
      }),
    ).toBe("Rua Felix da Cunha, 123 - Sao Borja/RS");

    expect(
      formatConselhoAddress({
        endereco: null,
        municipio: "Sao Borja",
        uf: "RS",
      }),
    ).toBe("Sao Borja/RS");
  });
});
