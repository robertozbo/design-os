export type ExerciseSource = "curated" | "custom";

export type SourceId = "todos" | "curados" | "customizados" | "favoritos";

export type MuscleGroupId =
  | "todos"
  | "peito"
  | "costas"
  | "pernas"
  | "posteriores"
  | "gluteos"
  | "ombros"
  | "bracos"
  | "core"
  | "cardio";

export type EquipmentId =
  | "todos"
  | "livre"
  | "barra"
  | "halteres"
  | "maquina"
  | "cabos"
  | "peso-corporal"
  | "kettlebell"
  | "elastico"
  | "outros";

export type MovementPatternId =
  | "todos"
  | "push"
  | "pull"
  | "squat"
  | "hinge"
  | "carry"
  | "lunge"
  | "rotation";

export type SortId = "name-asc" | "most-used" | "recent";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Exercise {
  id: string;
  name: string;
  source: ExerciseSource;
  isFavorite: boolean;
  primaryMuscle: string;
  secondaryMuscles: string[];
  muscleGroup: MuscleGroupId;
  equipment: EquipmentId;
  movementPattern: MovementPatternId;
  difficulty: Difficulty;
  averageTimeSeconds: number;
  videoUrl: string | null;
  gifUrl: string | null;
  fallbackImageUrl: string | null;
  instructions: string[];
  tips: string[];
  variations: string[];
  contraindications: string[];
}

export interface SourceOption {
  id: SourceId;
  label: string;
  count: number;
}

export interface MuscleGroupOption {
  id: MuscleGroupId;
  label: string;
  count: number;
}

export interface EquipmentOption {
  id: EquipmentId;
  label: string;
  count: number;
}

export interface MovementPatternOption {
  id: MovementPatternId;
  label: string;
  count: number;
}

export interface SortOption {
  id: SortId;
  label: string;
}

export interface ExerciseStats {
  total: number;
  curados: number;
  customizados: number;
  favoritos: number;
}

export interface EmptyStates {
  noResults: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

export interface ExerciciosProps {
  exercicios: Exercise[];
  sources: SourceOption[];
  selectedSource: SourceId;
  muscleGroups: MuscleGroupOption[];
  selectedMuscleGroup: MuscleGroupId;
  equipment: EquipmentOption[];
  selectedEquipment: EquipmentId;
  movementPatterns: MovementPatternOption[];
  selectedMovementPattern: MovementPatternId;
  sortOptions: SortOption[];
  selectedSort: SortId;
  stats: ExerciseStats;
  emptyStates: EmptyStates;
  searchQuery?: string;

  /** Update search query */
  onSearchChange?: (q: string) => void;
  /** Switch source filter (todos/curados/customizados/favoritos) */
  onSourceChange?: (id: SourceId) => void;
  /** Switch muscle group filter */
  onMuscleGroupChange?: (id: MuscleGroupId) => void;
  /** Switch equipment filter */
  onEquipmentChange?: (id: EquipmentId) => void;
  /** Switch movement pattern filter */
  onMovementPatternChange?: (id: MovementPatternId) => void;
  /** Switch sort */
  onSortChange?: (id: SortId) => void;
  /** Toggle favorite on an exercise */
  onToggleFavorite?: (exerciseId: string) => void;
  /** Open detail drawer for an exercise */
  onOpenDetail?: (exerciseId: string) => void;
  /** Open create form for a new custom exercise */
  onOpenCreate?: () => void;
  /** Clear all active filters */
  onClearFilters?: () => void;
  /** Duplicate a curated exercise as a custom one */
  onDuplicateAsCustom?: (exerciseId: string) => void;
  /** Open edit drawer for a custom exercise */
  onEdit?: (exerciseId: string) => void;
  /** Delete a custom exercise */
  onDelete?: (exerciseId: string) => void;
}
