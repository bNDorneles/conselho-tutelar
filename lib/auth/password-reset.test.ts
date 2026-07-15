import { describe, expect, it } from "vitest";

import {
  buildPasswordResetRedirectUrl,
  validatePasswordResetEmail,
  validatePasswordUpdate,
} from "./password-reset";

describe("password reset helpers", () => {
  it("requires a valid email to request password recovery", () => {
    expect(validatePasswordResetEmail("")).toEqual({
      ok: false,
      error: "missing_email",
    });
    expect(validatePasswordResetEmail("conselheiro@exemplo.com")).toEqual({
      ok: true,
      email: "conselheiro@exemplo.com",
    });
  });

  it("builds reset redirect URL from the configured application origin", () => {
    expect(
      buildPasswordResetRedirectUrl({
        appUrl: "https://conselho.example.com/",
        path: "/login/redefinir-senha",
      }),
    ).toBe("https://conselho.example.com/login/redefinir-senha");
  });

  it("validates password update with confirmation", () => {
    expect(validatePasswordUpdate("123", "123")).toEqual({
      ok: false,
      error: "weak_password",
    });
    expect(validatePasswordUpdate("senha-segura-123", "outra")).toEqual({
      ok: false,
      error: "password_mismatch",
    });
    expect(validatePasswordUpdate("senha-segura-123", "senha-segura-123")).toEqual({
      ok: true,
      password: "senha-segura-123",
    });
  });
});
