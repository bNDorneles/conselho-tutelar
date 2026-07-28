export function summarizeKanbanText(value: string, maxLength = 90) {
  const normalized = value.trim();

  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength)}...`
    : normalized;
}

export function buildAssigneeInitials(name: string | null | undefined) {
  const parts = name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts || parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function buildResponsibleLabel(name: string | null | undefined) {
  const normalized = name?.trim();

  return normalized || "Sem responsavel";
}

export function buildKanbanVictimLine(
  victimName: string | null | undefined,
  victimAge: number | null | undefined,
) {
  const name = victimName?.trim();

  if (!name && !victimAge) {
    return "Vitima nao informada";
  }

  if (name && victimAge) {
    return `${name}, ${victimAge} anos`;
  }

  return name || `${victimAge} anos`;
}
