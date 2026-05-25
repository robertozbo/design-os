# API Types — Mirror do Backend

Tipos extraídos de `/Users/roberto.zbo/Desktop/Projetos/Nymos/backend/api/modules/*/types.ts` e `src/schema/*`. Mantidos como TypeScript puro (sem Zod, sem decoradores) pra serem consumidos pelos componentes do design-os-mobile.

**Regra:** o que vem do backend fica aqui. Tipos que são apenas UI (sparkline, delta formatado, cor de ícone, fonte humanizada) ficam em `sections/[id]/types.ts` estendendo os tipos da API.

## Modules cobertos

- `metric` — `Metric`, `MetricTypeInfo`, `CompositeFieldDefinition`
- `device` — `Device`, `DeviceType`, `DeviceSyncStatus`, `HealthKitPermission`
- (próximos: nutrition, activities, workouts, goals, body-evaluations, my-health, health-analysis, dashboard)

## Como atualizar

Quando o backend mudar tipos, repita:

```bash
# 1. Compare backend → api-types
diff /path/to/backend/api/modules/[name]/types.ts product-mobile/api-types/[name].ts

# 2. Aplique manualmente as mudanças relevantes (ignora Zod schemas)
```

Não importamos do backend diretamente porque:
- Backend usa Zod (não queremos peso aqui)
- Quer evitar acoplamento de build (workspaces npm exige config extra)
- Mantém este repo independente
