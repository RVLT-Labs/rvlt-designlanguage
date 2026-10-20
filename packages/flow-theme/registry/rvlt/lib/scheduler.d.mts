export interface TimedShift { id: string; startHour: number; endHour: number }
export interface LayoutShift<T extends TimedShift> {
  shift: T;
  start: number;
  end: number;
  lane: number;
  clash: boolean;
}
export function layoutShifts<T extends TimedShift>(shifts: T[]): LayoutShift<T>[];
export function formatHour(hour: number): string;
export function canAssign(row: { unavailable?: boolean; shifts: TimedShift[] }, shift: TimedShift): boolean;
