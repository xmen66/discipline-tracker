import { UserState, IdentityRank } from '../types';

export class DisciplineEngine {
  static calculateScore(state: UserState): number {
    const habitWeight = 0.4;
    const hydrationWeight = 0.2;
    const fitnessWeight = 0.2;
    const focusWeight = 0.2;

    // Habit Score (0-1)
    const activeHabits = state.habits;
    const completedHabits = activeHabits.filter(h => h.completed).length;
    const habitScore = activeHabits.length > 0 ? completedHabits / activeHabits.length : 1;

    // Dynamic Hydration Target: Base 2000ml + 50ml per 1000 steps
    const waterTarget = 2000 + (Math.floor(state.steps / 1000) * 50);
    const hydrationScore = Math.min(state.waterIntake / waterTarget, 1);

    // Fitness Score (0-1) - Habits + Steps (Target 10k)
    const physicalHabits = state.habits.filter(h => h.category === 'Physical');
    const physicalCompleted = physicalHabits.filter(h => h.completed).length;
    const physicalHabitScore = physicalHabits.length > 0 ? physicalCompleted / physicalHabits.length : 1;
    
    const stepsScore = Math.min(state.steps / 10000, 1);
    const weightLogged = state.weight > 0 ? 1 : 0;
    
    // Recovery Score (0-1) - based on sleep
    const sleepScore = Math.min(state.sleepHours / 8, 1);
    const sleepQualityScore = state.sleepQuality / 100;
    const combinedFitnessScore = (physicalHabitScore * 0.3) + (stepsScore * 0.3) + (weightLogged * 0.1) + (sleepScore * 0.15) + (sleepQualityScore * 0.15);

    // Focus Score (0-1)
    const focusHabits = state.habits.filter(h => h.category === 'Focus');
    const focusCompleted = focusHabits.filter(h => h.completed).length;
    const focusScore = focusHabits.length > 0 ? focusCompleted / focusHabits.length : 1;

    const totalScore = (
      (habitScore * habitWeight) +
      (hydrationScore * hydrationWeight) +
      (combinedFitnessScore * fitnessWeight) +
      (focusScore * focusWeight)
    ) * 100;

    return Math.round(totalScore);
  }

  static getRank(score: number): IdentityRank {
    if (score < 20) return 'The Drifter';
    if (score < 40) return 'The Seeker';
    if (score < 60) return 'The Warrior';
    if (score < 80) return 'The Elite';
    return 'The Stoic Master';
  }
}
