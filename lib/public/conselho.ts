import { createServerSupabaseClient } from "../supabase/server";

export type RawConselhoInfo = {
  nome: string | null;
  municipio: string | null;
  uf: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  horario_atendimento: string | null;
  whatsapp?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  mapa_url?: string | null;
};

export type PublicConselhoInfo = {
  name: string;
  cityLabel: string;
  address: string;
  fullAddress: string;
  phone: string;
  whatsappLabel: string;
  email: string;
  hours: string;
  mapUrl: string | null;
  socialLinks: Array<{
    label: "Facebook" | "Instagram";
    href: string;
  }>;
};

const DEFAULT_CITY = "Sao Borja";
const DEFAULT_UF = "RS";

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function formatConselhoAddress(
  info: Pick<RawConselhoInfo, "endereco" | "municipio" | "uf">,
) {
  const address = clean(info.endereco);
  const city = clean(info.municipio) ?? DEFAULT_CITY;
  const uf = clean(info.uf) ?? DEFAULT_UF;
  const cityState = `${city}/${uf}`;

  return address ? `${address} - ${cityState}` : cityState;
}

export function normalizeConselhoInfo(
  info: RawConselhoInfo | null,
): PublicConselhoInfo {
  const city = clean(info?.municipio) ?? DEFAULT_CITY;
  const uf = clean(info?.uf) ?? DEFAULT_UF;
  const facebook = clean(info?.facebook_url);
  const instagram = clean(info?.instagram_url);

  return {
    name: clean(info?.nome) ?? "Conselho Tutelar",
    cityLabel: `${city} - ${uf}`,
    address: clean(info?.endereco) ?? "Endereco institucional a confirmar",
    fullAddress: formatConselhoAddress({
      endereco: info?.endereco ?? null,
      municipio: city,
      uf,
    }),
    phone: clean(info?.telefone) ?? "Contato institucional a confirmar",
    whatsappLabel:
      clean(info?.whatsapp) ?? "WhatsApp institucional a confirmar",
    email: clean(info?.email) ?? "E-mail institucional a confirmar",
    hours:
      clean(info?.horario_atendimento) ??
      "Horario de atendimento institucional a confirmar",
    mapUrl: clean(info?.mapa_url),
    socialLinks: [
      facebook ? { label: "Facebook" as const, href: facebook } : null,
      instagram ? { label: "Instagram" as const, href: instagram } : null,
    ].filter((link): link is PublicConselhoInfo["socialLinks"][number] =>
      Boolean(link),
    ),
  };
}

export async function getPublicConselhoInfo() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("conselho_tutelar")
    .select(
      "nome, municipio, uf, endereco, telefone, email, horario_atendimento, whatsapp, facebook_url, instagram_url, mapa_url",
    )
    .limit(1)
    .maybeSingle();

  return normalizeConselhoInfo(data);
}
