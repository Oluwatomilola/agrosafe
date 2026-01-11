export function getErrorMessage(err: unknown): string {
    if (!err) return "Unknown error occurred";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybe = err as any;
        return maybe?.message || JSON.stringify(maybe) || "Unknown error occurred";
    } catch {
        return "Unknown error occurred";
    }
}
