"use client";

import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRight, CalendarClock, GripVertical, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  canTransitionDenunciaStatus,
  denunciaStatusLabels,
  isDenunciaStatus,
  type DenunciaStatus,
} from "@/lib/admin/denuncia-workflow";
import type { AdminDenuncia } from "@/lib/admin/denuncia-types";
import {
  buildAssigneeInitials,
  buildKanbanVictimLine,
  buildResponsibleLabel,
  summarizeKanbanText,
} from "@/lib/admin/kanban-card";
import {
  getDenunciaOperationalStage,
  operationalStageDescriptions,
  operationalStageColumns,
  operationalStageLabels,
  type OperationalStage,
} from "@/lib/admin/operational-flow";
import {
  getOperationalStageTone,
  getStatusToneClass,
} from "@/lib/admin/visual-status";

type StatusGroups = Record<OperationalStage, AdminDenuncia[]>;

type DenunciasKanbanProps = {
  groups: StatusGroups;
  statusActions: Partial<Record<OperationalStage, DenunciaStatus[]>>;
  updateStatusAction: (formData: FormData) => void;
  moveStatusAction: (input: {
    denunciaId: string;
    fromStatus: DenunciaStatus;
    toStatus: DenunciaStatus;
  }) => Promise<void>;
};

function formatDashboardDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function operationalStageToDenunciaStatus(
  stage: OperationalStage,
): DenunciaStatus | null {
  if (stage === "recebida" || stage === "atribuida" || stage === "em_analise") {
    return stage;
  }

  if (stage === "arquivada") {
    return "arquivada";
  }

  return null;
}

function DroppableColumn({
  status,
  children,
}: {
  status: OperationalStage;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`flex max-h-[calc(100vh-260px)] min-h-[470px] w-[304px] shrink-0 flex-col rounded-lg border bg-muted/55 shadow-sm transition-colors ${
        isOver ? "border-primary bg-primary/10 ring-2 ring-primary/20" : ""
      }`}
    >
      {children}
    </section>
  );
}

function DraggableCard({
  denuncia,
  children,
}: {
  denuncia: AdminDenuncia;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: denuncia.id,
      data: { status: denuncia.status },
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} className="cursor-grab touch-none active:cursor-grabbing">
        {children}
      </div>
    </div>
  );
}

function StageCard({
  denuncia,
  status,
  statusActions,
  updateStatusAction,
}: {
  denuncia: AdminDenuncia;
  status: OperationalStage;
  statusActions: Partial<Record<OperationalStage, DenunciaStatus[]>>;
  updateStatusAction: (formData: FormData) => void;
}) {
  const operationalStage = getDenunciaOperationalStage(denuncia);
  const responsibleName = denuncia.profiles?.nome ?? null;
  const nextActions = statusActions[status]?.filter((nextStatus) =>
    canTransitionDenunciaStatus(denuncia.status, nextStatus),
  );

  return (
    <article className="rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge
          variant="outline"
          className={`min-w-0 max-w-[210px] rounded-md px-2 py-1 text-[11px] leading-4 ${getStatusToneClass(
            getOperationalStageTone(operationalStage),
          )}`}
        >
          <span className="truncate">
            {denuncia.motivos_denuncia?.nome ?? "Sem motivo"}
          </span>
        </Badge>
        <GripVertical
          className="mt-1 size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <p className="mb-3 break-words text-sm font-medium leading-6">
        {summarizeKanbanText(denuncia.relato, 88)}
      </p>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {buildKanbanVictimLine(
              denuncia.vitima_nome_informado,
              denuncia.vitima_idade_informada,
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{formatDashboardDate(denuncia.created_at)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
            {buildAssigneeInitials(responsibleName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">
              {buildResponsibleLabel(responsibleName)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {operationalStageLabels[operationalStage]}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/denuncias/${denuncia.id}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-primary transition-colors hover:bg-muted"
          aria-label="Abrir detalhe da denuncia"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {nextActions && nextActions.length > 0 ? (
        <details className="mt-3 rounded-md border bg-background px-2 py-1.5">
          <summary className="cursor-pointer list-none text-xs font-medium text-muted-foreground">
            Acoes rapidas
          </summary>
          <div className="mt-2 grid gap-2">
            {nextActions.map((nextStatus) => (
              <form key={nextStatus} action={updateStatusAction}>
                <input type="hidden" name="denuncia_id" value={denuncia.id} />
                <input
                  type="hidden"
                  name="from_status"
                  value={denuncia.status}
                />
                <input type="hidden" name="to_status" value={nextStatus} />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="h-auto min-h-7 w-full whitespace-normal text-xs"
                >
                  Mover para {denunciaStatusLabels[nextStatus]}
                </Button>
              </form>
            ))}
          </div>
        </details>
      ) : null}
    </article>
  );
}

export function DenunciasKanban({
  groups,
  statusActions,
  updateStatusAction,
  moveStatusAction,
}: DenunciasKanbanProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onDragEnd(event: DragEndEvent) {
    const denunciaId = String(event.active.id);
    const fromStatus = event.active.data.current?.status as
      | DenunciaStatus
      | undefined;
    const toStage = String(event.over?.id ?? "") as OperationalStage;
    const toStatus = operationalStageToDenunciaStatus(toStage);

    if (
      !fromStatus ||
      !toStatus ||
      !isDenunciaStatus(toStatus) ||
      fromStatus === toStatus
    ) {
      return;
    }

    if (!canTransitionDenunciaStatus(fromStatus, toStatus)) {
      return;
    }

    startTransition(async () => {
      await moveStatusAction({ denunciaId, fromStatus, toStatus });
      router.refresh();
    });
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      {isPending ? (
        <p className="mb-3 rounded-lg border bg-secondary/45 px-3 py-2 text-sm text-muted-foreground">
          Atualizando Kanban...
        </p>
      ) : null}
      <div className="mb-4 flex flex-col gap-2 rounded-lg border bg-secondary/35 px-4 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Board operacional: arraste cards entre etapas permitidas e acompanhe
          responsavel, motivo e status em cada cartao.
        </p>
        <p className="text-xs">
          Chamado, medida e encaminhamento sao atualizados pelos dados internos.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card/55 p-3 pb-5">
        <div className="flex min-w-max gap-3">
        {operationalStageColumns.map((status) => (
          <DroppableColumn key={status} status={status}>
            <div className="space-y-2 border-b bg-card/80 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold leading-5">
                  {operationalStageLabels[status]}
                </h2>
                <Badge
                  variant="outline"
                  className={`rounded-full ${getStatusToneClass(
                    getOperationalStageTone(status),
                  )}`}
                >
                  {groups[status].length}
                </Badge>
              </div>
              <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                {operationalStageDescriptions[status]}
              </p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-2.5">
              {groups[status].length > 0 ? (
                groups[status].map((denuncia) => (
                  <DraggableCard key={denuncia.id} denuncia={denuncia}>
                    <StageCard
                      denuncia={denuncia}
                      status={status}
                      statusActions={statusActions}
                      updateStatusAction={updateStatusAction}
                    />
                  </DraggableCard>
                ))
              ) : (
                <p className="rounded-lg border border-dashed bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
                  Nenhum cartao nesta lista.
                </p>
              )}
            </div>
          </DroppableColumn>
        ))}
        </div>
      </div>
    </DndContext>
  );
}
