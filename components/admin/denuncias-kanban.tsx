"use client";

import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  canTransitionDenunciaStatus,
  denunciaStatusLabels,
  isDenunciaStatus,
  type DenunciaStatus,
} from "@/lib/admin/denuncia-workflow";
import type { AdminDenuncia } from "@/lib/admin/denuncia-types";
import {
  getDenunciaOperationalStage,
  operationalStageColumns,
  operationalStageLabels,
  type OperationalStage,
} from "@/lib/admin/operational-flow";

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
    timeStyle: "short",
  }).format(new Date(value));
}

function summarizeText(value: string, maxLength = 120) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
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
      className={`min-h-64 rounded-lg border bg-card transition-colors ${
        isOver ? "border-primary bg-secondary/45" : ""
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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        {children}
      </div>
    </div>
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
    const toStatus = String(event.over?.id ?? "");

    if (
      !fromStatus ||
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
      <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
        {operationalStageColumns.map((status) => (
          <DroppableColumn key={status} status={status}>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">
                {operationalStageLabels[status]}
              </h2>
              <Badge variant="secondary" className="rounded-lg">
                {groups[status].length}
              </Badge>
            </div>
            <div className="space-y-3 p-3">
              {groups[status].length > 0 ? (
                groups[status].map((denuncia) => (
                  <DraggableCard key={denuncia.id} denuncia={denuncia}>
                    <Card className="rounded-lg">
                      <CardHeader className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="outline" className="rounded-lg">
                            {denuncia.motivos_denuncia?.nome ?? "Sem motivo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDashboardDate(denuncia.created_at)}
                          </span>
                        </div>
                        <CardDescription className="leading-6">
                          {summarizeText(denuncia.relato, 120)}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground">
                          Responsavel:{" "}
                          {denuncia.profiles?.nome ?? "Nao atribuido"}
                        </p>
                          {denuncia.chamados?.[0] ? (
                            <p className="text-xs font-medium text-primary">
                              {operationalStageLabels[
                                getDenunciaOperationalStage(denuncia)
                              ]}
                            </p>
                          ) : null}
                      </CardHeader>
                      <CardContent className="space-y-3 p-4 pt-0">
                        <Link
                          href={`/admin/denuncias/${denuncia.id}`}
                          className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                        >
                          Abrir detalhe
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        {(statusActions[status]?.length ?? 0) > 0 ? (
                          <div className="grid gap-2">
                            {statusActions[status]?.map((nextStatus) =>
                              canTransitionDenunciaStatus(
                                denuncia.status,
                                nextStatus,
                              ) ? (
                                <form
                                  key={nextStatus}
                                  action={updateStatusAction}
                                >
                                  <input
                                    type="hidden"
                                    name="denuncia_id"
                                    value={denuncia.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="from_status"
                                    value={denuncia.status}
                                  />
                                  <input
                                    type="hidden"
                                    name="to_status"
                                    value={nextStatus}
                                  />
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    Mover para{" "}
                                    {denunciaStatusLabels[nextStatus]}
                                  </Button>
                                </form>
                              ) : null,
                            )}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </DraggableCard>
                ))
              ) : (
                <p className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  Nenhuma denuncia nesta coluna.
                </p>
              )}
            </div>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
