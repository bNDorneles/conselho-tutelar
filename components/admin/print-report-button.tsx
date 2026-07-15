"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintReportButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Printer className="mr-2 size-4" aria-hidden="true" />
      Gerar PDF
    </Button>
  );
}
