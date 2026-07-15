import {
  CheckCircle2,
  Circle,
  CircleDot,
  FileCheck2,
  FileSearch,
  FileWarning,
  Handshake,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  operationalStageColumns,
  operationalStageLabels,
  type OperationalStage,
} from "@/lib/admin/operational-flow";
import {
  getOperationalStageTone,
  getStatusToneClass,
} from "@/lib/admin/visual-status";

const stageIcons = {
  recebida: FileWarning,
  atribuida: CircleDot,
  em_analise: FileSearch,
  chamado_aberto: FileCheck2,
  medida_aplicada: ShieldCheck,
  encaminhamento: Handshake,
  finalizado: CheckCircle2,
  arquivada: Circle,
};

type OperationalTimelineProps = {
  currentStage: OperationalStage;
};

export function OperationalTimeline({ currentStage }: OperationalTimelineProps) {
  const currentIndex = operationalStageColumns.indexOf(currentStage);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Fluxo do atendimento</p>
          <p className="text-xs text-muted-foreground">
            Etapas calculadas a partir da denuncia e do chamado vinculado.
          </p>
        </div>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {operationalStageColumns.map((stage, index) => {
          const Icon = stageIcons[stage];
          const active = stage === currentStage;
          const complete = index < currentIndex && currentStage !== "arquivada";

          return (
            <li
              key={stage}
              className={cn(
                "flex min-h-12 items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                active
                  ? getStatusToneClass(getOperationalStageTone(stage))
                  : complete
                    ? "border-emerald-100 bg-emerald-50/60 text-emerald-800"
                    : "border-border bg-background text-muted-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="font-medium">{operationalStageLabels[stage]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
