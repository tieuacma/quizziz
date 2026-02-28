// Helper to generate unique ID
export function generateId(): string {
    return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
